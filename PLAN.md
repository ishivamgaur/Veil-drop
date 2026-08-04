# 📋 Veil Drop Engineering Plan & Roadmap

> This document defines the step-by-step implementation strategy for **Veil Drop**.  
> Instead of copying existing solutions or dumping all code at once, we build this platform incrementally—validating architecture, performance, and security at each milestone.

---

## 🗺️ Execution Milestones

### Phase 1: Repository Foundation, Nomenclature & Standards (⏳ Current Status: IN PROGRESS)
- [x] Establish monorepo structure separating React client and Node.js backend.
- [x] Configure domain-driven directory nomenclature and separation of concerns.
- [x] Implement root-level code formatting specifications (`.prettierrc`, `.prettierignore`).
- [x] Create architectural & technical blueprints (`PLAN.md` & `ARCHITECTURE.md`).
- [ ] Align with User on Phase 2 implementation specs.

---

### Phase 2: Real-Time Network & Signaling Discovery Engine
**Goal**: Establish reliable real-time peer presence detection on the local network using WebSocket signaling without storing user state persistently.
- **Backend Task**: Refine Express & Socket.IO server to support heartbeat pings, device fingerprinting, and dynamic mesh list broadcasts.
- **Frontend Task**: Implement robust Socket client connection manager in React with automated reconnection back-off and UI connection status indicators.
- **Verification**: Open multiple browser tabs/windows and observe real-time peer discovery on the orbital radar stage without lag.

---

### Phase 3: True Peer-to-Peer Data Channels (WebRTC Handshaking)
**Goal**: Transition from simulated transfers to true direct peer-to-peer communication using WebRTC Data Channels, entirely bypassing server relay for raw file payloads.
- **Protocol Task**: Implement WebRTC signaling choreography over Socket.IO (`offer`, `answer`, `ice_candidate`).
- **File Chucking Engine**: Develop array-buffer file slicing (e.g., 64KB or 256KB chunks) with back-pressure handling for streaming ultra-large files (1GB+).
- **Progress Telemetry**: Compute accurate speed bandwidth (MB/s), estimated time remaining (ETA), and byte transfer confirmations.

---

### Phase 4: "Veil Privacy Layer" (End-to-End Encryption)
**Goal**: Guarantee total localized data confidentiality before files are streamed across network interfaces.
- **Web Crypto API**: Implement standard `AES-GCM` encryption algorithms directly inside the browser using JavaScript's native Web Crypto API.
- **Ephemeral PIN Exchange**: Generate short-lived verification PINs that act as out-of-band authorization keys or cryptographic salt derivations for each transmission.

---

### Phase 5: UI Polish, Micro-Animations & Error Resilience
**Goal**: Achieve an unforgettable "WOW" factor with responsive high-end aesthetics, haptic visual feedback, and comprehensive network disconnection recovery.
- **Aesthetic Refinements**: Fine-tune HSL glassmorphic lighting effects, orbital sweep shaders, and drag-and-drop interactive glow states.
- **Edge-Case Handling**: Implement graceful fallbacks for network interruptions, denied transfers, or file size limitation warnings.

---

## 🔄 How We Build Step-by-Step
1. **Discuss & Review**: Before jumping straight into writing code for the next Phase, we briefly confirm the specific architectural pattern and goals.
2. **Implement Iterative Code**: Write clean, self-documenting code following our nomenclature standards.
3. **Commit Meticulously**: Every functional progression is saved into Git history with clear semantic commit messaging.
