import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socketService } from '../../services/socketService';
import { webrtcService } from '../../services/webRTCService';

/**
 * Ultra Minimalist Receiver Portal
 *
 * Fix log:
 *  - socketService.connect() is now called before joinRoom() so the socket actually exists
 *  - Error state properly shown when link is invalid or connection drops
 *  - Auto-connect from URL hash works on direct link open
 *  - "Connecting" state has a timeout fallback so it doesn't hang forever
 */
export default function PrivateReceiverStage({ addToast }) {
  const [roomInput, setRoomInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'connecting' | 'waiting' | 'transferring' | 'complete' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [speed, setSpeed] = useState('');
  const cleanupRef = useRef(null);
  const connectTimeoutRef = useRef(null);

  // Auto-fill from URL hash and auto-connect when page loads with a share link
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('room=')) {
      const urlParams = new URLSearchParams(hash.replace('#', '?'));
      const roomId = urlParams.get('room');
      const key = urlParams.get('k');
      if (roomId && key) {
        const fullLink = `${window.location.origin}/receive#room=${roomId}&k=${key}`;
        setRoomInput(fullLink);
        // Slight delay so the UI animates in first
        setTimeout(() => triggerConnection(fullLink), 600);
      }
    }
    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) cleanupRef.current();
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetToIdle = () => {
    setStatus('idle');
    setProgress(0);
    setSpeed('');
    setErrorMsg('');
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    if (connectTimeoutRef.current) { clearTimeout(connectTimeoutRef.current); connectTimeoutRef.current = null; }
    webrtcService.reset();
  };

  const triggerConnection = (linkToParse) => {
    const link = (linkToParse ?? roomInput).trim();
    if (!link) {
      if (addToast) addToast('Paste your secure transfer link first.');
      return;
    }

    // ── 1. Parse room ID and key from the link ──────────────────────────────
    let roomId = link;
    let hashPart = '';

    if (link.includes('room=')) {
      hashPart = link.includes('#') ? link.substring(link.indexOf('#')) : '#' + link.split('?')[1];
      const urlParams = new URLSearchParams(hashPart.replace('#', '?'));
      roomId = urlParams.get('room');

      // Sync the browser URL so App.jsx can read the key from the hash
      if (window.location.hash !== hashPart) {
        window.history.replaceState(null, '', '/receive' + hashPart);
      }
    }

    if (!roomId) {
      setStatus('error');
      setErrorMsg('Could not extract room ID from link.');
      return;
    }

    setStatus('connecting');
    setProgress(0);
    setSpeed('');
    setErrorMsg('');
    if (addToast) addToast('Connecting to private mesh tunnel...');

    // ── 2. Ensure socket is connected BEFORE joining a room ─────────────────
    //    (This is the critical fix: joinRoom without connect() was a no-op)
    socketService.connect(
      { deviceName: 'Receiver-Host', deviceType: 'Desktop', roomId },
      null, // no peer-list UI needed on receiver
      null
    );

    // ── 3. Join the private room ─────────────────────────────────────────────
    socketService.joinRoom({ deviceName: 'Receiver-Host', deviceType: 'Desktop', roomId });

    // ── 4. Timeout: if sender never shows within 15s, show error ─────────────
    connectTimeoutRef.current = setTimeout(() => {
      if (status === 'connecting' || status === 'waiting') {
        setStatus('error');
        setErrorMsg('No sender found. Link may be expired or the sender went offline.');
        if (addToast) addToast('❌ Connection timed out. Is the sender still online?');
      }
    }, 15000);

    // ── 5. Check if sender is already in the room ───────────────────────────
    const handlePeerListUpdate = (peersInRoom) => {
      socketService.off('peer:list_update', handlePeerListUpdate);
      if (peersInRoom.length === 0) {
        // Sender is not here yet — move to waiting state (they may join soon)
        setStatus('waiting');
        if (addToast) addToast('Waiting for sender to come online...');
      }
      // If sender is here, the offer will arrive automatically via App.jsx global listener
    };
    socketService.on('peer:list_update', handlePeerListUpdate);

    // ── 6. Wire WebRTC progress events ──────────────────────────────────────
    const onChannelReady = () => {
      clearTimeout(connectTimeoutRef.current);
      setStatus('transferring');
      if (addToast) addToast('Tunnel secured. Data incoming...');
    };

    const onProgress = (e) => {
      setProgress(e.detail.progress);
      setSpeed(e.detail.speed || '');
    };

    const onComplete = () => {
      clearTimeout(connectTimeoutRef.current);
      setStatus('complete');
      if (addToast) addToast('Payload extracted successfully!');
      cleanup();
    };

    const onError = (e) => {
      clearTimeout(connectTimeoutRef.current);
      const msg = e.detail || 'Transfer failed.';
      setStatus('error');
      setErrorMsg(msg);
      cleanup();
    };

    const cleanup = () => {
      socketService.off('peer:list_update', handlePeerListUpdate);
      window.removeEventListener('webrtc:channel_ready', onChannelReady);
      window.removeEventListener('webrtc:progress', onProgress);
      window.removeEventListener('webrtc:transfer_complete', onComplete);
      window.removeEventListener('webrtc:transfer_error', onError);
    };

    // Store cleanup for unmount
    cleanupRef.current = cleanup;

    window.addEventListener('webrtc:channel_ready', onChannelReady);
    window.addEventListener('webrtc:progress', onProgress);
    window.addEventListener('webrtc:transfer_complete', onComplete);
    window.addEventListener('webrtc:transfer_error', onError);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerConnection(roomInput);
  };

  // ── Derived state helpers ──────────────────────────────────────────────────
  const isIdle    = status === 'idle';
  const isError   = status === 'error';
  const isDone    = status === 'complete';
  const isBusy    = !isIdle && !isError && !isDone;

  const buttonLabel = {
    idle:        'Extract',
    connecting:  'Connecting...',
    waiting:     'Waiting...',
    transferring: `${progress}%`,
    complete:    'Extracted ✓',
    error:       'Retry'
  }[status] ?? 'Extract';

  const borderColor = isError
    ? 'border-[#ef4444]/30'
    : isDone
      ? 'border-[#34d399]/30'
      : 'border-[#181a26]';

  return (
    <div className="w-full flex flex-col items-center text-center">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl flex flex-col items-center"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#34d399] border border-[#34d399]/20 bg-[#101d19] px-3.5 py-1 rounded-full mb-8">
          E2EE RECEIVER PORTAL
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f2f3f7] leading-[1.18] mb-6 font-heading">
          Extract payloads.
        </h2>

        <p className="text-sm sm:text-base text-[#888b94] max-w-md font-normal leading-relaxed mb-10">
          Paste a secure transfer link to decrypt and download payloads directly into local memory.
        </p>
      </motion.div>

      {/* ── Main Input Row ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center bg-[#0b0c10] p-1.5 sm:p-2 rounded-[2rem] border w-full max-w-2xl mx-auto shadow-sm relative overflow-hidden transition-colors duration-300 ${borderColor}`}
      >
        {/* Progress fill */}
        {status === 'transferring' && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#34d399]/10 transition-all duration-300 pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        )}

        <input
          type="text"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isBusy && handleSubmit(e)}
          placeholder="Paste extraction cipher (#room=...&k=...)"
          disabled={isBusy}
          className="flex-1 bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-sm font-mono text-[#f2f3f7] placeholder:text-[#555866] focus:outline-none min-w-0 z-10 disabled:opacity-60"
        />

        <button
          onClick={isError ? () => resetToIdle() : handleSubmit}
          disabled={isBusy && !isError}
          id="receiver-extract-btn"
          className={`text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-[1.5rem] font-medium text-[13px] sm:text-sm transition-all duration-200 cursor-pointer shadow-sm shrink-0 font-semibold active:scale-[0.99] disabled:opacity-50 z-10
            ${isDone
              ? 'bg-[#34d399] text-[#070708]'
              : isError
                ? 'bg-[#ef4444] hover:bg-[#f87171] text-white'
                : 'bg-[#34d399] hover:bg-[#4ade80] text-[#070708]'
            }`}
        >
          {buttonLabel}
        </button>
      </motion.div>

      {/* ── Status / Error Row ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {(isBusy || isError || isDone) && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between w-full max-w-2xl mx-auto mt-3 px-2"
          >
            <span className="flex items-center gap-2 text-[11px] font-mono">
              {/* Status dot */}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isError
                  ? 'bg-[#ef4444]'
                  : isDone
                    ? 'bg-[#34d399]'
                    : status === 'transferring'
                      ? 'bg-[#34d399] animate-pulse'
                      : 'bg-[#ded1b6] animate-ping'
              }`} />

              <span className={isError ? 'text-[#ef4444]' : isDone ? 'text-[#34d399]' : 'text-[#888b94]'}>
                {isError
                  ? errorMsg
                  : isDone
                    ? 'File saved — tunnel sealed.'
                    : status === 'transferring'
                      ? `Receiving... ${speed ? '• ' + speed : ''}`
                      : status === 'waiting'
                        ? 'Waiting for sender to come online...'
                        : 'Establishing encrypted tunnel...'}
              </span>
            </span>

            {/* Reset link on error or done */}
            {(isError || isDone) && (
              <button
                onClick={resetToIdle}
                className="text-[11px] font-mono text-[#71747e] hover:text-[#f2f3f7] underline transition-colors cursor-pointer ml-4 shrink-0"
              >
                {isDone ? 'New transfer' : 'Try again'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
