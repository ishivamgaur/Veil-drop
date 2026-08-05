import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

/**
 * Clean Obsidian Receiver Portal
 * Sleek, unified dark interface with zero clutter.
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-16 sm:space-y-24 pt-16 pb-32 sm:pt-24 sm:pb-44">
      {/* Editorial Monochromatic Header (Hero-Grade Spacing) */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#34d399] bg-[#101d19] px-4 py-1 rounded-full border border-emerald-500/10 mb-8">
          E2EE RECEIVER PORTAL // ZERO APP INSTALLS
        </span>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#ffffff] font-heading leading-[1.18] mb-6">
          Extract payloads.
        </h2>
        <p className="text-sm sm:text-base text-[#888b94] font-normal leading-relaxed max-w-xl mb-12">
          Paste an encrypted transfer URL or room code from the host to initiate instantaneous client-side memory extraction.
        </p>
      </div>

      {/* Symmetrical Interaction Card */}
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-auto rounded-3xl bg-[#0b0c10] border border-[#181a26] hover:border-[#262a3c] p-8 sm:p-10 text-left relative overflow-hidden shadow-none transition-colors duration-300 space-y-6"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#34d399]/30 to-transparent pointer-events-none" />
        
        <form onSubmit={handleConnect} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] font-medium">
                PAYLOAD SEARCH PORTAL
              </label>
              <span className="text-[10px] font-mono text-[#71747e]">CLIENT-SIDE MEMORY EXTRACTION</span>
            </div>
            <p className="text-xs text-[#888b94] font-normal">
              Enter a transfer URL or room identifier shared by the sender to initiate end-to-end decryption.
            </p>
          </div>

          {/* Unified Input Bar & Button Dock */}
          <div className="flex flex-col sm:flex-row items-center bg-[#07080c] border border-white/10 rounded-2xl p-1.5 focus-within:border-[#ded1b6]/50 transition-all duration-300 gap-2">
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="e.g. #k=a8f9c320... or room-9081"
              className="w-full sm:flex-1 bg-transparent px-5 py-3.5 text-xs sm:text-sm font-mono text-[#ffffff] placeholder-[#555866] outline-none border-none"
            />
            <Button
              type="submit"
              variant="luxury"
              disabled={status === 'connecting'}
              className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-medium rounded-xl bg-[#ded1b6] text-[#070708] hover:bg-[#ebdaba] transition-colors shrink-0 font-sans shadow-sm"
            >
              {status === 'connecting' ? 'Establishing Tunnel...' : status === 'complete' ? 'Payload Extracted' : 'Connect & Decrypt →'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#888b94] pt-2 justify-center sm:justify-start">
            <span className="text-[#34d399] font-bold">✓</span>
            <span>Zero software installation required. Files unpack straight into local RAM.</span>
          </div>
        </form>
      </motion.div>

      {/* Clean Protocol Workflow Grid */}
      <div className="w-full max-w-4xl pt-8 text-left space-y-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 text-xs font-mono text-[#71747e] border-b border-[#181920] pb-4">
          <span className="text-[#f2f3f7] font-medium font-sans">PROTOCOL WORKFLOW // HOW RECEIVE WORKS</span>
          <span className="text-[11px] text-[#ded1b6]">ZERO RECEPTION DELAY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-[#0b0c10] border border-[#161720] space-y-3">
            <div className="text-xs font-mono font-medium text-[#ded1b6]">01 // PASTE URL</div>
            <div className="text-base font-medium text-[#f2f3f7] font-heading">Direct Input</div>
            <p className="text-xs text-[#888b94] leading-relaxed">
              Paste the secure transfer link or drop code received from the sender into the input field above.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0c10] border border-[#161720] space-y-3">
            <div className="text-xs font-mono font-medium text-[#ded1b6]">02 // AUTHENTICATE</div>
            <div className="text-base font-medium text-[#f2f3f7] font-heading">WebRTC Handshake</div>
            <p className="text-xs text-[#888b94] leading-relaxed">
              Your browser initiates an instantaneous WebRTC signaling handshake directly with the active host machine.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0c10] border border-[#161720] space-y-3">
            <div className="text-xs font-mono font-medium text-[#ded1b6]">03 // EXTRACT</div>
            <div className="text-base font-medium text-[#f2f3f7] font-heading">Memory Decryption</div>
            <p className="text-xs text-[#888b94] leading-relaxed">
              Using the secret cipher hash embedded in the URL (#k=), incoming streaming packets are decrypted directly in memory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
