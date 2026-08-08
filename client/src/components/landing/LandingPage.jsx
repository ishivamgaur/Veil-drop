import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import BentoCard from './BentoCard';
import Footer from '../common/Footer';

/**
 * Editorial Borderless Monochromatic Landing Page
 * Zero cards, zero borders, pure fluid linear studio aesthetic.
 */
export default function LandingPage({ onLaunch, onReceive }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  const scrollToHowItWorks = () => {
    setMobileMenuOpen(false);
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#e6e7eb] selection:bg-[#22242b] selection:text-[#ded1b6] flex flex-col font-sans relative">
      {/* Fixed Top Navbar without border */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070708]/80 backdrop-blur-md transition-colors select-none">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-10 py-3 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-6 h-6 rounded bg-[#ded1b6] flex items-center justify-center text-[#070708] font-mono font-bold text-xs">
              V
            </div>
            <span className="text-base font-semibold tracking-tight text-[#f2f3f7] font-heading">
              VEILDROP
            </span>
          </div>

          {/* Stable navigation without any bolding on hover or width shifting */}
          <nav className="hidden sm:flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-normal tracking-wide">
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

          <div className="hidden sm:block">
            <Button
              variant="luxury"
              size="sm"
              onClick={() => onLaunch('send')}
              className="text-xs px-5 py-2 font-normal"
            >
              Start Transfer
            </Button>
          </div>

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

            <button onClick={() => { onLaunch('send'); setMobileMenuOpen(false); }} className="text-4xl font-heading tracking-tight text-[#f2f3f7]">
              Send
            </button>
            <button onClick={() => { onReceive(); setMobileMenuOpen(false); }} className="text-4xl font-heading tracking-tight text-[#f2f3f7]">
              Receive
            </button>
            <button onClick={() => { onLaunch('radar'); setMobileMenuOpen(false); }} className="text-4xl font-heading tracking-tight text-[#f2f3f7]">
              Radar
            </button>
            <button onClick={scrollToHowItWorks} className="text-4xl font-heading tracking-tight text-[#71747e] mt-4">
              How It Works
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-10 pt-32 pb-32 sm:pt-44 sm:pb-44 flex flex-col items-center text-center">
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
          <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto mt-12 sm:mt-14">
            {/* Horizontal Card 1: Connection Protocol */}
            <div className="rounded-[2rem] border border-white/[0.08] p-4 sm:p-5 group bg-[#050508] shadow-sm flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1 space-y-3 px-2 sm:px-6 py-4 md:py-0 w-full">
                <div className="text-[10px] font-mono text-[#ded1b6] uppercase tracking-widest font-medium mb-3">
                  01 // CONNECTION PROTOCOL
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">Device to Device</div>
                <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-md">
                  Direct high-speed P2P stream globally. Data packets bypass external servers entirely for pure transmission.
                </div>
              </div>
              <div className="w-full md:w-[240px] lg:w-[280px] shrink-0 aspect-[16/9] rounded-2xl overflow-hidden relative border border-white/[0.04]">
                <img src="/connection_protocol_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              </div>
            </div>

            {/* Horizontal Card 2: Privacy Scheme */}
            <div className="rounded-[2rem] border border-white/[0.08] p-4 sm:p-5 group bg-[#050508] shadow-sm flex flex-col-reverse md:flex-row-reverse items-center gap-6 sm:gap-10">
              <div className="flex-1 space-y-3 px-2 sm:px-6 py-4 md:py-0 w-full">
                <div className="text-[10px] font-mono text-[#34d399] uppercase tracking-widest font-medium mb-3">
                  02 // PRIVACY SCHEME
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ded1b6] font-heading">End-to-End Encrypted</div>
                <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-md">
                  Locked before leaving your machine. URL fragment decryption keys never touch network boundaries.
                </div>
              </div>
              <div className="w-full md:w-[240px] lg:w-[280px] shrink-0 aspect-[16/9] rounded-2xl overflow-hidden relative border border-white/[0.04]">
                <img src="/privacy_scheme_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              </div>
            </div>

            {/* Horizontal Card 3: Cloud Retention */}
            <div className="rounded-[2rem] border border-white/[0.08] p-4 sm:p-5 group bg-[#050508] shadow-sm flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1 space-y-3 px-2 sm:px-6 py-4 md:py-0 w-full">
                <div className="text-[10px] font-mono text-[#60a5fa] uppercase tracking-widest font-medium mb-3">
                  03 // CLOUD RETENTION
                </div>
                <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading">0.0 Bytes Saved</div>
                <div className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-md">
                  Zero persistent storage. Files are buffered purely in volatile browser RAM during transmission.
                </div>
              </div>
              <div className="w-full md:w-[240px] lg:w-[280px] shrink-0 aspect-[16/9] rounded-2xl overflow-hidden relative border border-white/[0.04]">
                <img src="/cloud_retention_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compact Micro-Bento Grid with Exact Hero-Section Spacing */}
        <section id="how-it-works" className="mt-32 sm:mt-44 w-full text-left scroll-mt-32">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] border border-[#22242b] bg-[#101114] px-3.5 py-1 rounded-full mb-8">
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
              onClick={() => window.open('https://github.com/ishivamgaur/Veil-drop', '_blank')}
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
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] border border-[#22242b] bg-[#101114] px-3.5 py-1 rounded-full mb-8">
              WORKFLOW // DIRECT TUNNEL PROTOCOL
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
              Simple, elegant three-step transfer.
            </h3>
            <p className="text-sm sm:text-base text-[#888b94] max-w-lg font-normal leading-relaxed mb-12">
              No boxes inside boxes. Just clean architectural steps engineered for rapid point-to-point communication.
            </p>
          </div>

          <div className="w-full text-left mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              
              {/* Step 01: STAGE PAYLOAD */}
              <div className="flex flex-col group bg-[#050508] border border-white/[0.08] rounded-[2rem] p-3 sm:p-4 shadow-sm">
                <div className="w-full aspect-[16/9] rounded-[1.25rem] overflow-hidden relative border border-white/[0.04] mb-6">
                  <img src="/stage_payload_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                </div>
                
                <div className="px-3 pb-4">
                  <div className="text-[10px] font-mono text-[#ded1b6] uppercase tracking-widest font-medium mb-4">
                    01 // STAGE PAYLOAD
                  </div>
                  <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading mb-3">RAM Buffer Staging</div>
                  <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-sm">
                    Files load directly into volatile browser RAM. Data is chunked in memory with zero cloud storage.
                  </p>
                </div>
              </div>

              {/* Step 02: CIPHER LINK */}
              <div className="flex flex-col group bg-[#050508] border border-white/[0.08] rounded-[2rem] p-3 sm:p-4 shadow-sm">
                <div className="w-full aspect-[16/9] rounded-[1.25rem] overflow-hidden relative border border-white/[0.04] mb-6">
                  <img src="/cipher_link_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                </div>
                
                <div className="px-3 pb-4">
                  <div className="text-[10px] font-mono text-[#34d399] uppercase tracking-widest font-medium mb-4">
                    02 // CIPHER LINK
                  </div>
                  <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading mb-3">Ephemeral AES Key</div>
                  <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-sm">
                    256-bit key embeds inside secret URL fragment (<code className="text-[#34d399]">#k=</code>), invisible to HTTP servers.
                  </p>
                </div>
              </div>

              {/* Step 03: INSTANT BEAM */}
              <div className="flex flex-col group bg-[#050508] border border-white/[0.08] rounded-[2rem] p-3 sm:p-4 shadow-sm">
                <div className="w-full aspect-[16/9] rounded-[1.25rem] overflow-hidden relative border border-white/[0.04] mb-6">
                  <img src="/instant_beam_sm.jpg?v=2" alt="" className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] grayscale-[0.5] mix-blend-luminosity " />
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                </div>
                
                <div className="px-3 pb-4">
                  <div className="text-[10px] font-mono text-[#60a5fa] uppercase tracking-widest font-medium mb-4">
                    03 // INSTANT BEAM
                  </div>
                  <div className="text-xl sm:text-2xl font-medium text-[#ffffff] font-heading mb-3">Direct WebRTC Stream</div>
                  <p className="text-xs sm:text-sm text-[#888b94] font-normal leading-relaxed max-w-sm">
                    P2P encrypted tunnel streams data directly between browsers at maximum network speed.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* System Architecture & Encryption Diagrams */}
        <section className="mt-32 sm:mt-44 w-full max-w-5xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] border border-[#22242b] bg-[#101114] px-3.5 py-1 rounded-full mb-8">
              SYSTEM ARCHITECTURE
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
              Technical specifications.
            </h3>
            <p className="text-sm sm:text-base text-[#888b94] max-w-lg font-normal leading-relaxed">
              Explore the core infrastructure and cryptographic pipeline that powers our zero-server transmission protocol.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
            {/* Architecture Card 1 */}
            <div className="flex flex-col group bg-[#050508] border border-white/[0.08] rounded-[2rem] p-3 sm:p-4 shadow-sm w-full">
              <div className="text-[10px] font-mono text-[#ded1b6] uppercase tracking-widest font-medium px-3 pt-2 mb-3">
                SYSTEM TOPOLOGY
              </div>
              <div className="w-full rounded-[1.25rem] overflow-hidden relative border border-white/[0.04] bg-[#000000]">
                <motion.img layoutId="/architecture_diagram.jpg" src="/architecture_diagram.jpg" alt="Veil Drop Architecture Diagram" className="w-full h-auto object-contain cursor-zoom-in block relative z-10" onClick={() => setExpandedImage('/architecture_diagram.jpg')} />
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              </div>
            </div>

            {/* Architecture Card 2 */}
            <div className="flex flex-col group bg-[#050508] border border-white/[0.08] rounded-[2rem] p-3 sm:p-4 shadow-sm w-full">
              <div className="text-[10px] font-mono text-[#34d399] uppercase tracking-widest font-medium px-3 pt-2 mb-3">
                CRYPTOGRAPHIC PIPELINE
              </div>
              <div className="w-full rounded-[1.25rem] overflow-hidden relative border border-white/[0.04] bg-[#000000]">
                <motion.img layoutId="/detailed_encryption_flow.jpg" src="/detailed_encryption_flow.jpg" alt="Detailed Encryption Flow" className="w-full h-auto object-contain cursor-zoom-in block relative z-10" onClick={() => setExpandedImage('/detailed_encryption_flow.jpg')} />
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Call-to-Action Section */}
        <section className="mt-40 sm:mt-56 w-full rounded-none sm:rounded-t-[4rem] border-t border-white/[0.04] bg-[#070708] px-6 py-20 sm:py-32 text-center flex flex-col items-center relative overflow-hidden">
          
          {/* Subtle gradient at the very top to make it lighter near the border curve */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

          {/* Heavy noise for texture */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
          
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#888b94] border border-[#22242b] bg-[#101114] px-3.5 py-1 rounded-full mb-8 relative z-10">
            GET STARTED // VOLATILE STREAMING
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium text-[#ffffff] mb-4 font-heading tracking-tight relative z-10 max-w-3xl">
            Ready for instantaneous streaming?
          </h2>
          <p className="text-sm sm:text-base text-[#9e9990] max-w-xl mb-12 font-normal leading-relaxed relative z-10">
            Launch a direct end-to-end encrypted channel between your devices right now.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative z-10 mt-2">
            <Button
              variant="luxury"
              size="lg"
              onClick={() => onLaunch('send')}
              className="px-12 py-5 text-sm font-medium rounded-full uppercase tracking-wider bg-[#ded1b6] text-[#050506] hover:bg-[#ffffff] transition-colors shadow-2xl shadow-[#ded1b6]/10"
            >
              Start Stream Now
            </Button>
          </motion.div>
        </section>
        {/* Lightbox Modal */}
        <AnimatePresence>
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(null)}
              className="fixed inset-0 z-[200] bg-[#000000]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            >
              <motion.img
                layoutId={expandedImage}
                src={expandedImage}
                alt="Expanded view"
                className="max-w-5xl w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/[0.1] relative z-10 filter-none"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Close button */}
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-6 right-6 p-2 bg-[#101114] rounded-full text-[#888b94] hover:text-[#ded1b6] border border-white/[0.1] transition-colors focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mega-Typography Footer (Modern Tech Aesthetic) */}
      <Footer onLaunch={onLaunch} onReceive={onReceive} />
    </div>
  );
}
