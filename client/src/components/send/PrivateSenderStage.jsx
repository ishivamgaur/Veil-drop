import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { socketService } from '../../services/socketService';
import { webrtcService } from '../../services/webRTCService';
import { cryptoService } from '../../services/cryptoService';

/**
 * Ultra Minimalist Sender Portal
 */
export default function PrivateSenderStage({ initiateBeam, addToast }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [cryptoKeyObj, setCryptoKeyObj] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  
  // Use a ref to hold the latest files for the socket callback
  const filesRef = useRef(selectedFiles);
  useEffect(() => {
    filesRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    // Generate secure Room ID and AES Key
    const setupRoom = async () => {
      const newRoomId = 'drop-' + Math.floor(Math.random() * 899 + 100) + '-' + Math.floor(Math.random() * 899 + 100);
      const { key, base64Key } = await cryptoService.generateKey();
      
      setRoomId(newRoomId);
      setEncryptionKey(base64Key);
      setCryptoKeyObj(key);

      // Tell the backend to safely place us in this specific Private Room
      socketService.joinRoom({ 
        deviceName: 'Sender-Host', 
        deviceType: 'Desktop',
        roomId: newRoomId 
      });

      // 1. Listen for Receiver Joining
      const handlePeerJoined = async (peer) => {
        if (peer.roomId === newRoomId) {
          setPeerConnected(true);
          setTransferComplete(false);
          if (addToast) addToast(`Recipient ${peer.deviceName} joined the private tunnel!`);
          
          if (filesRef.current.length > 0) {
            await webrtcService.initiateConnection(peer.id, filesRef.current[0], key);
          }
        }
      };

      // 2. Listen for Receiver's WebRTC Answer
      const handleAnswer = async (data) => {
        await webrtcService.handleReceiveAnswer(data.answer);
      };

      // 3. Listen for ICE Candidates
      const handleIceCandidate = (data) => {
        webrtcService.handleReceiveIceCandidate(data.candidate);
      };

      socketService.on('peer:joined', handlePeerJoined);
      socketService.on('signal:answer', handleAnswer);
      socketService.on('signal:ice_candidate', handleIceCandidate);

      // 4. Listen for Data Channel Ready to start blasting bytes!
      const onChannelReady = () => {
        if (filesRef.current.length > 0) {
          // UI updates via hook or dispatch in initiateBeam
          initiateBeam(filesRef.current[0], 'Remote Peer (WebRTC)');
          webrtcService.sendFile(filesRef.current[0]);
        }
      };

      const onTransferComplete = () => {
        setTransferComplete(true);
      };

      window.addEventListener('webrtc:channel_ready', onChannelReady);
      window.addEventListener('webrtc:transfer_complete', onTransferComplete);

      return () => {
        socketService.off('peer:joined', handlePeerJoined);
        socketService.off('signal:answer', handleAnswer);
        socketService.off('signal:ice_candidate', handleIceCandidate);
        window.removeEventListener('webrtc:channel_ready', onChannelReady);
        window.removeEventListener('webrtc:transfer_complete', onTransferComplete);
      };
    };

    const cleanup = setupRoom();
    
    return () => {
      cleanup.then(cleanFn => {
        if (typeof cleanFn === 'function') cleanFn();
      });
    };
  }, [addToast, initiateBeam]);

  const shareLink = `${window.location.origin}/receive#room=${roomId}&k=${encryptionKey}`;

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
      setTransferComplete(false); // reset if they select new files
      if (addToast) addToast(`Ready to stream ${files.length} file(s).`);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    if (addToast) addToast('Encrypted share link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const simulateRecipientConnect = () => {
    setPeerConnected(true);
    if (addToast) addToast('Recipient connected! Beginning direct WebRTC stream.');
    selectedFiles.forEach(file => initiateBeam(file, 'Remote Peer (WebRTC)'));
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl flex flex-col items-center"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] border border-[#ded1b6]/20 bg-[#1a1712] px-3.5 py-1 rounded-full mb-8">
          E2EE SENDER PORTAL
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
          Stage your payload.
        </h2>

        <p className="text-sm sm:text-base text-[#888b94] max-w-md font-normal leading-relaxed mb-10">
          Direct, encrypted, point-to-point transfers. Select files to generate a secure stream link.
        </p>
      </motion.div>

      {selectedFiles.length === 0 ? (
        <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border border-[#181a26] w-full max-w-2xl mx-auto shadow-sm"
      >
        <input
          type="file"
          id="file-selector"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex-1 bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-mono text-[#888b94] select-none text-left truncate min-w-0">
          Choose payloads to transmit...
        </div>
        <label
          htmlFor="file-selector"
          className="text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[1.5rem] bg-[#ded1b6] hover:bg-[#ebdaba] text-[#070708] font-medium text-[13px] sm:text-sm transition-all duration-200 cursor-pointer shadow-sm shrink-0 font-semibold active:scale-[0.99] relative overflow-hidden film-grain"
        >
          Browse
        </label>
      </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mx-auto space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center bg-[#0b0c10] p-2 rounded-2xl border border-[#34d399]/20 w-full gap-2 shadow-sm">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 bg-transparent px-4 py-3 text-sm font-mono text-[#ded1b6] outline-none select-all w-full"
            />
            <button
              onClick={copyShareLink}
              className="px-8 py-3 rounded-xl bg-[#ded1b6] hover:bg-[#ebdaba] text-[#070708] font-medium text-sm transition-colors duration-200 cursor-pointer shrink-0 shadow-sm"
            >
              {copiedLink ? 'Copied ✓' : 'Copy Link'}
            </button>
          </div>
          
          <div className="flex items-center justify-between px-2 text-xs font-mono text-[#888b94]">
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${transferComplete ? 'bg-[#888b94]' : peerConnected ? 'bg-[#34d399] animate-pulse' : 'bg-[#ded1b6] animate-ping'}`} />
              {transferComplete ? 'Transmission complete. Tunnel closed.' : peerConnected ? 'Streaming payload...' : 'Waiting for recipient...'}
            </span>
            {!peerConnected && (
              <button onClick={simulateRecipientConnect} className="hover:text-[#ded1b6] underline transition-colors cursor-pointer">
                Simulate Join
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
