import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Universal Fixed Top Navigation
 * Ultra-clean navlinks across the platform with static font-weight to prevent any layout shifting or text bolding on hover.
 */
export default function Header({ onBackToLanding, activeTab, setActiveTab, onNavigateHowItWorks }) {
  const navItems = [
    { id: 'send', label: 'Send' },
    { id: 'receive', label: 'Receive' },
    { id: 'radar', label: 'Local Radar' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md border-b border-[#181a22] transition-colors select-none">
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onBackToLanding}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to home"
        >
          <div className="w-6 h-6 rounded bg-[#ded1b6] flex items-center justify-center text-[#070708] font-mono font-bold text-xs">
            V
          </div>
          <span className="text-base font-semibold tracking-tight text-[#f2f3f7] font-heading">
            VEILDROP
          </span>
        </div>

        {/* Stable Navigation Links - No font-weight shifting or bold hover */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-normal">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative py-1 transition-colors duration-200 cursor-pointer font-normal tracking-wide focus:outline-none",
                  isActive
                    ? "text-[#ded1b6]"
                    : "text-[#71747e] hover:text-[#e6e7eb]"
                )}
              >
                {item.label}
                {/* Absolute underline to ensure zero DOM shift or resize */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ded1b6] rounded-full pointer-events-none" />
                )}
              </button>
            );
          })}

          <button
            onClick={onNavigateHowItWorks}
            className="relative py-1 transition-colors duration-200 cursor-pointer font-normal tracking-wide text-[#71747e] hover:text-[#e6e7eb] focus:outline-none hidden md:inline-block"
          >
            How It Works
          </button>
        </nav>

        {/* Home Link */}
        <button
          onClick={onBackToLanding}
          className="text-xs font-mono text-[#71747e] hover:text-[#cccccc] transition-colors cursor-pointer font-normal"
        >
          Home ↗
        </button>
      </div>
    </header>
  );
}
