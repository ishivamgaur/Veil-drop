import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

/**
 * Custom Hook: usePeers
 * Handles real-time discovery of local devices on the network.
 */
export const usePeers = (deviceName, addToast) => {
  const [peers, setPeers] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);

  useEffect(() => {
    // Pass callbacks to socketService to keep state perfectly synchronized
    socketService.connect(
      { deviceName, deviceType: 'Desktop' }, 
      (realPeers) => {
        // When we get the initial list of peers in our Subnet Room
        if (realPeers && realPeers.length > 0) {
          const mappedRealPeers = realPeers.map((p, index) => ({
            id: p.id,
            deviceName: p.deviceName,
            deviceType: p.deviceType,
            angle: (index * 110 + 45) % 360,
            dist: 130 + (index % 2) * 35,
            signal: 'WebSocket Live'
          }));
          setPeers(mappedRealPeers);
        } else {
          setPeers([]);
        }
      },
      (leftPeerId) => {
        // When a peer disconnects from our Subnet Room
        setPeers(prev => prev.filter(p => p.id !== leftPeerId));
        setSelectedPeer(prev => prev?.id === leftPeerId ? null : prev);
      }
    );

    // Listen for when a single new peer joins AFTER us
    const handlePeerJoined = (newPeer) => {
      setPeers(prev => {
        if (prev.find(p => p.id === newPeer.id)) return prev;
        
        const mappedPeer = {
          id: newPeer.id,
          deviceName: newPeer.deviceName,
          deviceType: newPeer.deviceType,
          angle: (prev.length * 110 + 45) % 360,
          dist: 130 + (prev.length % 2) * 35,
          signal: 'WebSocket Live'
        };
        return [...prev, mappedPeer];
      });
    };

    socketService.on('peer:joined', handlePeerJoined);

    return () => {
      socketService.off('peer:joined', handlePeerJoined);
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
