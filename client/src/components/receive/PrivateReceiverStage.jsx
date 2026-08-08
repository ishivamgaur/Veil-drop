import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { socketService } from '../../services/socketService';
import { webrtcService } from '../../services/webRTCService';

/**
 * Ultra Minimalist Receiver Portal
 */
export default function PrivateReceiverStage({ addToast }) {
  const [roomInput, setRoomInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'transferring' | 'complete'
  const [progress, setProgress] = useState(0);

  // Auto-fill from URL hash and auto-connect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('room=')) {
      const urlParams = new URLSearchParams(hash.replace('#', '?'));
      const roomId = urlParams.get('room');
      const key = urlParams.get('k');
      if (roomId && key) {
        const fullLink = `${window.location.origin}/receive#room=${roomId}&k=${key}`;
        setRoomInput(fullLink);
        
        // Auto-trigger the connection process after a brief delay for UI animation
        setTimeout(() => {
          triggerConnection(fullLink);
        }, 800);
      }
    }
  }, []);

  const triggerConnection = (linkToParse) => {
    if (!linkToParse.trim()) {
      if (addToast) addToast('Please paste your drop room link or ID first.');
      return;
    }

    // Extract Room ID from the pasted string or URL
    let roomId = linkToParse;
    if (linkToParse.includes('room=')) {
      const hashPart = linkToParse.substring(linkToParse.indexOf('#'));
      const urlParams = new URLSearchParams(hashPart.replace('#', '?'));
      roomId = urlParams.get('room');
      
      // Crucial: Update the browser's actual URL hash so the global App.jsx listener can extract the AES Key!
      if (window.location.hash !== hashPart) {
        window.history.replaceState(null, '', hashPart);
      }
    } else if (linkToParse.includes('/rx/')) {
      roomId = linkToParse.split('/rx/')[1].split('#')[0];
    }

    setStatus('connecting');
    if (addToast) addToast('Connecting to private mesh tunnel...');

    // Connect to the specific private room on the backend
    socketService.joinRoom({ 
      deviceName: 'Receiver-Host', 
      deviceType: 'Desktop', 
      roomId 
    });

    // Check if the Sender is actually in this room
    const handlePeerListUpdate = (peersInRoom) => {
      // We only care about this check right after joining
      if (peersInRoom.length === 0) {
        setStatus('idle');
        if (addToast) addToast('❌ Invalid or Expired Link. The sender is not online.');
        cleanupListeners();
      }
    };
    socketService.on('peer:list_update', handlePeerListUpdate);

    // Listen for UI events from WebRTC engine (The actual WebRTC socket handlers are managed globally in App.jsx)
    const onChannelReady = () => {
      setStatus('transferring');
      if (addToast) addToast('Tunnel secured. Data incoming...');
    };

    const onProgress = (e) => {
      setProgress(e.detail.progress);
    };

    const onComplete = () => {
      setStatus('complete');
      if (addToast) addToast('Payload extracted successfully!');
      cleanupListeners();
    };

    const cleanupListeners = () => {
      socketService.off('peer:list_update', handlePeerListUpdate);
      window.removeEventListener('webrtc:channel_ready', onChannelReady);
      window.removeEventListener('webrtc:progress', onProgress);
      window.removeEventListener('webrtc:transfer_complete', onComplete);
    };

    window.addEventListener('webrtc:channel_ready', onChannelReady);
    window.addEventListener('webrtc:progress', onProgress);
    window.addEventListener('webrtc:transfer_complete', onComplete);
  };

  const handleConnect = (e) => {
    e.preventDefault();
    triggerConnection(roomInput);
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl flex flex-col items-center"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#34d399] border border-[#34d399]/20 bg-[#101d19] px-3.5 py-1 rounded-full mb-8">
          E2EE RECEIVER PORTAL
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
          Extract payloads.
        </h2>

        <p className="text-sm sm:text-base text-[#888b94] max-w-md font-normal leading-relaxed mb-10">
          Paste a secure transfer link to decrypt and download payloads directly into local memory.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border border-[#181a26] w-full max-w-2xl mx-auto shadow-sm relative overflow-hidden"
      >
        {status === 'transferring' && (
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[#34d399]/10 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Paste extraction cipher (#k=...)"
          disabled={status !== 'idle'}
          className="flex-1 bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-mono text-[#f2f3f7] placeholder:text-[#555866] focus:outline-none min-w-0 z-10"
        />
        <button
          onClick={handleConnect}
          disabled={status !== 'idle'}
          className="text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[1.5rem] bg-[#34d399] hover:bg-[#4ade80] text-[#070708] font-medium text-[13px] sm:text-sm transition-all duration-200 cursor-pointer shadow-sm shrink-0 font-semibold active:scale-[0.99] disabled:opacity-50 z-10"
        >
          {status === 'connecting' ? 'Connecting...' : status === 'transferring' ? `${progress}%` : status === 'complete' ? 'Extracted ✓' : 'Extract'}
        </button>
      </motion.div>
    </div>
  );
}
