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

## 🛠️ Phase 3: Frontend WebRTC Engine & Core Logic (IN PROGRESS - CURRENT)
- [ ] Refactor `client/src/services/socketService.js` to emit and listen for pure WebRTC signals instead of simulated transfer events.
- [ ] Create `client/src/services/webRTCService.js` to handle:
  - `RTCPeerConnection` instantiation.
  - Generating and accepting Offers/Answers.
  - Exchanging ICE candidates for NAT traversal.
  - Creating `RTCDataChannel` for high-speed file transfer.
- [ ] Implement file chunking logic (slicing files into 64KB chunks to push through the `RTCDataChannel`).
- [ ] Implement real-time progress calculations, speed (MB/s), and ETA tracking directly driven by WebRTC byte transfer events.

## 🔒 Phase 4: AES-GCM End-to-End Encryption (PENDING)
- [ ] Integrate standard Web Crypto API into the `webRTCService.js`.
- [ ] Automatically encrypt 64KB chunks before they enter the data channel.
- [ ] Embed the encryption key exclusively in the URL Hash Fragment (`#k=`) so it never touches the server.

## ✨ Phase 5: Final Polish & Production Build (PENDING)
- [ ] Thorough QA testing of local network transfers and internet transfers.
- [ ] Fix any edge cases regarding failed network traversal (STUN/TURN fallback).
- [ ] Finalize UI states for disconnections or aborted transfers.
