import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/common/Header';
import ToastContainer from './components/common/ToastContainer';
import RadarStage from './components/radar/RadarStage';
import PrivateSenderStage from './components/send/PrivateSenderStage';
import PrivateReceiverStage from './components/receive/PrivateReceiverStage';
import LandingPage from './components/landing/LandingPage';
import { usePeers } from './hooks/usePeers';
import { useTransfers } from './hooks/useTransfers';
import { generateId } from './utils/helpers';

/**
 * Root Application Container
 * Ensures 100% universal consistency in container width (max-w-6xl), background (#070708), and typography.
 */
export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('send'); // 'send' | 'receive' | 'radar'
  const [toasts, setToasts] = useState([
    { id: 't1', message: 'End-to-end encryption engine ready. Zero server copies.' }
  ]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message) => {
    const id = 't-' + generateId();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const { peers, selectedPeer, toggleSelectPeer } = usePeers('Sender-Host', addToast);
  const { activeTransfers, historyVault, initiateBeam, clearHistory } = useTransfers(addToast, selectedPeer);

  // Synchronize view & activeTab with URL bar (supporting #send, #receive, #radar, and browser Back/Forward buttons)
  React.useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const route = hash || path;

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
      <main className="max-w-6xl w-full mx-auto px-6 sm:px-10 pt-32 pb-36 flex-1 flex flex-col items-center justify-center">
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

      {/* Universal Footer */}
      <footer className="border-t border-[#181a22] py-8 text-center text-[11px] font-mono text-[#626570] bg-[#070708]">
        <div className="max-w-6xl w-full mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>VEIL DROP • DIRECT PRIVATE TRANSFERS</span>
          <div className="flex items-center gap-6">
            <span className="text-[#ded1b6]">P2P TUNNELS ONLINE</span>
            <span>•</span>
            <span>0.0 BYTES SERVER STORAGE</span>
          </div>
        </div>
      </footer>

      {/* Interactive Floating Toast Feedback */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
