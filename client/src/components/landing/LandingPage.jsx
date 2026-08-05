import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import BentoCard from './BentoCard';

/**
 * Editorial Borderless Monochromatic Landing Page
 * Zero cards, zero borders, pure fluid linear studio aesthetic.
 */
export default function LandingPage({ onLaunch, onReceive }) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#e6e7eb] selection:bg-[#22242b] selection:text-[#ded1b6] flex flex-col font-sans relative">
      {/* Fixed Top Navbar without border */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md transition-colors select-none">
        <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 rounded bg-[#ded1b6] flex items-center justify-center text-[#070708] font-mono font-bold text-xs">
              V
            </div>
            <span className="text-base font-semibold tracking-tight text-[#f2f3f7] font-heading">
              VEILDROP
            </span>
          </div>

          {/* Stable navigation without any bolding on hover or width shifting */}
          <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-normal tracking-wide">
            <button
              onClick={() => onLaunch('send')}
              className="text-[#71747e] hover:text-[#e6e7eb] transition-colors duration-200 cursor-pointer font-normal py-1 focus:outline-none"
            >
              Send
            </button>
            <button
              onClick={onReceive}
              className="text-[#71747e] hover:text-[#e6e7eb] transition-colors duration-200 cursor-pointer font-normal py-1 focus:outline-none"
            >
              Receive
            </button>
            <button
              onClick={() => onLaunch('radar')}
              className="text-[#71747e] hover:text-[#e6e7eb] transition-colors duration-200 cursor-pointer font-normal py-1 focus:outline-none hidden sm:inline-block"
            >
              Radar
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="text-[#71747e] hover:text-[#e6e7eb] transition-colors duration-200 cursor-pointer font-normal py-1 focus:outline-none hidden md:inline-block"
            >
              How It Works
            </button>
          </nav>

          <div>
            <Button
              variant="luxury"
              size="sm"
              onClick={() => onLaunch('send')}
              className="text-xs px-5 py-2 font-normal"
            >
              Start Transfer
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 sm:px-10 pt-36 pb-32 sm:pt-44 sm:pb-44 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl flex flex-col items-center"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] border border-[#22242b] bg-[#101114] px-3.5 py-1 rounded-full mb-8">
            Private E2E Transmission
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
            Send privately. Zero servers. <br />
            <span className="text-[#ded1b6] font-serif italic font-normal">Total secrecy.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#888b94] max-w-md font-normal leading-relaxed mb-10">
            Direct browser-to-browser file transfers with automatic encryption and zero cloud storage.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              variant="luxury"
              size="md"
              onClick={() => onLaunch('send')}
              className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-normal"
            >
              Start Transfer
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={onReceive}
              className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-medium"
            >
              Receive Payload
            </Button>
          </div>
        </motion.div>

        {/* Telemetry Specifications Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-32 sm:mt-44 w-full max-w-5xl text-left"
        >
          {/* Faded Gradient Upper Divider Line (0% -> 20% -> 0%) */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 sm:mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
            {/* Column 1: Connection Protocol */}
            <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#221f19] to-[#14120e] border border-[#ded1b6]/20 flex items-center justify-center text-[#ded1b6] shadow-sm shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v.958m12 0A2.25 2.25 0 0118 9.75v.75m-15 0v-.75a2.25 2.25 0 011.5-2.126" />
                  </svg>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#ded1b6] uppercase tracking-widest">
                  CONNECTION PROTOCOL
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Device to Device</div>
              <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">Direct high-speed P2P stream globally</div>
            </div>

            {/* Column 2: Privacy Scheme */}
            <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#122b22] to-[#0a1813] border border-[#34d399]/20 flex items-center justify-center text-[#34d399] shadow-sm shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#34d399] uppercase tracking-widest">
                  PRIVACY SCHEME
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-medium text-[#ded1b6] font-heading">End-to-End Encrypted</div>
              <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">Locked before leaving your machine</div>
            </div>

            {/* Column 3: Cloud Retention */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162545] to-[#0c1426] border border-[#60a5fa]/20 flex items-center justify-center text-[#60a5fa] shadow-sm shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-[#60a5fa] uppercase tracking-widest">
                  CLOUD RETENTION
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">0.0 Bytes Saved</div>
              <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">Files never remain on cloud servers</div>
            </div>
          </div>
        </motion.div>

        {/* Compact Micro-Bento Grid with Exact Hero-Section Spacing */}
        <section id="how-it-works" className="mt-32 sm:mt-44 w-full text-left scroll-mt-32">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] bg-[#101114] px-4 py-1 rounded-full mb-8">
              CORE CAPABILITIES // WHY VEILDROP
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
              Engineered for absolute speed.
            </h2>

            <p className="text-sm sm:text-base text-[#888b94] max-w-lg font-normal leading-relaxed mb-12">
              Experience peer-to-peer data tunneling enhanced by rich visual feedback and cryptographic perfection.
            </p>
          </div>

          {/* Small Bento Grid (4 compact cells, zero scaling, smooth 3D magnetic tilt) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 w-full max-w-5xl mx-auto">
            
            {/* Cell 1: 2 Columns - Midnight Indigo Grain */}
            <BentoCard
              className="md:col-span-2"
              bgClassName="bg-gradient-to-br from-[#151828] via-[#0f111d] to-[#0a0b12] border border-[#60a5fa]/20 hover:border-[#60a5fa]/40 transition-colors duration-500"
              badge={
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
                  CRYPTOGRAPHIC RETENTION
                </span>
              }
              badgeBg="bg-[#1e2238]"
              badgeColor="text-[#ded1b6]"
              title="0.0 Bytes saved on cloud servers."
              subtitle="Conventional platforms archive files on vulnerable central disks. Your decryption keys exist strictly inside secret URL hash fragments (#k=) that never transmit over network headers."
              actionText="VERIFY CIPHER SPECIFICATION"
              actionColor="text-[#ded1b6]"
              onClick={() => window.open('https://github.com', '_blank')}
            />

            {/* Cell 2: 1 Column - Titanium Champagne Grain */}
            <BentoCard
              className=""
              bgClassName="bg-gradient-to-br from-[#24201a] via-[#161410] to-[#0e0c09] border border-[#ded1b6]/20 hover:border-[#ded1b6]/40 transition-colors duration-500"
              badge="VELOCITY"
              badgeBg="bg-[#332c23]"
              badgeColor="text-[#ded1b6]"
              title="Gigabit LAN Speed"
              subtitle="Bypass internet bottlenecks. Data stream packets traverse directly across your local switch or home Wi-Fi at maximum throughput."
              actionText="START BEAM"
              actionColor="text-[#ded1b6]"
              onClick={() => onLaunch('send')}
            />

            {/* Cell 3: 1 Column - Obsidian Emerald Grain */}
            <BentoCard
              className=""
              bgClassName="bg-gradient-to-br from-[#111e1b] via-[#0b1412] to-[#070d0b] border border-[#34d399]/20 hover:border-[#34d399]/40 transition-colors duration-500"
              badge="INSTANT EXTRACTION"
              badgeBg="bg-[#1b312b]"
              badgeColor="text-[#34d399]"
              title="Zero Client Apps"
              subtitle="Recipients never need accounts or software installations. Paste any transfer link to extract payloads directly into RAM."
              actionText="OPEN RECEIVER"
              actionColor="text-[#34d399]"
              onClick={onReceive}
            />

            {/* Cell 4: 2 Columns - Deep Sapphire Grain */}
            <BentoCard
              className="md:col-span-2"
              bgClassName="bg-gradient-to-br from-[#12192b] via-[#0d121f] to-[#080b14] border border-[#60a5fa]/20 hover:border-[#60a5fa]/40 transition-colors duration-500"
              badge={
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-ping"></span>
                  ORBITAL LAN RADAR
                </span>
              }
              badgeBg="bg-[#1d2744]"
              badgeColor="text-[#60a5fa]"
              title="Automatic subnet peer detection."
              subtitle="When multiple computers share the same router or Wi-Fi network, Local Radar senses active listening sockets dynamically on a real-time concentric map without manual link copying."
              actionText="SCAN SUBNET NOW"
              actionColor="text-[#60a5fa]"
              onClick={() => onLaunch('radar')}
            />

          </div>
        </section>

        {/* Clean Symmetrical Editorial Architecture & Protocol Showcase */}
        <section className="mt-32 sm:mt-44 w-full max-w-5xl mx-auto space-y-16 sm:space-y-24">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] bg-[#101114] px-4 py-1 rounded-full mb-8">
              WORKFLOW // DIRECT TUNNEL PROTOCOL
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
              Simple, elegant three-step transfer.
            </h3>
            <p className="text-sm sm:text-base text-[#888b94] max-w-lg font-normal leading-relaxed mb-12">
              No boxes inside boxes. Just clean architectural steps engineered for rapid point-to-point communication.
            </p>
          </div>

          <div className="w-full text-left">
            {/* Faded Gradient Divider Line (0% -> 20% -> 0%) */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 sm:mb-14" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
              {/* Step 01: STAGE PAYLOAD */}
              <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#221f19] to-[#14120e] border border-[#ded1b6]/20 flex items-center justify-center text-[#ded1b6] shadow-sm shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A4.502 4.502 0 0118 19.5H6.75z" />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#ded1b6] uppercase tracking-widest font-medium">
                    STAGE PAYLOAD
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">RAM Buffer Staging</div>
                <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">
                  Files load directly into volatile browser RAM. Data is chunked in memory with zero cloud storage.
                </p>
              </div>

              {/* Step 02: CIPHER LINK */}
              <div className="space-y-2 md:border-r border-white/[0.08] md:pr-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#122b22] to-[#0a1813] border border-[#34d399]/20 flex items-center justify-center text-[#34d399] shadow-sm shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#34d399] uppercase tracking-widest font-medium">
                    CIPHER LINK
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Ephemeral AES Key</div>
                <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">
                  256-bit key embeds inside secret URL fragment (<code className="text-[#34d399]">#k=</code>), invisible to HTTP servers.
                </p>
              </div>

              {/* Step 03: INSTANT BEAM */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162545] to-[#0c1426] border border-[#60a5fa]/20 flex items-center justify-center text-[#60a5fa] shadow-sm shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#60a5fa] uppercase tracking-widest font-medium">
                    INSTANT BEAM
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Direct WebRTC Stream</div>
                <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed">
                  P2P encrypted tunnel streams data directly between browsers at maximum network speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rich Grainy Call-to-Action Section */}
        <section className="mt-40 sm:mt-56 w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-tr from-[#1b1916] via-[#11100e] to-[#0a0a0d] film-grain p-12 sm:p-20 text-center flex flex-col items-center relative overflow-hidden shadow-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
          <span className="text-[10px] font-mono text-[#ded1b6] uppercase tracking-widest bg-[#27231c] px-4 py-1.5 rounded-full mb-6 relative z-10 shadow-sm">
            GET STARTED // VOLATILE STREAMING
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium text-[#ffffff] mb-4 font-heading tracking-tight relative z-10">
            Ready for instantaneous streaming?
          </h2>
          <p className="text-xs sm:text-sm text-[#9e9990] max-w-md mb-10 font-normal leading-relaxed relative z-10">
            Launch a direct end-to-end encrypted channel between your devices right now.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative z-10">
            <Button
              variant="luxury"
              size="md"
              onClick={() => onLaunch('send')}
              className="px-10 py-4 text-xs sm:text-sm font-medium rounded-full uppercase tracking-wider bg-[#ffffff] text-[#050506] hover:bg-[#ded1b6] transition-colors shadow-xl"
            >
              Start Stream Now
            </Button>
          </motion.div>
        </section>
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="mt-auto py-14 text-center text-[11px] font-mono text-[#555866] bg-[#050608]">
        <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-[#8a8e9e]">VEILDROP // PURE POINT-TO-POINT TRANSFERS</span>
          <div className="flex items-center gap-8 font-normal text-[#8a8e9e]">
            <span className="hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => onLaunch('send')}>Send</span>
            <span className="hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => onReceive()}>Receive</span>
            <span className="hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => onLaunch('radar')}>Local Radar</span>
            <span className="hover:text-[#ffffff] transition-colors cursor-pointer" onClick={() => window.open('https://github.com', '_blank')}>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
