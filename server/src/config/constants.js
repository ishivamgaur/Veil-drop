/**
 * Application Configuration & Networking Constants
 * Defines core parameters, WebSocket event identifiers, and CORS rules.
 */

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  APP_NAME: 'Veil Drop Signaling Server',
  VERSION: '1.0.0'
};

export const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  PEER_JOINED: 'peer:joined',
  PEER_LEFT: 'peer:left',
  PEER_LIST_UPDATE: 'peer:list_update',
  SIGNAL_OFFER: 'signal:offer',
  SIGNAL_ANSWER: 'signal:answer',
  SIGNAL_ICE_CANDIDATE: 'signal:ice_candidate',
  TRANSFER_INITIATE: 'transfer:initiate',
  TRANSFER_PROGRESS: 'transfer:progress',
  TRANSFER_COMPLETE: 'transfer:complete',
  ERROR: 'error'
};
