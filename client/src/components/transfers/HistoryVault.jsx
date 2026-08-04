import React from 'react';

/**
 * Drop Vault History Component
 * Lists successfully transmitted local drop records with action buttons to clear logs.
 */
export default function HistoryVault({ historyVault, clearHistory }) {
  return (
    <div className="history-panel glass-panel">
      <header className="panel-header">
        <h3>Drop Vault (Local History)</h3>
        {historyVault.length > 0 && (
          <button className="btn-clear" onClick={clearHistory} title="Clear all history logs">
            Clear
          </button>
        )}
      </header>

      <ul className="history-list">
        {historyVault.length === 0 ? (
          <li className="history-item empty-history" style={{ justifyContent: 'center', color: 'var(--text-muted)', border: 'none', background: 'transparent', fontSize: '0.82rem', padding: '20px 0' }}>
            Vault log is currently empty.
          </li>
        ) : (
          historyVault.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-icon">⚡</div>
              <div className="history-meta">
                <div className="history-name" title={item.fileName}>{item.fileName}</div>
                <div className="history-info">
                  Beamed to <strong>{item.peerName}</strong> • {item.sizeStr}
                </div>
              </div>
              <span className="status-badge success">Beamed ✓</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
