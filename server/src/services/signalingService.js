import { Server } from 'socket.io';
import { EVENTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * Signaling & Discovery Service
 * Orchestrates localized WebSocket interactions, connection tracking, and P2P handshakes.
 */
class SignalingService {
  constructor() {
    this.io = null;
    this.peers = new Map(); // socketId -> Peer Metadata { id, deviceName, deviceType, joinedAt, roomId }
  }

  /**
   * Initialize Socket.IO server bound to HTTP server
   */
  initialize(httpServer, corsOrigin) {
    this.io = new Server(httpServer, {
      cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST']
      }
    });

    this.setupListeners();
    logger.info(`Socket.IO Signaling Service running with CORS origin: ${corsOrigin}`);
  }

  setupListeners() {
    this.io.on(EVENTS.CONNECTION, (socket) => {
      // Determine Public IP for Local Radar (Subnet Discovery) grouping
      let clientIp = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
      // Normalize local development IPs
      if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') clientIp = '127.0.0.1';

      logger.network('CLIENT_CONNECT', socket.id, `Remote IP: ${clientIp}`);

      // 1. Peer Joins the Mesh (Radar or Private Room)
      socket.on(EVENTS.PEER_JOINED, (metadata = {}) => {
        // If a roomId is provided, they are using a Private Link. Otherwise, group by IP (Radar)
        const roomId = metadata.roomId || clientIp;
        
        socket.join(roomId);
        socket.roomId = roomId; // Cache on socket for easy cleanup
        
        const peerData = {
          id: socket.id,
          deviceName: metadata.deviceName || `Veil-Node-${socket.id.substring(0, 4)}`,
          deviceType: metadata.deviceType || 'Desktop',
          joinedAt: new Date().toISOString(),
          roomId
        };
        
        this.peers.set(socket.id, peerData);
        logger.network(EVENTS.PEER_JOINED, socket.id, `Device: ${peerData.deviceName}, Room: ${roomId}`);

        // Extract peers only in this specific room
        const peersInRoom = Array.from(this.peers.values()).filter(p => p.roomId === roomId && p.id !== socket.id);
        
        // Send existing peers to the newly joined peer
        socket.emit(EVENTS.PEER_LIST_UPDATE, peersInRoom);

        // Broadcast to all other peers IN THE ROOM that a new device arrived
        socket.to(roomId).emit(EVENTS.PEER_JOINED, peerData);
      });

      // 2. WebRTC Signaling Relays (Offer, Answer, ICE Candidates)
      socket.on(EVENTS.SIGNAL_OFFER, (data) => {
        logger.network(EVENTS.SIGNAL_OFFER, socket.id, `-> target: ${data.targetPeerId}`);
        this.io.to(data.targetPeerId).emit(EVENTS.SIGNAL_OFFER, {
          senderId: socket.id,
          offer: data.offer,
          fileMetadata: data.fileMetadata // Include file metadata so receiver can prompt user
        });
      });

      socket.on(EVENTS.SIGNAL_ANSWER, (data) => {
        logger.network(EVENTS.SIGNAL_ANSWER, socket.id, `-> target: ${data.targetPeerId}`);
        this.io.to(data.targetPeerId).emit(EVENTS.SIGNAL_ANSWER, {
          senderId: socket.id,
          answer: data.answer
        });
      });

      socket.on(EVENTS.SIGNAL_ICE_CANDIDATE, (data) => {
        this.io.to(data.targetPeerId).emit(EVENTS.SIGNAL_ICE_CANDIDATE, {
          senderId: socket.id,
          candidate: data.candidate
        });
      });

      // 3. Optional Event Relays for tracking file transfer UI progress if WebRTC data channel isn't used for progress
      socket.on(EVENTS.TRANSFER_PROGRESS, (data) => {
        this.io.to(data.targetPeerId).emit(EVENTS.TRANSFER_PROGRESS, { 
          transferId: data.transferId, 
          progress: data.progress 
        });
      });

      socket.on(EVENTS.TRANSFER_COMPLETE, (data) => {
        this.io.to(data.targetPeerId).emit(EVENTS.TRANSFER_COMPLETE, { 
          transferId: data.transferId, 
          fileName: data.fileName, 
          senderId: socket.id 
        });
      });

      // 4. Handle Disconnects cleanly
      socket.on(EVENTS.DISCONNECT, (reason) => {
        const removedPeer = this.peers.get(socket.id);
        if (removedPeer) {
          this.peers.delete(socket.id);
          this.io.to(removedPeer.roomId).emit(EVENTS.PEER_LEFT, { 
            id: socket.id, 
            deviceName: removedPeer.deviceName 
          });
        }
        logger.network('CLIENT_DISCONNECT', socket.id, `Reason: ${reason}`);
      });
    });
  }

  getAllActivePeers() {
    return Array.from(this.peers.values());
  }

  getActivePeersCount() {
    return this.peers.size;
  }
}

export const signalingService = new SignalingService();
