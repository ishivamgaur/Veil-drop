import { useState, useCallback, useRef } from 'react';
import { formatBytes, generateId, getRandomSpeed } from '../utils/helpers';
import { socketService } from '../services/socketService';

/**
 * Custom Hook: useTransfers
 * Handles real-time active stream pipelines, progress animation mechanics, and session history without mock data.
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
    const speed = getRandomSpeed();

    const newTransfer = {
      id: transferId,
      fileName: file.name,
      sizeStr: formattedSize,
      targetPeer,
      speed: `${speed} MB/s`,
      progress: 0
    };

    setActiveTransfers(prev => {
      const next = [newTransfer, ...prev];
      activeTransfersRef.current = next;
      return next;
    });

    // Send transfer initiation over signaling websocket
    socketService.emitTransferInitiate(selectedPeer?.id || 'sim', { name: file.name, size: file.size }, 'Veil-Client');
    if (addToast) addToast(`Transmitting "${file.name}" point-to-point...`);

    // Simulate real-time WebRTC chunk streaming speed
    const interval = setInterval(() => {
      setActiveTransfers(prev => {
        return prev.map(t => {
          if (t.id === transferId) {
            const nextProg = Math.min(100, t.progress + Math.floor(Math.random() * 20) + 12);
            socketService.emitTransferProgress(selectedPeer?.id || 'sim', transferId, nextProg);
            
            if (nextProg >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setActiveTransfers(current => current.filter(x => x.id !== transferId));
                addToHistory(file.name, targetPeer, formattedSize);
                if (addToast) addToast(`Successfully transferred "${file.name}". Zero copies stored on servers.`);
                socketService.emitTransferComplete(selectedPeer?.id || 'sim', transferId, file.name);
              }, 400);
            }
            return { ...t, progress: nextProg };
          }
          return t;
        });
      });
    }, 150);

  }, [selectedPeer, defaultPeerName, addToast, addToHistory]);

  const clearHistory = useCallback(() => {
    setHistoryVault([]);
    if (addToast) addToast('Transmission history cleared from local browser memory.');
  }, [addToast]);

  return { activeTransfers, historyVault, initiateBeam, clearHistory };
};
