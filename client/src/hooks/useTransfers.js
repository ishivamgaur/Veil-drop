import { useState, useCallback, useRef } from 'react';
import { formatBytes, generateId, getRandomSpeed } from '../utils/helpers';
import { socketService } from '../services/socketService';

/**
 * Custom Hook: useTransfers
 * Handles real-time active stream pipelines, progress animation mechanics, and permanent history vault storage.
 */
export const useTransfers = (addToast, selectedPeer, defaultPeerName = 'MacBook Air M3') => {
  const [activeTransfers, setActiveTransfers] = useState([]);
  const [historyVault, setHistoryVault] = useState([
    {
      id: 'init-1',
      fileName: 'Architecture_Schema_v3.pdf',
      peerName: 'MacBook Air M3',
      sizeStr: '18.4 MB',
      timestamp: '2 mins ago',
      status: 'success'
    }
  ]);

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

  const initiateBeam = useCallback((file) => {
    const targetPeer = selectedPeer ? selectedPeer.deviceName : defaultPeerName;
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
    if (addToast) addToast(`🚀 Transmitting "${file.name}" to ${targetPeer}...`);

    // Simulate real-time chunk transmission speed
    const interval = setInterval(() => {
      setActiveTransfers(prev => {
        return prev.map(t => {
          if (t.id === transferId) {
            const nextProg = Math.min(100, t.progress + Math.floor(Math.random() * 18) + 10);
            socketService.emitTransferProgress(selectedPeer?.id || 'sim', transferId, nextProg);
            
            if (nextProg >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                // Remove from active list and append to history vault
                setActiveTransfers(current => current.filter(x => x.id !== transferId));
                addToHistory(file.name, targetPeer, formattedSize);
                if (addToast) addToast(`✨ Successfully beamed "${file.name}" to ${targetPeer}!`);
                socketService.emitTransferComplete(selectedPeer?.id || 'sim', transferId, file.name);
              }, 400);
            }
            return { ...t, progress: nextProg };
          }
          return t;
        });
      });
    }, 180);

  }, [selectedPeer, defaultPeerName, addToast, addToHistory]);

  const clearHistory = useCallback(() => {
    setHistoryVault([]);
    if (addToast) addToast('🗑️ Local Drop Vault cleared.');
  }, [addToast]);

  return { activeTransfers, historyVault, initiateBeam, clearHistory };
};
