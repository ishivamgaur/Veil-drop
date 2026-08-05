import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

/**
 * Custom Hook: usePeers
 * Handles discovery of local devices on the network, maintaining local state & simulation fallback.
 */
export const usePeers = (deviceName, addToast) => {
  // Default simulated discovery peers to showcase immediate rich visual interaction
  const defaultPeers = [
    { id: 'peer-sim-1', deviceName: 'iPhone 15 Pro Max', deviceType: 'Mobile', angle: 40, dist: 135, signal: 'Ultra-Wideband' },
    { id: 'peer-sim-2', deviceName: 'MacBook Air M3', deviceType: 'Laptop', angle: 185, dist: 165, signal: 'Direct Wi-Fi 6E' },
    { id: 'peer-sim-3', deviceName: 'Workstation-RTX', deviceType: 'Desktop', angle: 305, dist: 125, signal: 'Gigabit Mesh' }
  ];

  const [peers, setPeers] = useState(defaultPeers);
  const [selectedPeer, setSelectedPeer] = useState(null);

  useEffect(() => {
    // Attempt real-time connection to backend on port 5000
    socketService.connect({ deviceName, deviceType: 'Desktop' }, (realPeers) => {
      if (realPeers && realPeers.length > 0) {
        // Map real peers to radar coordinates
        const mappedRealPeers = realPeers.map((p, index) => ({
          id: p.id,
          deviceName: p.deviceName,
          deviceType: p.deviceType,
          angle: (index * 110 + 45) % 360,
          dist: 130 + (index % 2) * 35,
          signal: 'WebSocket Live'
        }));
        setPeers([...mappedRealPeers, ...defaultPeers.slice(0, Math.max(0, 3 - mappedRealPeers.length))]);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [deviceName]);

  const toggleSelectPeer = useCallback((peer) => {
    if (!peer || (selectedPeer && (selectedPeer.id === peer.id || selectedPeer.deviceName === peer.deviceName))) {
      setSelectedPeer(null);
      if (addToast) addToast('Target set to Broadcast to All LAN Peers.');
    } else {
      setSelectedPeer(peer);
      if (addToast) addToast(`Target locked: ${peer.deviceName}`);
    }
  }, [selectedPeer, addToast]);

  return { peers, selectedPeer, toggleSelectPeer };
};
