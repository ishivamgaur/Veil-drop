import { useState, useCallback, useRef, useEffect } from 'react';
import { formatBytes, generateId } from '../utils/helpers';
import { webrtcService } from '../services/webRTCService';

/**
 * Custom Hook: useTransfers
 * Tracks real-time active stream pipelines, progress animation mechanics, session history,
 * and provides cancel + error state management.
 */
export const useTransfers = (addToast, selectedPeer, defaultPeerName = 'Remote Peer (WebRTC)') => {
  const [activeTransfers, setActiveTransfers] = useState([]);
  const [historyVault, setHistoryVault] = useState([]);
  const activeTransfersRef = useRef([]);

  const addToHistory = useCallback((fileName, peerName, sizeStr, status = 'success') => {
    setHistoryVault(prev => [
      {
        id: generateId(),
        fileName,
        peerName,
        sizeStr,
        timestamp: 'Just now',
        status
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
      speed: 'Calculating...',
      progress: 0,
      status: 'active' // 'active' | 'error' | 'complete'
    };

    setActiveTransfers(prev => {
      const next = [newTransfer, ...prev];
      activeTransfersRef.current = next;
      return next;
    });

    if (addToast) addToast(`Transmitting "${file.name}" point-to-point...`);
  }, [selectedPeer, defaultPeerName, addToast]);

  // Cancel/abort the active transfer and reset the WebRTC engine
  const cancelTransfer = useCallback(() => {
    const currentTransfers = activeTransfersRef.current;
    if (currentTransfers.length === 0) return;

    const cancelled = currentTransfers[0];
    webrtcService.reset(); // kills the DataChannel + PeerConnection immediately

    setActiveTransfers(prev => prev.filter(x => x.id !== cancelled.id));
    activeTransfersRef.current = activeTransfersRef.current.filter(x => x.id !== cancelled.id);

    if (addToast) addToast(`Transfer of "${cancelled.fileName}" was cancelled.`);
  }, [addToast]);

  // Hook into the actual WebRTC events
  useEffect(() => {
    const handleProgress = (e) => {
      const { progress, speed } = e.detail;
      setActiveTransfers(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = { ...updated[0], progress, speed, status: 'active' };
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
          activeTransfersRef.current = activeTransfersRef.current.filter(x => x.id !== completed.id);
          addToHistory(completed.fileName, completed.targetPeer, completed.sizeStr, 'success');
          if (addToast) addToast(`"${completed.fileName}" transferred. Zero copies stored on servers.`);
        }, 500);
      }
    };

    // Mark the active transfer as errored (shows red state + dismiss X button)
    const handleError = (e) => {
      const message = e.detail || 'Transfer failed due to a connection error.';
      setActiveTransfers(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = { ...updated[0], status: 'error', errorMessage: message };
        activeTransfersRef.current = updated;
        return updated;
      });
      if (addToast) addToast(`❌ ${message}`);
    };

    const handleIncoming = (e) => {
      const { fileName, size } = e.detail;
      const formattedSize = formatBytes(size);

      const incomingTransfer = {
        id: 'rx-' + generateId(),
        fileName,
        sizeStr: formattedSize,
        targetPeer: 'Incoming Payload',
        speed: 'Calculating...',
        progress: 0,
        status: 'active'
      };

      setActiveTransfers(prev => {
        const next = [incomingTransfer, ...prev];
        activeTransfersRef.current = next;
        return next;
      });
    };

    window.addEventListener('webrtc:progress', handleProgress);
    window.addEventListener('webrtc:transfer_complete', handleComplete);
    window.addEventListener('webrtc:transfer_error', handleError);
    window.addEventListener('webrtc:incoming_transfer', handleIncoming);

    return () => {
      window.removeEventListener('webrtc:progress', handleProgress);
      window.removeEventListener('webrtc:transfer_complete', handleComplete);
      window.removeEventListener('webrtc:transfer_error', handleError);
      window.removeEventListener('webrtc:incoming_transfer', handleIncoming);
    };
  }, [addToHistory, addToast]);

  const clearHistory = useCallback(() => {
    setHistoryVault([]);
    if (addToast) addToast('Transmission history cleared from local browser memory.');
  }, [addToast]);

  return { activeTransfers, historyVault, initiateBeam, cancelTransfer, clearHistory };
};
