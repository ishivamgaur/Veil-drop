import React, { useState, useCallback } from 'react';
import Header from './components/common/Header';
import ToastContainer from './components/common/ToastContainer';
import RadarStage from './components/radar/RadarStage';
import VeilPrivacyPanel from './components/security/VeilPrivacyPanel';
import TransferMonitor from './components/transfers/TransferMonitor';
import HistoryVault from './components/transfers/HistoryVault';
import { usePeers } from './hooks/usePeers';
import { useTransfers } from './hooks/useTransfers';
import { generateId } from './utils/helpers';
import './styles/designSystem.css';

/**
 * Root Application Container
 * Orchestrates view modules, real-time networking state hooks, and UI notification queues.
 */
export default function App() {
  const [deviceName, setDeviceName] = useState('Desktop-Veil-01');
  const [toasts, setToasts] = useState([
    { id: 't1', message: '👋 Welcome to Veil Drop! Local enterprise signaling mesh active.' }
  ]);

  const removeToast = useCallback((id) => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message) => {
    const id = 't-' + generateId();
    setToasts(current => [...current, { id, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const { peers, selectedPeer, toggleSelectPeer } = usePeers(deviceName, addToast);
  const { activeTransfers, historyVault, initiateBeam, clearHistory } = useTransfers(addToast, selectedPeer);

  return (
    <>
      {/* Ambient background glows */}
      <div className="ambient-light blob-1"></div>
      <div className="ambient-light blob-2"></div>

      {/* Primary Interface Layout */}
      <div id="app-container">
        <Header deviceName={deviceName} setDeviceName={setDeviceName} />

        <main className="main-workspace">
          {/* Left / Center Orbit Radar Stage */}
          <RadarStage
            peers={peers}
            selectedPeer={selectedPeer}
            toggleSelectPeer={toggleSelectPeer}
            initiateBeam={initiateBeam}
          />

          {/* Right Column Monitor Panels */}
          <aside className="sidebar">
            <VeilPrivacyPanel addToast={addToast} />
            <TransferMonitor activeTransfers={activeTransfers} />
            <HistoryVault historyVault={historyVault} clearHistory={clearHistory} />
          </aside>
        </main>

        <footer className="app-footer">
          <div className="footer-left">
            <span>Veil Drop Protocol v2.0.0 — Enterprise Architecture (Inspired by Beam)</span>
          </div>
          <div className="footer-right">
            <span className="ping-status">⚡ Direct Socket.IO P2P Ready</span>
            <span>•</span>
            <span>🔒 End-to-End Veiled</span>
          </div>
        </footer>
      </div>

      {/* Floating Interactive Toast Feedback */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
