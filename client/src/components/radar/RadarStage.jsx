import React, { useState } from 'react';

/**
 * Interactive Radar Stage & Drop Zone Component
 * Displays orbiting peer devices with live click selection & drag-and-drop file uploaders.
 */
export default function RadarStage({ peers, selectedPeer, toggleSelectPeer, initiateBeam }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const getIconForType = (type) => {
    switch (type) {
      case 'Mobile': return '📱';
      case 'Laptop': return '💻';
      default: return '🖥️';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => initiateBeam(file));
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => initiateBeam(file));
      e.target.value = '';
    }
  };

  return (
    <section className="radar-stage glass-panel" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <header className="stage-header">
        <h2>Select Peer or Drop Directly</h2>
        <span className="badge">{peers.length} Peers Discovered</span>
      </header>

      {/* Animated Radar Visual Field */}
      <div className="radar-container">
        <div className="radar-sweep"></div>
        <div className="radar-circle circle-inner"></div>
        <div className="radar-circle circle-mid"></div>
        <div className="radar-circle circle-outer"></div>

        {/* Center Host Device */}
        <div className="node self-node">
          <div className="node-glow"></div>
          <div className="node-icon">💻</div>
          <span className="node-label">This Device</span>
        </div>

        {/* Surrounding Discovered Nodes */}
        {peers.map((peer) => {
          const isSelected = selectedPeer && selectedPeer.id === peer.id;
          return (
            <div
              key={peer.id}
              className={`node peer-node ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSelectPeer(peer)}
              style={{ '--angle': `${peer.angle}deg`, '--dist': `${peer.dist}px` }}
            >
              <div className="peer-ping"></div>
              <div className="node-icon">{getIconForType(peer.deviceType)}</div>
              <span className="node-label">{peer.deviceName}</span>
              <span className="peer-signal">{peer.signal}</span>
            </div>
          );
        })}
      </div>

      {/* Drag & Drop File Selector Banner */}
      <div className="drop-target-area">
        <input type="file" id="file-selector" multiple className="file-input-hidden" onChange={handleFileSelect} />
        <label htmlFor="file-selector" className={`drop-trigger ${isDragOver ? 'dragover' : ''}`}>
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div className="drop-text">
            <span className="highlight">Click to select files</span> or drag and drop onto any peer node above
          </div>
          <p className="drop-hint">Supports ultra-fast high resolution media, directories, and encrypted packages with 0 server logs.</p>
        </label>
      </div>
    </section>
  );
}
