/**
 * Structured Application Logger
 * Provides color-coded timestamped logging for system observability and network telemetry.
 */

const getTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

export const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO]  [${getTimestamp()}] — ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN]  [${getTimestamp()}] — ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message, err = null) => {
    console.error(`[ERROR] [${getTimestamp()}] — ${message}`, err ? err.stack || err : '');
  },
  network: (event, socketId, details = '') => {
    console.log(`[NET]   [${getTimestamp()}] — [Event: ${event}] Socket: ${socketId} ${details}`);
  }
};
