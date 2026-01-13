import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  encode,
  decode,
  createBlob,
  LiveSession,
} from '../geminiService';

describe('Audio Encoding Utilities', () => {
  describe('encode()', () => {
    it('should encode Uint8Array to base64 string', () => {
      // "Hello" in bytes
      const input = new Uint8Array([72, 101, 108, 108, 111]);
      const result = encode(input);
      expect(result).toBe('SGVsbG8=');
    });

    it('should handle empty array', () => {
      const input = new Uint8Array([]);
      const result = encode(input);
      expect(result).toBe('');
    });

    it('should handle single byte', () => {
      const input = new Uint8Array([65]); // 'A'
      const result = encode(input);
      expect(result).toBe('QQ==');
    });

    it('should encode binary data correctly', () => {
      const input = new Uint8Array([0, 255, 128, 64, 32]);
      const result = encode(input);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('decode()', () => {
    it('should decode base64 string to Uint8Array', () => {
      const result = decode('SGVsbG8=');
      expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]);
    });

    it('should handle empty string', () => {
      const result = decode('');
      expect(result.length).toBe(0);
    });

    it('should decode single character', () => {
      const result = decode('QQ=='); // 'A'
      expect(Array.from(result)).toEqual([65]);
    });

    it('should be reversible with encode', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5, 100, 200, 255]);
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(Array.from(decoded)).toEqual(Array.from(original));
    });

    it('should handle longer data', () => {
      const original = new Uint8Array(1000);
      for (let i = 0; i < 1000; i++) {
        original[i] = i % 256;
      }
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(Array.from(decoded)).toEqual(Array.from(original));
    });
  });

  describe('createBlob()', () => {
    it('should convert Float32Array to PCM blob format', () => {
      const input = new Float32Array([0.5, -0.5, 1.0]);
      const result = createBlob(input);

      expect(result.mimeType).toBe('audio/pcm;rate=16000');
      expect(typeof result.data).toBe('string');
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should handle empty array', () => {
      const input = new Float32Array([]);
      const result = createBlob(input);

      expect(result.mimeType).toBe('audio/pcm;rate=16000');
      expect(result.data).toBe('');
    });

    it('should convert normalized audio values correctly', () => {
      // Test with common audio values
      const input = new Float32Array([0, 0.5, -0.5, 1.0, -1.0]);
      const result = createBlob(input);

      expect(result.mimeType).toBe('audio/pcm;rate=16000');
      expect(typeof result.data).toBe('string');
    });

    it('should produce decodeable output', () => {
      const input = new Float32Array([0.25, -0.25]);
      const result = createBlob(input);

      // Should be valid base64
      expect(() => decode(result.data)).not.toThrow();
    });
  });
});

describe('LiveSession', () => {
  let session: LiveSession;

  beforeEach(() => {
    session = new LiveSession();
  });

  it('should create a new instance', () => {
    expect(session).toBeInstanceOf(LiveSession);
  });

  it('should have undefined onStatusChange callback initially', () => {
    expect(session.onStatusChange).toBeUndefined();
  });

  it('should allow setting onStatusChange callback', () => {
    const mockCallback = vi.fn();
    session.onStatusChange = mockCallback;
    expect(session.onStatusChange).toBe(mockCallback);
  });

  describe('connect()', () => {
    it('should call onStatusChange with "connecting" status when connect is called', () => {
      const mockCallback = vi.fn();
      session.onStatusChange = mockCallback;

      // Start the connection but don't await - it will fail but we can test the initial status
      session.connect().catch(() => {
        // Expected to fail in test environment due to network
      });

      // The "connecting" status should be set synchronously at the start
      expect(mockCallback).toHaveBeenCalledWith('connecting');
    });
  });

  describe('disconnect()', () => {
    it('should call onStatusChange with "disconnected" status', async () => {
      const mockCallback = vi.fn();
      session.onStatusChange = mockCallback;

      await session.disconnect();

      expect(mockCallback).toHaveBeenCalledWith('disconnected');
    });

    it('should be safe to call multiple times', async () => {
      const mockCallback = vi.fn();
      session.onStatusChange = mockCallback;

      await session.disconnect();
      await session.disconnect();

      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Encode/Decode Integration', () => {
  it('should correctly round-trip text data', () => {
    const text = 'Hello, World! 123 @#$%';
    const bytes = new TextEncoder().encode(text);
    const encoded = encode(bytes);
    const decoded = decode(encoded);
    const result = new TextDecoder().decode(decoded);

    expect(result).toBe(text);
  });

  it('should handle unicode text', () => {
    const text = '你好世界 🌍';
    const bytes = new TextEncoder().encode(text);
    const encoded = encode(bytes);
    const decoded = decode(encoded);
    const result = new TextDecoder().decode(decoded);

    expect(result).toBe(text);
  });
});
