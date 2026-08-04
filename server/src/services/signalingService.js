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
    this.peers = new Map(); // socketId -> Peer Metadata { id, deviceName, type, ip, joinedAt }
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
    logger.info('Socket.IO Signaling Service running with CORS origin:', corsOrigin);
  }

  setupListeners() {
    this.io.on(EVENTS.CONNECTION, (socket) => {
      logger.network('CLIENT_CONNECT', socket.id, `Remote IP: ${socket.handshake.address}`);

      // Register new peer upon joining mesh
      socket.on(EVENTS.PEER_JOINED, (metadata) => {
        const peerData = {
          id: socket.id,
          deviceName: metadata.deviceName || `Veil-Node-${socket.id.substring(0, 5)}`,
          deviceType: metadata.deviceType || 'Desktop',
          joinedAt: new Date().toISOString()
        };
        
        this.peers.set(socket.id, peerData);
        logger.network(EVENTS.PEER_JOINED, socket.id, `Device: ${peerData.deviceName}`);

        // Notify caller of current mesh state (except self)
        const otherPeers = Array.from(this.peers.values()).filter(p => p.id !== socket.id);
        socket.emit(EVENTS.PEER_LIST_UPDATE, otherPeers);

        // Broadcast to all other peers that a new device arrived on the mesh
        socket.broadcast.emit(EVENTS.PEER_JOINED, peerData);
      });

      // Relay WebRTC or P2P transfer offers directly to targeted peer
      socket.on(EVENTS.TRANSFER_INITIATE, (data) => {
        const { targetPeerId, fileMetadata, senderName } = data;
        logger.network(EVENTS.TRANSFER_INITIATE, socket.id, `-> target: ${targetPeerId}, file: ${fileMetadata.name}`);
        this.io.to(targetPeerId).emit(EVENTS.TRANSFER_INITIATE, {
          senderId: socket.id,
          senderName,
          fileMetadata
        });
      });

      socket.on(EVENTS.TRANSFER_PROGRESS, (data) => {
        const { targetPeerId, transferId, progress } = data;
        this.io.to(targetPeerId).emit(EVENTS.TRANSFER_PROGRESS, { transferId, progress });
      });

      socket.on(EVENTS.TRANSFER_COMPLETE, (data) => {
        const { targetPeerId, transferId, fileName } = data;
        this.io.to(targetPeerId).emit(EVENTS.TRANSFER_COMPLETE, { transferId, fileName, senderId: socket.id });
      });

      // Handle connection cleanup
      socket.on(EVENTS.DISCONNECT, (reason) => {
        const removedPeer = this.peers.get(socket.id);
        if (removedPeer) {
          this.peers.delete(socket.id);
          this.io.emit(EVENTS.PEER_LEFT, { id: socket.id, deviceName: removedPeer.deviceName });
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
