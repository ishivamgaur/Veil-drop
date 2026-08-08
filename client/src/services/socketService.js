import { io } from 'socket.io-client';

/**
 * Socket.IO Real-Time Networking Service
 * Manages WebSocket connection persistence, P2P discovery signals, and fallback simulations.
 */
class SocketService {
  constructor() {
    this.socket = null;
    // In dev, connect to local backend. In prod, connect to VITE_API_URL or fallback to relative URL.
    this.serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.isConnected = false;
  }

  connect(deviceMetadata, onPeersUpdated, onPeerLeft) {
    if (this.socket && this.socket.connected) return;

    try {
      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 5000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect_error', (err) => {
        console.warn('⚠️ [Signaling Service] Connection error:', err.message);
        this.isConnected = false;
      });

      this.socket.on('connect', () => {
        console.log('⚡ [Signaling Service] Connected via Socket ID:', this.socket.id);
        this.isConnected = true;
        this.joinRoom(deviceMetadata);
      });

      this.socket.on('peer:list_update', (peers) => {
        if (onPeersUpdated) onPeersUpdated(peers);
      });

      this.socket.on('peer:joined', (newPeer) => {
        console.log('📡 [Mesh Discovery] New peer joined:', newPeer.deviceName);
      });

      this.socket.on('peer:left', (peer) => {
        console.log('📡 [Mesh Discovery] Peer left:', peer.deviceName);
        if (onPeerLeft) onPeerLeft(peer.id);
      });

      this.socket.on('disconnect', () => {
        console.warn('⚠️ [Signaling Service] Disconnected from server.');
        this.isConnected = false;
      });
    } catch (err) {
      console.error('Socket initial connection exception:', err);
    }
  }

  // Safely join a room (used to switch from Subnet Radar to Private Tunnel)
  joinRoom(metadata) {
    if (this.socket && this.isConnected) {
      this.socket.emit('peer:joined', metadata);
    } else if (this.socket) {
      // If still connecting, queue it to run once connected
      this.socket.once('connect', () => {
        this.socket.emit('peer:joined', metadata);
      });
    }
  }

  // --- WebRTC Signaling ---
  emitSignalOffer(targetPeerId, offer, fileMetadata) {
    if (this.socket && this.isConnected) {
      this.socket.emit('signal:offer', { targetPeerId, offer, fileMetadata });
    }
  }

  emitSignalAnswer(targetPeerId, answer) {
    if (this.socket && this.isConnected) {
      this.socket.emit('signal:answer', { targetPeerId, answer });
    }
  }

  emitSignalIceCandidate(targetPeerId, candidate) {
    if (this.socket && this.isConnected) {
      this.socket.emit('signal:ice_candidate', { targetPeerId, candidate });
    }
  }

  // --- Generic Event Listener Registration ---
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketService = new SocketService();
