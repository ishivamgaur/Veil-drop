# ⏳ Veil Drop Development Timeline

## ✅ Phase 1: Foundation & UI Polish (COMPLETED)
- [x] Initialized Vite React application and Node.js/Express backend.
- [x] Implemented ultra-minimalist, sleek, high-end dark mode UI (glassmorphism removed, pure aesthetics applied).
- [x] Engineered fluid, mathematical, symmetrical grid layouts (Bento grids).
- [x] Integrated auto-scaling massive SVG footer typography (`VEILDROP`).
- [x] Refactored all application pages (`LandingPage`, `RadarStage`, `PrivateSenderStage`, `PrivateReceiverStage`) to use a universal `Footer.jsx`.
- [x] Perfected height alignment of Dropdown and File Selection inputs in Local Radar to match the Sender inputs precisely.
- [x] Removed all typographic Em Dashes (`—`) and replaced them with Hyphens (`-`).
- [x] Designed and generated custom glowing `#ded1b6` SVG Favicon.
- [x] Restored `architecture_diagram.jpg` and `detailed_encryption_flow.jpg` back to the landing page perfectly.

## 🚀 Phase 2: WebRTC Signaling Backend (COMPLETED)
- [x] Initialized Socket.io signaling service (`server/src/services/signalingService.js`).
- [x] Built Subnet Discovery grouping: Sockets are automatically assigned to isolated "Rooms" based on their Public/Local IP Address.
- [x] Built Private Link Room grouping: Custom generated `roomId`s allow isolated two-player private rooms.
- [x] Implemented WebRTC blind-relay listeners: `signal:offer`, `signal:answer`, and `signal:ice_candidate`.

## ✅ Phase 3: Frontend WebRTC Engine & Core Logic (COMPLETED)
- [x] Refactor `client/src/services/socketService.js` to emit and listen for pure WebRTC signals instead of simulated transfer events.
- [x] Create `client/src/services/webRTCService.js` to handle:
  - `RTCPeerConnection` instantiation.
  - Generating and accepting Offers/Answers.
  - Exchanging ICE candidates for NAT traversal.
  - Creating `RTCDataChannel` for high-speed file transfer.
- [x] Implement file chunking logic (slicing files into 64KB chunks to push through the `RTCDataChannel`).
- [x] Implement real-time progress calculations, speed (MB/s), and ETA tracking directly driven by WebRTC byte transfer events.

## ✅ Phase 4: AES-GCM End-to-End Encryption (COMPLETED)
- [x] Integrate standard Web Crypto API into the `webRTCService.js`.
- [x] Automatically encrypt 64KB chunks before they enter the data channel.
- [x] Embed the encryption key exclusively in the URL Hash Fragment (`#k=`) so it never touches the server.

## ✨ Phase 5: Final Polish & Performance (IN PROGRESS)
- [x] **256KB Network Chunks:** Upgraded from 16KB → 256KB SCTP chunks. 16× fewer `send()` calls = massively reduced overhead, especially on non-local (internet) connections.
- [x] **Macro-Block Encryption:** AES-GCM encryption now operates on entire 8MB disk blocks instead of per 16KB chunk. Reduces async crypto overhead by 16×, making E2EE transfers practical at internet speeds.
- [x] **Non-Blocking Backpressure:** `bufferedamountlow` listener pre-wired once outside the send loop. No per-chunk event listener add/remove overhead.
- [x] **Unordered DataChannel for Plaintext:** When E2EE is off, channel uses `ordered: false, maxRetransmits: 0` for true UDP semantics (no head-of-line blocking on packet loss).
- [x] **8MB Disk Read Blocks:** Upgraded from 4MB → 8MB disk I/O reads, better amortizing file read latency.
- [x] **20 FPS Progress Updates:** Throttled from 10 FPS → 20 FPS (50ms threshold) for smoother UI feedback.
- [x] **Multi-File Queue Fix:** `onChannelReady` now iterates all selected files sequentially, not just `[0]`.
- [x] **Debug Button Removed:** Removed "Simulate Join" test button from production `PrivateSenderStage`.
- [ ] Thorough QA testing of local network transfers and internet transfers.
- [ ] Fix any edge cases regarding failed network traversal (STUN/TURN fallback).
- [ ] Error state UI when `webrtc:transfer_error` fires (stuck progress bar fix).
- [ ] Transfer cancel/abort button in the active transfer progress bar.

## 🔮 Phase 6: Enterprise Architecture Upgrades (Future Roadmap)
- [x] **File System Access API (Completed):** Stream incoming WebRTC chunks directly to the user's hard drive to support massive (50GB+) file transfers without crashing the browser's memory.
- [ ] **Resumable Transfers & Merkle Trees:** Hash the file into a Merkle Tree to allow resuming interrupted transfers from the exact chunk where they dropped, rather than restarting from 0%.
- [ ] **Horizontal Scaling (Redis):** If massive user scale is reached, replace the in-memory Node.js `Map()` with a Redis database to allow deploying multiple signaling servers behind a load balancer.
