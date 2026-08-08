import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { webrtcService } from '../../services/webRTCService';

/**
 * Ultra Minimalist Radar Portal
 */
export default function RadarStage({ peers = [], selectedPeer: activeSelectedPeer, toggleSelectPeer: parentTogglePeer, initiateBeam, addToast }) {
  const [internalSelectedPeer, setInternalSelectedPeer] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPayloadName, setSelectedPayloadName] = useState('Choose payloads...');
  const fileQueueRef = React.useRef([]);

  const displayPeers = peers || [];
  const currentSelectedPeer = activeSelectedPeer !== undefined ? activeSelectedPeer : internalSelectedPeer;

  React.useEffect(() => {
    const handleChannelReady = () => {
      if (fileQueueRef.current.length > 0) {
        const file = fileQueueRef.current.shift();
        webrtcService.sendFile(file);
        
        // Reset the input text after a delay
        setTimeout(() => setSelectedPayloadName('Choose payloads...'), 2000);
      }
    };

    window.addEventListener('webrtc:channel_ready', handleChannelReady);
    return () => window.removeEventListener('webrtc:channel_ready', handleChannelReady);
  }, []);

  const handlePeerClick = (peer) => {
    if (parentTogglePeer) {
      parentTogglePeer(peer);
    } else {
      if (peer === null) {
        setInternalSelectedPeer(null);
        if (addToast) addToast('Target set to Broadcast to All LAN Peers.');
      } else if (internalSelectedPeer && (internalSelectedPeer.id === peer.id || internalSelectedPeer.deviceName === peer.deviceName)) {
        setInternalSelectedPeer(null);
        if (addToast) addToast('Peer deselected.');
      } else {
        setInternalSelectedPeer(peer);
        if (addToast) addToast(`Target locked: ${peer.deviceName}`);
      }
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    if (displayPeers.length === 0) {
      if (addToast) addToast('⚠️ No peers found on network! Open a second window to test Radar.');
      return;
    }

    const target = currentSelectedPeer || displayPeers[0];
    if (!target) return;
    
    const file = files[0];
    setSelectedPayloadName(file.name);
    
    if (addToast) addToast(`Establishing encrypted tunnel to ${target.deviceName}...`);
    
    files.forEach(async (f) => {
      // Instantly trigger the UI progress bar panel!
      if (initiateBeam) initiateBeam(f, target.deviceName);
      
      fileQueueRef.current.push(f);
      await webrtcService.initiateConnection(target.id, f);
    });
  };

  return (
    <div className="w-full flex flex-col items-center text-center relative z-10">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl flex flex-col items-center"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#60a5fa] border border-[#60a5fa]/20 bg-[#101b2d] px-3.5 py-1 rounded-full mb-8">
          LOCAL RADAR
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
          Subnet discovery.
        </h2>

        <p className="text-sm sm:text-base text-[#888b94] max-w-md font-normal leading-relaxed mb-10">
          Detect active peer nodes sharing your home Wi-Fi for instantaneous gigabit file transmission.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center w-full max-w-3xl mx-auto gap-3 shadow-sm relative z-50"
      >
        {/* Dropdown Target Device Selector Pill */}
        <div className="relative w-full md:w-[260px] shrink-0">
          <div className="flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border border-[#181a26] w-full shadow-sm">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-transparent hover:bg-white/[0.02] rounded-[1.5rem] px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between transition-colors cursor-pointer text-xs sm:text-[13px] text-[#ffffff]"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#60a5fa] shrink-0">📡</span>
                <span className="font-sans font-medium truncate">
                  {currentSelectedPeer ? currentSelectedPeer.deviceName : 'All LAN Peers'}
                </span>
              </div>
              <svg className={`w-3.5 h-3.5 text-[#888b94] transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Dropdown Menu List */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[240px] bg-[#090b12] border border-[#181a26] rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => {
                  handlePeerClick(null);
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg font-mono text-xs flex items-center justify-between transition-colors cursor-pointer text-left",
                  !currentSelectedPeer ? "bg-[#60a5fa]/10 text-[#60a5fa] font-bold" : "text-[#888b94] hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <span className="font-sans text-[13px] font-medium">Broadcast to All</span>
              </button>

              {displayPeers.map((peer) => {
                const isSelected = currentSelectedPeer && (currentSelectedPeer.id === peer.id || currentSelectedPeer.deviceName === peer.deviceName);
                return (
                  <button
                    key={peer.id || peer.deviceName}
                    type="button"
                    onClick={() => {
                      handlePeerClick(peer);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-lg font-mono text-xs flex items-center justify-between transition-colors cursor-pointer text-left",
                      isSelected ? "bg-[#60a5fa]/10 text-[#60a5fa] font-bold" : "text-[#888b94] hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    <span className="font-sans text-[13px] font-medium truncate">{peer.deviceName}</span>
                    <span className="text-[10px] opacity-60 ml-2 shrink-0">{peer.signal}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Minimalist File Input Pill */}
        <div className="flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border border-[#181a26] w-full shadow-sm">
          <input
            type="file"
            id="radar-file-selector"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex-1 bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-mono text-[#888b94] select-none text-left truncate min-w-0">
            {selectedPayloadName}
          </div>
          <label
            htmlFor="radar-file-selector"
            className="text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[1.5rem] bg-[#ded1b6] hover:bg-[#ebdaba] text-[#070708] font-medium text-[13px] sm:text-sm transition-all duration-200 cursor-pointer shadow-sm shrink-0 font-semibold active:scale-[0.99] relative overflow-hidden film-grain"
          >
            Browse
          </label>
        </div>
      </motion.div>

    </div>
  );
}
