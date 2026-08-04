import { io } from 'socket.io-client';

/**
 * Socket.IO Real-Time Networking Service
 * Manages WebSocket connection persistence, P2P discovery signals, and fallback simulations.
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.serverUrl = 'http://localhost:5000';
    this.isConnected = false;
  }

  connect(deviceMetadata, onPeersUpdated) {
    if (this.socket && this.socket.connected) return;

    try {
      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('⚡ [Signaling Service] Connected to server via Socket ID:', this.socket.id);
        this.isConnected = true;
        this.socket.emit('peer:joined', deviceMetadata);
      });

      this.socket.on('peer:list_update', (peers) => {
        if (onPeersUpdated) onPeersUpdated(peers);
      });

      this.socket.on('peer:joined', (newPeer) => {
        console.log('📡 [Mesh Discovery] New peer joined:', newPeer.deviceName);
      });

      this.socket.on('disconnect', () => {
        console.warn('⚠️ [Signaling Service] Disconnected from server.');
        this.isConnected = false;
      });
    } catch (err) {
      console.error('Socket initial connection exception:', err);
    }
  }

  emitTransferInitiate(targetPeerId, fileMetadata, senderName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('transfer:initiate', { targetPeerId, fileMetadata, senderName });
    }
  }

  emitTransferProgress(targetPeerId, transferId, progress) {
    if (this.socket && this.isConnected) {
      this.socket.emit('transfer:progress', { targetPeerId, transferId, progress });
    }
  }

  emitTransferComplete(targetPeerId, transferId, fileName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('transfer:complete', { targetPeerId, transferId, fileName });
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
