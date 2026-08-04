import React from 'react';

/**
 * Top Navigation Header Component
 * Renders brand styling, pulse radar animation, and user device customization.
 */
export default function Header({ deviceName, setDeviceName }) {
  return (
    <header className="app-header glass-panel">
      <div className="logo-group">
        <div className="pulse-icon">
          <span className="core"></span>
          <span className="ring ring-1"></span>
          <span className="ring ring-2"></span>
        </div>
        <div>
          <h1 className="brand-title">VEIL<span className="accent-text">DROP</span></h1>
          <p className="brand-subtitle">Instant Localized File Transmission</p>
        </div>
      </div>

      <div className="device-status">
        <div className="status-pill active" title="Local network discovery and signaling are active">
          <span className="status-dot"></span>
          <span className="status-label">Local Mesh Active</span>
        </div>
        <div className="user-identity">
          <span className="avatar">⚡</span>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="device-name-edit"
            spellCheck="false"
            title="Click to customize your node identity"
          />
        </div>
      </div>
    </header>
  );
}
