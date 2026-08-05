import React from 'react';

/**
 * Clean Concentric Radar Grid Visualizer
 * Architectural orbital canvas in matte obsidian.
 */
export default function RadarGrid({ children }) {
  return (
    <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1626] via-[#090d17] to-[#06080e] film-grain border border-[#60a5fa]/20 hover:border-[#60a5fa]/40 transition-colors duration-500 shadow-none select-none group">
      {/* Crisp Monochromatic Axis Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-10">
        <div className="w-full h-[1px] bg-[#222533]"></div>
        <div className="h-full w-[1px] bg-[#222533]"></div>
      </div>

      {/* Orbital Circles */}
      <div className="absolute w-[130px] h-[130px] rounded-full border border-white/[0.06] pointer-events-none"></div>
      <div className="absolute w-[260px] h-[260px] rounded-full border border-white/[0.04] pointer-events-none"></div>
      <div className="absolute w-[370px] h-[370px] rounded-full border border-white/[0.02] pointer-events-none"></div>



      {/* Architectural Coordinates Tag */}
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#71747e] pointer-events-none uppercase tracking-widest bg-[#12141d]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.04]">
        <span>SUBNET RADAR // 5.0 GHz P2P</span>
      </div>

      {/* Render device nodes */}
      {children}
    </div>
  );
}

