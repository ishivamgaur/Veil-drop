import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Borderless Interactive Peer Device Node
 * Sleek monochromatic representation of network peers without visible borders.
 */
export default function PeerNode({ peer, isSelected, onSelect, isSelf = false }) {
  const getDeviceLabel = (type) => {
    switch (type) {
      case 'Mobile': return '📱';
      case 'Laptop': return '💻';
      default: return '🖥️';
    }
  };

  if (isSelf) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none group select-none">
        <div className="w-12 h-12 rounded-2xl bg-[#0e1017] border border-white/10 flex items-center justify-center text-xs font-mono font-medium text-[#ded1b6] shadow-sm">
          YOU
        </div>
        <span className="mt-2 text-[10px] font-mono font-medium uppercase tracking-widest text-[#888b94]">
          LOCAL HOST
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(peer)}
      className="absolute flex flex-col items-center justify-center cursor-pointer select-none group z-20 transition-colors duration-200"
      style={{
        transform: `rotate(${peer.angle}deg) translate(${peer.dist}px) rotate(-${peer.angle}deg)`
      }}
      title={`Select ${peer.deviceName} as transmission target`}
    >
      {/* Node Button with Studio Border Ring */}
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative shadow-sm",
          isSelected
            ? "bg-[#0e1017] border-2 border-[#ded1b6] ring-4 ring-[#ded1b6]/20 text-[#ffffff]"
            : "bg-[#0e1017] border border-white/10 hover:border-white/20 text-[#e6e7eb]"
        )}
      >
        {/* Signal LED Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34d399]"></span>
        </span>

        <span className="text-base">{getDeviceLabel(peer.deviceType)}</span>
      </div>

      {/* Label Tag with Studio Bordering */}
      <div className={cn(
        "mt-2 px-3 py-1 rounded-full text-center transition-colors flex flex-col items-center bg-[#0e1017] border border-white/10 shadow-sm",
        isSelected ? "border-[#ded1b6]/40" : "group-hover:border-white/20"
      )}>
        <span className={cn(
          "text-xs tracking-tight whitespace-nowrap font-medium",
          isSelected ? "text-[#ded1b6]" : "text-[#888b94] group-hover:text-[#ffffff]"
        )}>
          {peer.deviceName}
        </span>
        <span className="text-[9px] font-mono text-[#606474] mt-0.5">
          {peer.signal || 'DIRECT'} // LAN
        </span>
      </div>
    </div>
  );
}
