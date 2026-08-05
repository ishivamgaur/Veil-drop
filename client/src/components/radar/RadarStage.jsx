import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RadarGrid from './RadarGrid';
import PeerNode from './PeerNode';
import DropZone from './DropZone';
import { cn } from '../../utils/helpers';

/**
 * Borderless Monochromatic Radar Portal
 * Zero clutter, clean editorial layout matching the home page aesthetic.
 */
export default function RadarStage({ peers = [], selectedPeer: activeSelectedPeer, toggleSelectPeer: parentTogglePeer, initiateBeam, addToast }) {
  const [internalSelectedPeer, setInternalSelectedPeer] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const defaultPeers = [
    { id: 'p-101', deviceName: "MacBook Air M3", deviceType: 'Laptop', signal: 'Direct Wi-Fi 6E', status: "READY // LAN NODE" },
    { id: 'p-102', deviceName: "iPhone 15 Pro Max", deviceType: 'Mobile', signal: 'Ultra-Wideband', status: "READY // LAN NODE" },
    { id: 'p-103', deviceName: "Workstation-RTX", deviceType: 'Desktop', signal: 'Gigabit Mesh', status: "BUSY // STREAMING" }
  ];

  const displayPeers = peers && peers.length > 0 ? peers : defaultPeers;
  const currentSelectedPeer = activeSelectedPeer !== undefined ? activeSelectedPeer : internalSelectedPeer;

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

  const handleFilesSelected = (files) => {
    const target = currentSelectedPeer || displayPeers[0];
    if (!target) return;
    if (addToast) addToast(`Initiating high-speed LAN transmission to ${target.deviceName}...`);
    files.forEach(file => {
      if (initiateBeam) initiateBeam(file, target);
    });
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Mobile':
        return (
          <svg className="w-5 h-5 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        );
      case 'Laptop':
        return (
          <svg className="w-5 h-5 text-[#ded1b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18V6a2.25 2.25 0 00-2.25-2.25H15M9 3.75M9 3.75h6m-6 0v1.5m6-1.5v1.5m-6 0h6" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-16 sm:space-y-24 pt-16 pb-32 sm:pt-24 sm:pb-44">
      {/* Editorial Monochromatic Header (Hero-Grade Spacing) */}
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#60a5fa] bg-[#101b2d] px-4 py-1 rounded-full border border-blue-500/10 mb-8">
          LOCAL RADAR // ORBITAL LAN DISCOVERY
        </span>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#ffffff] font-heading leading-[1.18] mb-6">
          Subnet discovery.
        </h2>
        <p className="text-sm sm:text-base text-[#888b94] font-normal leading-relaxed max-w-xl mb-12">
          Detect active peer nodes sharing your home Wi-Fi or Local Area Network for instantaneous zero-config file transmission.
        </p>
      </div>

      {/* Symmetrical Interaction Card (Matches Sender & Receiver Portals 100%) */}
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl mx-auto rounded-3xl bg-[#0b0c10] border border-[#181a26] hover:border-[#262a3c] p-8 sm:p-10 text-left relative overflow-hidden shadow-none transition-colors duration-300 space-y-6"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#60a5fa]/30 to-transparent pointer-events-none" />

        {/* Clean Dropdown Target Device Selector */}
        <div className="space-y-3 relative z-30">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#60a5fa] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
              SUBNET LISTENING // 192.168.1.x
            </label>
            <span className="text-[10px] font-mono text-[#71747e]">{displayPeers.length} ACTIVE PEERS</span>
          </div>

          {/* Trigger Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#07080c] hover:bg-[#0c0e17] border border-white/10 focus:border-[#ded1b6]/50 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all cursor-pointer font-mono text-xs text-[#ffffff]"
            >
              <div className="flex items-center gap-3">
                {currentSelectedPeer ? getDeviceIcon(currentSelectedPeer.deviceType) : (
                  <span className="text-[#60a5fa]">📡</span>
                )}
                <span className="font-sans font-medium text-sm">
                  {currentSelectedPeer ? currentSelectedPeer.deviceName : 'Broadcast to All LAN Peers (Default)'}
                </span>
                {currentSelectedPeer && (
                  <span className="text-[10px] font-mono text-[#ded1b6] bg-[#ded1b6]/10 px-2 py-0.5 rounded border border-[#ded1b6]/20">
                    LOCKED ✓
                  </span>
                )}
              </div>
              <svg className={`w-4 h-4 text-[#888b94] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu List */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#090b12] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    handlePeerClick(null);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl font-mono text-xs flex items-center justify-between transition-colors cursor-pointer text-left",
                    !currentSelectedPeer ? "bg-[#ded1b6] text-[#070708] font-bold" : "text-[#888b94] hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <span className="font-sans text-sm font-medium">📡 Broadcast to All LAN Peers (Default)</span>
                  <span className="text-[10px] uppercase">ALL SUBNET</span>
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
                        "w-full px-4 py-3 rounded-xl font-mono text-xs flex items-center justify-between transition-colors cursor-pointer text-left",
                        isSelected ? "bg-[#ded1b6] text-[#070708] font-bold" : "text-[#888b94] hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(peer.deviceType)}
                        <span className="font-sans text-sm font-medium">{peer.deviceName}</span>
                      </div>
                      <span className="text-[10px] opacity-70">[{peer.signal || 'Wi-Fi'}]</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Integrated Drop Zone */}
        <div className="pt-2 space-y-4 relative z-10">
          <DropZone onFilesSelected={handleFilesSelected} selectedPeer={currentSelectedPeer} />
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#888b94] pt-1 justify-center sm:justify-start">
            <span className="text-[#34d399] font-bold">✓</span>
            <span>Zero internet required. Transmitting at maximum local router speed.</span>
          </div>
        </div>
      </motion.div>

      {/* Clean Architectural Protocol Workflow Grid */}
      <div className="w-full max-w-4xl text-left space-y-8">
        {/* Faded Gradient Divider Line (0% -> 20% -> 0%) */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 sm:mb-14" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ded1b6] font-medium">DISCOVER</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Subnet Scanning</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              Open Local Radar on any computers on the same router or Wi-Fi network to begin broadcasting presence automatically.
            </p>
          </div>

          <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#34d399] font-medium">SELECT NODE</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Orbital Target</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              Click any detected peer node orbiting around your host coordinates on the interactive concentric LAN map.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#60a5fa] font-medium">INSTANT LAN DROP</div>
            <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Gigabit Transfer</div>
            <p className="text-xs sm:text-sm text-[#888b94] leading-relaxed font-normal">
              Select or drag files onto the stage to transmit packets at gigabit LAN speeds directly across your router without cloud routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

