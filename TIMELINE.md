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

## ✨ Phase 5: Final Polish & Production Build (PENDING)
- [ ] Thorough QA testing of local network transfers and internet transfers.
- [ ] Fix any edge cases regarding failed network traversal (STUN/TURN fallback).
- [ ] Finalize UI states for disconnections or aborted transfers.

## 🔮 Phase 6: Enterprise Architecture Upgrades (Future Roadmap)
- [ ] **File System Access API (Critical):** Replace the volatile RAM `ArrayBuffer` with the HTML5 File System Access API. Stream incoming WebRTC chunks directly to the user's hard drive to support massive (50GB+) file transfers without crashing the browser's memory.
- [ ] **Backpressure Handling:** Monitor the `RTCDataChannel.bufferedAmount`. Pause the upload loop when the network buffer fills up, waiting for it to drain to prevent packet loss.
- [ ] **Resumable Transfers & Merkle Trees:** Hash the file into a Merkle Tree to allow resuming interrupted transfers from the exact chunk where they dropped, rather than restarting from 0%.
- [ ] **Horizontal Scaling (Redis):** If massive user scale is reached, replace the in-memory Node.js `Map()` with a Redis database to allow deploying multiple signaling servers behind a load balancer.
