import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/common/Header';
import { Toaster, toast } from 'sonner';
import RadarStage from './components/radar/RadarStage';
import PrivateSenderStage from './components/send/PrivateSenderStage';
import PrivateReceiverStage from './components/receive/PrivateReceiverStage';
import LandingPage from './components/landing/LandingPage';
import Footer from './components/common/Footer';
import { usePeers } from './hooks/usePeers';
import { useTransfers } from './hooks/useTransfers';
import { socketService } from './services/socketService';
import { webrtcService } from './services/webRTCService';
import { cryptoService } from './services/cryptoService';

/**
 * Root Application Container
 * Ensures 100% universal consistency in container width (max-w-6xl), background (#070708), and typography.
 */
export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('send'); // 'send' | 'receive' | 'radar'
  const [incomingOfferState, setIncomingOfferState] = useState(null);
  const addToast = useCallback((message) => {
    toast(message);
  }, []);

  const { peers, selectedPeer, toggleSelectPeer } = usePeers('Sender-Host', addToast);
  const { activeTransfers, historyVault, initiateBeam, clearHistory } = useTransfers(addToast, selectedPeer);

  // Automatically scroll to the top of the page whenever the view or tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, activeTab]);

  // Synchronize view & activeTab with URL bar
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      
      let route = path;
      if (!route && hash && !hash.includes('room=')) {
        route = hash;
      }
      if (hash.includes('room=')) {
        route = 'receive';
      }

      if (['send', 'receive', 'radar'].includes(route)) {
        setView('app');
        setActiveTab(route);
      } else if (route === '' || route === 'landing') {
        setView('landing');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Global listeners for WebRTC signals so we can accept transfers regardless of active tab
  useEffect(() => {
    const handleOffer = async (data) => {
      // Show intercept modal so the user can click "Accept" (triggering File System API)
      setIncomingOfferState(data);
    };

    const handleIceCandidate = (data) => {
      webrtcService.handleReceiveIceCandidate(data.candidate);
    };

    socketService.on('signal:offer', handleOffer);
    socketService.on('signal:ice_candidate', handleIceCandidate);

    return () => {
      socketService.off('signal:offer', handleOffer);
      socketService.off('signal:ice_candidate', handleIceCandidate);
    };
  }, [addToast]);

  const handleLaunch = (mode = 'send') => {
    setActiveTab(mode);
    setView('app');
    window.history.pushState(null, '', `/${mode}`);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab}`);
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} onReceive={() => handleLaunch('receive')} />;
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#e6e7eb] relative selection:bg-[#22242b] selection:text-[#ded1b6] font-sans flex flex-col justify-between">
      {/* Fixed Top Navbar with Normal Navlinks */}
      <Header
        onBackToLanding={handleBackToLanding}
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        onNavigateHowItWorks={() => {
          handleBackToLanding();
          setTimeout(() => {
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Primary Universal Stage (Exactly max-w-6xl across every page for consistent UX) */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-10 pt-32 pb-32 sm:pt-44 sm:pb-44 flex-1 flex flex-col items-center">
        <div className="w-full">
          {activeTab === 'send' && (
            <PrivateSenderStage initiateBeam={initiateBeam} addToast={addToast} />
          )}
          {activeTab === 'receive' && (
            <PrivateReceiverStage addToast={addToast} />
          )}
          {activeTab === 'radar' && (
            <RadarStage
              peers={peers}
              selectedPeer={selectedPeer}
              toggleSelectPeer={toggleSelectPeer}
              initiateBeam={initiateBeam}
            />
          )}
        </div>

        {/* Floating Active Stream Progress Bar (Zero Boxy Bento Cards!) */}
        <AnimatePresence>
          {activeTransfers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md p-4 rounded-2xl bg-[#12141a]/95 backdrop-blur-lg border border-[#262933] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#f2f3f7] truncate max-w-[70%]">
                    Streaming: {activeTransfers[0].fileName}
                  </span>
                  <span className="font-mono text-[11px] text-[#ded1b6]">
                    {activeTransfers[0].progress}%
                  </span>
                </div>
                <div className="w-full h-1 bg-[#1c1e26] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ded1b6] transition-all duration-200"
                    style={{ width: `${activeTransfers[0].progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#71747e]">
                  <span>To: {activeTransfers[0].targetPeer}</span>
                  <span>{activeTransfers[0].speed}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Inline Completed History Row (Zero Boxy Bento Cards!) */}
        {historyVault.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#181a22] w-full max-w-lg mx-auto text-center">
            <div className="text-[10px] font-mono text-[#71747e] uppercase tracking-widest mb-3">
              Session Transmission Log
            </div>
            <div className="space-y-2">
              {historyVault.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 px-4 rounded-xl bg-[#0c0d11] border border-[#181a22] text-[#cccccc]">
                  <span className="truncate max-w-[60%] font-medium">{item.fileName}</span>
                  <span className="text-[#34d399] font-mono text-[11px]">Completed • {item.sizeStr}</span>
                </div>
              ))}
            </div>
            <button
              onClick={clearHistory}
              className="text-[11px] font-mono text-[#71747e] hover:text-[#cccccc] mt-3 underline transition-colors cursor-pointer"
            >
              Clear transfer history
            </button>
          </div>
        )}
      </main>

      {/* Floating Modal for Incoming File (To capture user gesture for File System Access API) */}
      <AnimatePresence>
        {incomingOfferState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0b0c10] border border-[#181a26] rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
              
              <div className="w-12 h-12 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center mb-4 relative z-10">
                <svg className="w-6 h-6 text-[#34d399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-[#f2f3f7] mb-2 relative z-10">Incoming Transmission</h3>
              
              <div className="bg-[#050508] border border-white/[0.04] rounded-xl p-3 w-full mb-6 relative z-10">
                <p className="text-[13px] font-mono text-[#ded1b6] truncate mb-1">{incomingOfferState.fileMetadata.name}</p>
                <p className="text-[11px] font-mono text-[#71747e]">{(incomingOfferState.fileMetadata.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>

              <div className="flex gap-3 w-full relative z-10">
                <button
                  onClick={() => setIncomingOfferState(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.1] text-xs font-medium text-[#888b94] hover:text-[#f2f3f7] hover:bg-white/[0.05] transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={async () => {
                    const data = incomingOfferState;
                    setIncomingOfferState(null); // Optimistic UI close
                    
                    window.dispatchEvent(new CustomEvent('webrtc:incoming_transfer', {
                      detail: {
                        fileName: data.fileMetadata.name,
                        size: data.fileMetadata.size,
                        senderId: data.senderId
                      }
                    }));

                    // 1. Ask user where to save the file (File System Access API)
                    if ('showSaveFilePicker' in window) {
                      try {
                        const handle = await window.showSaveFilePicker({
                          suggestedName: data.fileMetadata.name,
                          types: [{ description: 'All Files', accept: { '*/*': [] } }]
                        });
                        webrtcService.fileWritableStream = await handle.createWritable();
                        addToast('💾 Saving directly to disk...');
                      } catch (e) {
                        console.warn('File System Access API cancelled or failed. Falling back to RAM.', e);
                        addToast('⚠️ Streaming to RAM buffer (Direct Disk Save cancelled)');
                      }
                    } else {
                      addToast('⚠️ Streaming to RAM buffer (Browser unsupported)');
                    }

                    // 2. Extract Crypto Key
                    let cryptoKey = null;
                    if (data.fileMetadata.encrypted) {
                      const hash = window.location.hash;
                      if (hash.includes('k=')) {
                        const urlParams = new URLSearchParams(hash.replace('#', '?'));
                        const keyStr = urlParams.get('k');
                        if (keyStr) {
                          try {
                            cryptoKey = await cryptoService.importKey(keyStr);
                          } catch (e) {
                            console.error('Failed to import AES key:', e);
                            addToast('❌ Decryption failed: Invalid Key!');
                          }
                        }
                      }
                    }

                    // 3. Start Receiving WebRTC Offer
                    await webrtcService.handleReceiveOffer(data.senderId, data.offer, data.fileMetadata, cryptoKey);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#34d399] text-[#070708] font-semibold text-xs transition-colors hover:bg-[#4ade80]"
                >
                  Save to Disk
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Footer */}
      <Footer onLaunch={handleLaunch} onReceive={() => handleLaunch('receive')} />

      {/* Luxury Minimalist Sonner Toasts */}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: { 
            background: '#0b0c10', 
            border: '1px solid #181a26', 
            color: '#ded1b6',
            fontFamily: 'monospace',
            fontSize: '11px',
            borderRadius: '12px'
          }
        }}
      />
    </div>
  );
}
