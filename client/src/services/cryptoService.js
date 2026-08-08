export class CryptoService {
  /**
   * Generates a strong AES-GCM 256-bit key for End-to-End Encryption
   * Returns both the raw CryptoKey object and an exported base64 string for the URL Hash.
   */
  async generateKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await window.crypto.subtle.exportKey('raw', key);
    const exportedKeyBuffer = new Uint8Array(exported);
    const base64Key = btoa(String.fromCharCode.apply(null, exportedKeyBuffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // URL-safe base64

    return { key, base64Key };
  }

  /**
   * Imports a base64 URL-safe string (from the hash) back into a usable AES-GCM CryptoKey.
   */
  async importKey(base64Key) {
    // Restore base64 padding and characters
    let base64 = base64Key.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return await window.crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts a chunk of ArrayBuffer data using AES-GCM.
   * Prepends the 12-byte IV to the returned buffer so the receiver can decrypt it.
   */
  async encryptChunk(chunkBuffer, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      chunkBuffer
    );

    // Combine IV (12 bytes) + Encrypted Content
    const encryptedPayload = new Uint8Array(12 + encryptedContent.byteLength);
    encryptedPayload.set(iv, 0);
    encryptedPayload.set(new Uint8Array(encryptedContent), 12);

    return encryptedPayload.buffer;
  }

  /**
   * Decrypts an incoming ArrayBuffer chunk.
   * Extracts the 12-byte IV from the front of the payload.
   */
  async decryptChunk(encryptedPayloadBuffer, key) {
    const encryptedPayload = new Uint8Array(encryptedPayloadBuffer);
    const iv = encryptedPayload.slice(0, 12);
    const data = encryptedPayload.slice(12);

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    return decryptedContent;
  }
}

export const cryptoService = new CryptoService();
