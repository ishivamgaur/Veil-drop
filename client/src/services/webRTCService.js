import { socketService } from './socketService';
import { cryptoService } from './cryptoService';

/**
 * WebRTC P2P Transfer Engine
 * Handles STUN/TURN negotiation, data channel creation, and file chunking arrays.
 */
class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.dataChannel = null;
    this.targetPeerId = null;
    this.cryptoKey = null; // AES-GCM key for Veil Privacy Layer
    this.fileBuffer = [];
    this.receivedBytes = 0;
    this.expectedSize = 0;
    this.currentFileName = '';
    this.iceCandidateQueue = [];

    // Standard public Google STUN servers for NAT traversal
    this.rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
  }

  // Sender starts the process by initiating a connection and offering
  async initiateConnection(targetPeerId, file, cryptoKey = null) {
    this.targetPeerId = targetPeerId;
    this.cryptoKey = cryptoKey;
    this.createPeerConnection();

    // Create the P2P data channel BEFORE creating the offer
    this.dataChannel = this.peerConnection.createDataChannel('fileTransfer', {
      ordered: true
    });

    this.setupDataChannel(this.dataChannel);

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      const fileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        encrypted: !!cryptoKey
      };

      // Send the offer and file metadata via WebSocket Relay
      socketService.emitSignalOffer(targetPeerId, offer, fileMetadata);
      console.log('📡 [WebRTC] Sent Offer to peer:', targetPeerId, cryptoKey ? '(E2EE Enabled)' : '');
    } catch (err) {
      console.error('❌ [WebRTC] Failed to create offer:', err);
    }
  }

  // Receiver gets the offer, creates an answer, and sets up to receive data channel
  async handleReceiveOffer(senderId, offer, fileMetadata, cryptoKey = null) {
    this.targetPeerId = senderId;
    this.cryptoKey = cryptoKey;
    this.expectedSize = fileMetadata.size;
    this.currentFileName = fileMetadata.name;
    this.createPeerConnection();

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel(this.dataChannel);
    };

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Apply any ICE candidates that arrived early
      this.processIceCandidateQueue();

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      socketService.emitSignalAnswer(senderId, answer);
      console.log('📡 [WebRTC] Sent Answer back to peer:', senderId);
    } catch (err) {
      console.error('❌ [WebRTC] Failed to handle offer/answer:', err);
    }
  }

  // Sender handles the receiver's answer
  async handleReceiveAnswer(answer) {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('📡 [WebRTC] Remote Answer accepted. Tunnel established.');
        
        // Apply any ICE candidates that arrived early
        this.processIceCandidateQueue();
      }
    } catch (err) {
      console.error('❌ [WebRTC] Failed to set remote description from answer:', err);
    }
  }

  handleReceiveIceCandidate(candidate) {
    if (this.peerConnection && this.peerConnection.remoteDescription) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error('❌ [WebRTC] Error adding ICE candidate:', e));
    } else {
      // Buffer the candidate if we aren't ready for it yet
      this.iceCandidateQueue.push(candidate);
    }
  }

  processIceCandidateQueue() {
    while (this.iceCandidateQueue.length > 0) {
      const candidate = this.iceCandidateQueue.shift();
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error('❌ [WebRTC] Error adding buffered ICE candidate:', e));
    }
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emitSignalIceCandidate(this.targetPeerId, event.candidate);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log('🔌 [WebRTC] Connection State:', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === 'disconnected' || this.peerConnection.connectionState === 'failed') {
        this.reset();
      }
    };
  }

  setupDataChannel(channel) {
    channel.binaryType = 'arraybuffer';
    
    channel.onopen = () => {
      console.log('🟢 [WebRTC DataChannel] Open & Ready for high-speed transfer!');
      // Dispatch custom event to UI that channel is ready
      window.dispatchEvent(new CustomEvent('webrtc:channel_ready'));
    };

    channel.onclose = () => {
      console.log('🔴 [WebRTC DataChannel] Closed.');
    };

    channel.onmessage = async (event) => {
      if (!this.transferStartTime) this.transferStartTime = performance.now();

      if (typeof event.data === 'string') {
        if (event.data === 'EOF') {
          // File transmission complete! Assemble the buffer and trigger download.
          this.assembleAndDownloadFile();
        }
      } else {
        if (this.transferFailed) return; // Drop chunks if transfer already failed

        // Binary chunk arrived
        let chunkData = event.data;
        
        // Veil Privacy Layer: Decrypt AES-GCM chunk if key is present
        if (this.cryptoKey) {
          try {
            if (this.fileBuffer.length === 0 && !this.receivedBytes) {
              const encryptedHex = Array.from(new Uint8Array(chunkData).slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
              console.log('%c--- 🔐 VEIL PRIVACY LAYER: DECRYPTION PROOF ---', 'color: #34d399; font-weight: bold');
              console.log(`%c[Receiver] AES-GCM Ciphertext : ${encryptedHex}`, 'color: #ef4444');
              
              chunkData = await cryptoService.decryptChunk(chunkData, this.cryptoKey);
              
              const decryptedHex = Array.from(new Uint8Array(chunkData).slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
              console.log(`%c[Receiver] Raw decrypted bytes: ${decryptedHex}`, 'color: #888b94');
              console.log('%c------------------------------------------------', 'color: #34d399');
            } else {
              chunkData = await cryptoService.decryptChunk(chunkData, this.cryptoKey);
            }
          } catch (e) {
            console.error(`❌ [WebRTC] Failed to decrypt chunk of size ${chunkData.byteLength} bytes! Incorrect Key or Corrupted Data?`, e);
            this.transferFailed = true;
            window.dispatchEvent(new CustomEvent('webrtc:transfer_error', { detail: 'Decryption failed. Incorrect or expired security key.' }));
            return;
          }
        }

        if (this.fileWritableStream) {
          // Stream directly to the hard drive!
          await this.fileWritableStream.write(chunkData);
        } else {
          // Fallback to RAM buffer
          this.fileBuffer.push(chunkData);
        }
        
        // We calculate received bytes based on the ORIGINAL chunk data (decrypted length)
        this.receivedBytes += chunkData.byteLength;
        
        // Calculate progress percentage and speed
        const progress = Math.min(100, Math.round((this.receivedBytes / this.expectedSize) * 100));
        
        const elapsedSeconds = (performance.now() - this.transferStartTime) / 1000;
        let speedMBps = 0;
        if (elapsedSeconds > 0) {
          speedMBps = (this.receivedBytes / (1024 * 1024)) / elapsedSeconds;
        }

        window.dispatchEvent(new CustomEvent('webrtc:progress', { 
          detail: { 
            progress, 
            speed: speedMBps.toFixed(1) + ' MB/s' 
          } 
        }));
      }
    };
  }

  // Sender: Slices the file into 64KB ArrayBuffer chunks and blasts it through DataChannel
  async sendFile(file) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('DataChannel is not open yet!');
      return;
    }

    console.log(`🚀 [WebRTC] Starting transmission of ${file.name} (${file.size} bytes)`);
    // Lowered to 16KB to ensure encrypted payload (16KB + 28 bytes) easily fits within the 64KB max SCTP message limit!
    const chunkSize = 16 * 1024; 
    let offset = 0;
    this.transferStartTime = performance.now();

    const readSlice = (offset) => {
      return new Promise((resolve, reject) => {
        const slice = file.slice(offset, offset + chunkSize);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(slice);
      });
    };

    while (offset < file.size) {
      // Respect backpressure: if buffer is full, wait a bit
      if (this.dataChannel.bufferedAmount > this.dataChannel.bufferedAmountLowThreshold) {
        await new Promise(r => setTimeout(r, 10)); // tiny throttle
      }

      let chunk = await readSlice(offset);
      
      // Veil Privacy Layer: Encrypt chunk with AES-GCM before sending
      if (this.cryptoKey) {
        if (offset === 0) {
          console.log('%c--- 🔐 VEIL PRIVACY LAYER: ENCRYPTION PROOF ---', 'color: #34d399; font-weight: bold');
          const originalHex = Array.from(new Uint8Array(chunk).slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
          console.log(`%c[Sender] Raw bytes (first 16) : ${originalHex}`, 'color: #888b94');
          
          chunk = await cryptoService.encryptChunk(chunk, this.cryptoKey);
          
          const encryptedHex = Array.from(new Uint8Array(chunk).slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
          console.log(`%c[Sender] AES-GCM Ciphertext   : ${encryptedHex}`, 'color: #ef4444');
          console.log('%c------------------------------------------------', 'color: #34d399');
        } else {
          chunk = await cryptoService.encryptChunk(chunk, this.cryptoKey);
        }
      }

      this.dataChannel.send(chunk);
      // Advance offset by the ORIGINAL chunk size, not the encrypted payload size!
      offset += Math.min(chunkSize, file.size - offset);  

      const progress = Math.min(100, Math.round((offset / file.size) * 100));
      
      const elapsedSeconds = (performance.now() - this.transferStartTime) / 1000;
      let speedMBps = 0;
      if (elapsedSeconds > 0.1) { // small buffer to avoid infinity/jitter
        speedMBps = (offset / (1024 * 1024)) / elapsedSeconds;
      }

      window.dispatchEvent(new CustomEvent('webrtc:progress', { 
        detail: { 
          progress, 
          speed: speedMBps > 0 ? speedMBps.toFixed(1) + ' MB/s' : 'Calculating...' 
        } 
      }));
    }

    // Tell receiver we are done sending bytes
    this.dataChannel.send('EOF');
    console.log('🏁 [WebRTC] Transmission complete!');
    window.dispatchEvent(new CustomEvent('webrtc:transfer_complete'));
  }

  async assembleAndDownloadFile() {
    if (this.transferFailed) {
      console.warn('⚠️ [WebRTC] Aborting download assembly due to critical transfer/decryption failure.');
      this.reset();
      return;
    }

    if (this.fileWritableStream) {
      console.log('💾 [WebRTC] Closing File System Stream. File fully saved to disk!');
      await this.fileWritableStream.close();
    } else {
      const blob = new Blob(this.fileBuffer);
      const url = URL.createObjectURL(blob);
      
      // Auto-download the file in the receiver's browser
      const a = document.createElement('a');
      a.href = url;
      a.download = this.currentFileName || 'veildrop-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    window.dispatchEvent(new CustomEvent('webrtc:transfer_complete'));
    this.reset();
  }

  reset() {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.fileBuffer = [];
    this.receivedBytes = 0;
    this.expectedSize = 0;
    this.targetPeerId = null;
    this.transferFailed = false;
    this.fileWritableStream = null;
  }
}

export const webrtcService = new WebRTCService();
