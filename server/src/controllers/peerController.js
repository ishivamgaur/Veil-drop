import { signalingService } from '../services/signalingService.js';

/**
 * Peer Discovery & Health Controller
 * Serves API inquiries regarding active mesh topologies and health diagnostics.
 */
export const peerController = {
  getSystemHealth: (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'Veil Drop Mesh Network',
      timestamp: new Date().toISOString(),
      activeConnections: signalingService.getActivePeersCount()
    });
  },

  listActivePeers: (req, res) => {
    const peers = signalingService.getAllActivePeers();
    res.status(200).json({
      success: true,
      count: peers.length,
      peers: peers
    });
  }
};
