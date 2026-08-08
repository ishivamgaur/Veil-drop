import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra Minimalist Sender Portal
 */
export default function PrivateSenderStage({ initiateBeam, addToast }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);

  useEffect(() => {
    setRoomId('drop-' + Math.floor(Math.random() * 899 + 100) + '-' + Math.floor(Math.random() * 899 + 100));
    setEncryptionKey(Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join(''));
  }, []);

  const shareLink = `https://veildrop.app/rx/${roomId}#k=${encryptionKey}`;

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
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
              <span className={`w-1.5 h-1.5 rounded-full ${peerConnected ? 'bg-[#34d399] animate-pulse' : 'bg-[#ded1b6] animate-ping'}`} />
              {peerConnected ? 'Streaming payload...' : 'Waiting for recipient...'}
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
