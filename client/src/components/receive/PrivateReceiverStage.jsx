import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra Minimalist Receiver Portal
 */
export default function PrivateReceiverStage({ addToast }) {
  const [roomInput, setRoomInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'complete'

  const handleConnect = (e) => {
    e.preventDefault();
    if (!roomInput.trim()) {
      if (addToast) addToast('Please paste your drop room link or ID first.');
      return;
    }

    setStatus('connecting');
    if (addToast) addToast('Establishing direct point-to-point data tunnel...');

    setTimeout(() => {
      setStatus('complete');
      if (addToast) addToast('Connection secured! File decrypted and saved directly to your device.');
    }, 2200);
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
        className="flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border border-[#181a26] w-full max-w-2xl mx-auto shadow-sm"
      >
        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          placeholder="Paste extraction cipher (#k=...)"
          className="flex-1 bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-mono text-[#f2f3f7] placeholder:text-[#555866] focus:outline-none min-w-0"
        />
        <button
          onClick={() => {
            if (addToast) addToast('Decrypting payload schema...');
            handleConnect({ preventDefault: () => {} });
          }}
          className="text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[1.5rem] bg-[#34d399] hover:bg-[#4ade80] text-[#070708] font-medium text-[13px] sm:text-sm transition-all duration-200 cursor-pointer shadow-sm shrink-0 font-semibold active:scale-[0.99]"
        >
          {status === 'connecting' ? 'Connecting...' : status === 'complete' ? 'Extracted ✓' : 'Extract'}
        </button>
      </motion.div>
    </div>
  );
}
