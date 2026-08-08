import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Universal Fixed Top Navigation with Mobile Menu Overlay
 */
export default function Header({ onBackToLanding, activeTab, setActiveTab, onNavigateHowItWorks }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'send', label: 'Send' },
    { id: 'receive', label: 'Receive' },
    { id: 'radar', label: 'Local Radar' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md border-b border-[#181a22] transition-colors select-none">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-10 py-3 sm:py-5 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer group relative z-50"
            title="Return to home"
          >
            <div className="w-6 h-6 rounded bg-[#ded1b6] flex items-center justify-center text-[#070708] font-mono font-bold text-xs">
              V
            </div>
            <span className="text-base font-semibold tracking-tight text-[#f2f3f7] font-heading">
              VEILDROP
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8 text-sm font-normal">
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="sm:hidden text-[#ded1b6] p-2 -mr-2 relative z-50 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8.5h16M4 15.5h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#070708] flex flex-col items-center justify-center space-y-10 px-6 text-center"
          >
            {/* Perfectly Aligned Close Button Wrapper */}
            <div className="absolute top-0 left-0 right-0 max-w-6xl w-full mx-auto px-4 sm:px-10 py-3 sm:py-5 flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-[#888b94] hover:text-[#ded1b6] transition-colors focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "text-4xl font-heading tracking-tight transition-colors focus:outline-none",
                  activeTab === item.id ? "text-[#ded1b6]" : "text-[#f2f3f7]"
                )}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                onBackToLanding();
                setMobileMenuOpen(false);
              }}
              className="text-4xl font-heading tracking-tight text-[#71747e] focus:outline-none mt-4"
            >
              Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
