import React, { useState, useEffect } from 'react';
import { generateEphemeralPin } from '../../utils/helpers';

/**
 * Veil Privacy Settings Panel Component
 * Controls end-to-end local packaging mode and ephemeral PIN verification codes.
 */
export default function VeilPrivacyPanel({ addToast }) {
  const [isPrivacyActive, setIsPrivacyActive] = useState(true);
  const [pin, setPin] = useState('0 0 0 - 0 0 0');

  const refreshPin = () => {
    setPin(generateEphemeralPin());
    if (addToast) addToast('🔄 Regenerated Veil verification PIN.');
  };

  useEffect(() => {
    setPin(generateEphemeralPin());
  }, []);

  const handleToggle = (e) => {
    const val = e.target.checked;
    setIsPrivacyActive(val);
    if (addToast) {
      if (val) addToast('🔒 Veil Privacy Mode enabled (E2E simulation active).');
      else addToast('⚠️ Veil Privacy Mode disabled (Standard Direct Drop).');
    }
  };

  return (
    <div className="security-panel glass-panel">
      <div className="panel-header">
        <div className="header-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-color)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h3>Veil Privacy Mode</h3>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={isPrivacyActive} onChange={handleToggle} />
          <span className="slider"></span>
        </label>
      </div>
      <p className="panel-desc">
        When Veil Mode is active, files undergo localized AES-GCM packaging with an ephemeral verification code prior to stream transmission.
      </p>

      <div className="pin-display-box" style={{ opacity: isPrivacyActive ? 1 : 0.4, pointerEvents: isPrivacyActive ? 'auto' : 'none' }}>
        <span className="pin-label">EPHEMERAL VERIFICATION PIN</span>
        <div className="pin-code">{pin}</div>
        <button className="btn-refresh" onClick={refreshPin} title="Regenerate Security PIN">
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
}
