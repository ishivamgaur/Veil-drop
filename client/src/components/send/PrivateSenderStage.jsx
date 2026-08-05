import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DropZone from '../radar/DropZone';

/**
 * Clean Obsidian Sender Portal
 * Sleek, unified dark interface with zero clutter.
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

  const handleFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
    if (addToast) addToast(`Ready to stream ${files.length} file(s). Share your link below.`);
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-16 sm:space-y-24 pt-16 pb-32 sm:pt-24 sm:pb-44">
      {/* Editorial Monochromatic Header (Hero-Grade Spacing) */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] bg-[#1a1712] px-4 py-1 rounded-full border border-[#ded1b6]/20 mb-8">
          E2EE SENDER PORTAL // POINT-TO-POINT STREAMING
        </span>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#ffffff] font-heading leading-[1.18] mb-6">
          Stage your payload.
        </h2>
        <p className="text-sm sm:text-base text-[#888b94] font-normal leading-relaxed max-w-xl mb-12">
          Select or drag your files below to generate an ephemeral encrypted WebRTC stream link. Zero cloud persistence.
        </p>
      </div>

      {/* Symmetrical Interaction Card (Exact max-w-2xl width matching Receiver & Radar) */}
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-auto rounded-3xl bg-[#0b0c10] border border-[#181a26] hover:border-[#262a3c] p-8 sm:p-10 text-left relative overflow-hidden shadow-none transition-colors duration-300 space-y-6"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#ded1b6]/30 to-transparent pointer-events-none" />

        {/* Sender Header */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
              PAYLOAD STAGING PORTAL
            </label>
            <span className="text-[10px] font-mono text-[#71747e]">E2EE AES-256 SESSION</span>
          </div>
          <p className="text-xs text-[#888b94] font-normal">
            Drag or select files below to generate an ephemeral encrypted WebRTC link for recipient streaming.
          </p>
        </div>

        {/* DropZone */}
        <div className="relative z-10">
          <DropZone onFilesSelected={handleFilesSelected} selectedPeer={{ deviceName: 'Private Room' }} />
        </div>

        {/* Encrypted Share Panel */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-2 relative z-10"
          >
            <div className="flex items-center justify-between text-xs text-[#888b94]">
              <span className="font-medium text-[#ffffff]">Encrypted Transfer URL Ready:</span>
              <span className="text-[10px] font-mono text-[#ded1b6] uppercase tracking-wider">
                AES-256 SESSION ACTIVE
              </span>
            </div>

            {/* Symmetrical Encrypted Share Bar */}
            <div className="flex flex-col sm:flex-row items-center bg-[#07080c] p-1.5 rounded-2xl border border-white/10 relative z-10 gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm font-mono text-[#ded1b6] outline-none select-all overflow-hidden text-ellipsis w-full"
              />

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={copyShareLink}
                className="px-6 py-3 rounded-xl bg-[#ded1b6] hover:bg-[#ebdaba] text-[#070708] font-medium text-xs sm:text-sm transition-colors duration-200 cursor-pointer shrink-0 shadow-sm font-sans"
              >
                {copiedLink ? 'Copied to Clipboard! ✓' : 'Copy Transfer URL 📋'}
              </motion.button>
            </div>

            {/* Recipient Stream Status Tracker */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-[#888b94] flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${peerConnected ? 'bg-[#34d399] animate-pulse' : 'bg-[#ded1b6] animate-ping'}`} />
                {peerConnected ? 'Recipient Connected! Streaming payload...' : 'Waiting for recipient to open URL...'}
              </span>

              {!peerConnected && (
                <button
                  onClick={simulateRecipientConnect}
                  className="text-[11px] text-[#ded1b6] hover:underline cursor-pointer font-mono"
                >
                  Simulate Recipient Joining →
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-2 text-xs font-mono text-[#888b94] pt-1 justify-center sm:justify-start relative z-10">
          <span className="text-[#34d399] font-bold">✓</span>
          <span>Zero cloud persistence. Data streams directly from browser memory.</span>
        </div>
      </motion.div>

      {/* Clean Architectural Protocol Workflow Grid */}
      <div className="w-full max-w-4xl text-left space-y-8">
        {/* Faded Gradient Divider Line (0% -> 20% -> 0%) */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 sm:mb-14" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] font-medium">STAGE PAYLOADS</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Local Buffer</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              Select or drag any file above. Your browser prepares streaming packets directly inside local memory.
            </p>
          </div>

          <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#34d399] font-medium">SHARE LINK</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Hash Cipher</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              An ephemeral decryption cipher key is generated instantly and embedded strictly inside the URL fragment hash (#k=).
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#60a5fa] font-medium">INSTANT STREAM</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Direct Tunnel</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              When your recipient opens the URL, a point-to-point WebRTC channel opens directly between devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
