import React from 'react';

/**
 * Active Transfer Monitor Component
 * Displays real-time file transmissions, speed bandwidth rates, and progress completion bars.
 */
export default function TransferMonitor({ activeTransfers }) {
  return (
    <div className="transfers-panel glass-panel">
      <header className="panel-header">
        <h3>Active Transmissions</h3>
        <span className="count-pill">{activeTransfers.length}</span>
      </header>

      <div className="transfers-list">
        {activeTransfers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📡</div>
            <p>No active file beams.</p>
            <span>Select a peer and drop a file to start transmitting.</span>
          </div>
        ) : (
          activeTransfers.map((item) => (
            <div key={item.id} className="transfer-card">
              <div className="transfer-header">
                <span className="transfer-file" title={item.fileName}>📦 {item.fileName}</span>
                <span className="transfer-peer">→ {item.targetPeer}</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
              </div>
              <div className="transfer-stats">
                <span>{item.progress}%</span>
                <span>⚡ {item.speed} ({item.sizeStr})</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
