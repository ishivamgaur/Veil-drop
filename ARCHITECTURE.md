# 🏛️ Veil Drop Architecture & Nomenclature Specification

> This specification documents the system boundaries, design patterns, networking protocols, and clean code nomenclature that govern **Veil Drop**.

---

## 1. System Topology & Data Flow

Veil Drop relies on a hybrid network structure:
1. **Signaling Server (Node.js/Socket.IO)**: Acts exclusively as an introduction rendezvous point. It broadcasts presence and relays WebRTC session descriptions (ICE candidates, offers, answers). **No actual file payloads pass through this server.**
2. **Client Peers (React/WebRTC)**: Once handshaken via the signaling server, clients establish a direct, peer-to-peer (P2P) UDP/SCTP Data Channel for high-speed file chunk streaming.

```
       [ Signaling Server (Port 5000) ]
        ^                           ^
        | (1) Discovery & Handshake | 
        v                           v
 [ Client Peer A ] <===================> [ Client Peer B ]
                      (2) Direct P2P
                   Encrypted Data Channel
```

---

## 2. Code Nomenclature & Coding Standards

To maintain industry-standard craftsmanship, all code inside this repository must follow strict naming conventions:

### A. File & Component Naming
- **React Components**: `PascalCase` (e.g., `RadarStage.jsx`, `TransferMonitor.jsx`, `Header.jsx`).
- **Hooks & Services**: `camelCase` starting with explicit domain identity (e.g., `usePeers.js`, `socketService.js`).
- **CSS / Styling Files**: `camelCase` or descriptive domain names (e.g., `designSystem.css`).

### B. Variable & Function Nomenclature
- **Variables & Functions**: `camelCase` with intention-revealing names (e.g., `activeTransfers`, `initiateBeam()`, `generateEphemeralPin()`).
- **Constants & Configuration Keys**: `SCREAMING_SNAKE_CASE` (e.g., `CONFIG.PORT`, `EVENTS.PEER_JOINED`).
- **Boolean Flags**: Prefix with `is`, `has`, or `can` (e.g., `isConnected`, `hasEncryptionEnabled`, `canTransmit`).

### C. Folder Structure Responsibilities
- `client/src/components/`: Pure presentation and UI interaction logic only. Must not directly access raw WebSockets; delegate communication to custom hooks or services.
- `client/src/hooks/`: Custom React hooks acting as connectors between UI lifecycle and background service logic.
- `client/src/services/`: Stateless or framework-agnostic client engines (Socket networking, WebRTC peer connections, cryptographic shims).
- `server/src/controllers/`: Handle stateless request logic and network interrogations.
- `server/src/services/`: Stateful event orchestrators (Socket.IO rooms and active peer registry).

---

## 3. WebSocket Event Matrix

All signaling communication occurs via typed event string identifiers defined in `server/src/config/constants.js`:

| Event Identifier | Direction | Payload Description |
| :--- | :--- | :--- |
| `connection` | Client → Server | Initial WebSocket establishment socket handshake. |
| `peer:joined` | Bi-directional | Announces a new device entering the localized mesh. |
| `peer:left` | Server → Client | Broadcasts device termination or disconnection. |
| `peer:list_update` | Server → Client | Dispatches active directory of nearby available nodes. |
| `signal:offer` | Client ↔ Client | WebRTC SDP offer relayed through server. |
| `signal:answer` | Client ↔ Client | WebRTC SDP answer returning to offerer. |
| `signal:ice_candidate`| Client ↔ Client | UDP NAT traversal networking coordinates. |

---

## 4. Security & Encryption Standard ("The Veil")

When **Veil Privacy Mode** is active:
1. Prior to transmission, the file Blob is partitioned into `ArrayBuffer` chunks.
2. An ephemeral initialization vector (`IV`) and cryptographic key are derived using JavaScript's native **Web Crypto API** (`AES-GCM` algorithm).
3. Chunks are streamed in ciphertext over WebRTC; the receiving peer authenticates payloads using the matching ephemeral PIN/key before reconstruction.
