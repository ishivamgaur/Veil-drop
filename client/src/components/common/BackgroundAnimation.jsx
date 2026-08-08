import React from 'react';

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500 bg-[#fdfcfb] dark:bg-[#070708]">
      {/* Hyper-minimalist subtle gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ded1b6]/10 via-transparent to-transparent dark:from-[#ded1b6]/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-black/[0.02] via-transparent to-transparent dark:from-white/[0.02]" />
    </div>
  );
}
