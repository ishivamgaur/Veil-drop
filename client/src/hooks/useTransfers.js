import { useState, useCallback, useRef, useEffect } from 'react';
import { formatBytes, generateId } from '../utils/helpers';

/**
 * Custom Hook: useTransfers
 * Tracks real-time active stream pipelines, progress animation mechanics, and session history.
 */
export const useTransfers = (addToast, selectedPeer, defaultPeerName = 'Remote Peer (WebRTC)') => {
  const [activeTransfers, setActiveTransfers] = useState([]);
  const [historyVault, setHistoryVault] = useState([]);
  const activeTransfersRef = useRef([]);

  const addToHistory = useCallback((fileName, peerName, sizeStr) => {
    setHistoryVault(prev => [
      {
        id: generateId(),
        fileName,
        peerName,
        sizeStr,
        timestamp: 'Just now',
        status: 'success'
      },
      ...prev
    ]);
  }, []);

  const initiateBeam = useCallback((file, overrideTargetPeer) => {
    const targetPeer = overrideTargetPeer || (selectedPeer ? selectedPeer.deviceName : defaultPeerName);
    const transferId = 'tr-' + generateId();
    const formattedSize = formatBytes(file.size);

    const newTransfer = {
      id: transferId,
      fileName: file.name,
      sizeStr: formattedSize,
      targetPeer,
      speed: `Calculating...`,
      progress: 0
    };

    setActiveTransfers(prev => {
      const next = [newTransfer, ...prev];
      activeTransfersRef.current = next;
      return next;
    });

    if (addToast) addToast(`Transmitting "${file.name}" point-to-point...`);

    // Progress updates are now driven entirely by the real WebRTC data channel events!
  }, [selectedPeer, defaultPeerName, addToast]);

  // Hook into the actual WebRTC events
  useEffect(() => {
    const handleProgress = (e) => {
      const { progress, speed } = e.detail;
      setActiveTransfers(prev => {
        if (prev.length === 0) return prev;
        // Update the most recent transfer
        const updated = [...prev];
        updated[0] = { ...updated[0], progress, speed };
        activeTransfersRef.current = updated;
        return updated;
      });
    };

    const handleComplete = () => {
      const currentTransfers = activeTransfersRef.current;
      if (currentTransfers.length > 0) {
        const completed = currentTransfers[0];
        
        setTimeout(() => {
          setActiveTransfers(prev => prev.filter(x => x.id !== completed.id));
          addToHistory(completed.fileName, completed.targetPeer, completed.sizeStr);
          if (addToast) addToast(`Successfully transferred "${completed.fileName}". Zero copies stored on servers.`);
        }, 500);
      }
    };

    const handleIncoming = (e) => {
      const { fileName, size, senderId } = e.detail;
      const formattedSize = formatBytes(size);
      
      const incomingTransfer = {
        id: 'rx-' + generateId(),
        fileName: fileName,
        sizeStr: formattedSize,
        targetPeer: 'Incoming Payload',
        speed: 'Calculating...',
        progress: 0
      };

      setActiveTransfers(prev => {
        const next = [incomingTransfer, ...prev];
        activeTransfersRef.current = next;
        return next;
      });
    };

    window.addEventListener('webrtc:progress', handleProgress);
    window.addEventListener('webrtc:transfer_complete', handleComplete);
    window.addEventListener('webrtc:incoming_transfer', handleIncoming);

    return () => {
      window.removeEventListener('webrtc:progress', handleProgress);
      window.removeEventListener('webrtc:transfer_complete', handleComplete);
      window.removeEventListener('webrtc:incoming_transfer', handleIncoming);
    };
  }, [addToHistory, addToast]);

  const clearHistory = useCallback(() => {
    setHistoryVault([]);
    if (addToast) addToast('Transmission history cleared from local browser memory.');
  }, [addToast]);

  return { activeTransfers, historyVault, initiateBeam, clearHistory };
};
