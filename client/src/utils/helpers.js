/**
 * Pure Utility Helpers
 * Formats data sizes, generates ephemeral pins, and simulates network telemetry.
 */

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export const generateEphemeralPin = () => {
  const p1 = Math.floor(Math.random() * 900) + 100;
  const p2 = Math.floor(Math.random() * 900) + 100;
  return `${p1} - ${p2}`;
};

export const getRandomSpeed = () => {
  return Math.floor(Math.random() * 45) + 30; // 30-75 MB/s
};
