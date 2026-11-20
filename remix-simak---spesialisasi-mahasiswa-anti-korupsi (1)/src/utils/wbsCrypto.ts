/**
 * wbsCrypto.ts — Enkripsi AES-256-GCM sungguhan untuk laporan WBS (mode offline).
 * Kunci diturunkan dari kode lacak (PBKDF2-SHA256), sehingga isi laporan
 * hanya dapat dibuka oleh pemegang kode lacak yang sah.
 */

const PBKDF2_ITERATIONS = 210_000;

export interface WbsSecretPayload {
  summary: string;
  evidenceUrl?: string;
  reporterIdentity?: string;
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Kode lacak 48-bit acak dari CSPRNG: WBS-YYYY-XXXXXXXXXXXX */
export function generateTrackingCode(): string {
  const year = new Date().getFullYear();
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `WBS-${year}-${hex}`;
}

async function deriveKey(code: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptWbsPayload(
  code: string,
  payload: WbsSecretPayload
): Promise<{ encryptedPayload: string; cryptoSalt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(code, salt);
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  const packed = new Uint8Array(iv.length + cipher.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(cipher), iv.length);
  return { encryptedPayload: toBase64(packed), cryptoSalt: toBase64(salt) };
}

export async function decryptWbsPayload(
  code: string,
  encryptedPayload: string,
  cryptoSalt: string
): Promise<WbsSecretPayload | null> {
  try {
    const packed = fromBase64(encryptedPayload);
    const iv = packed.slice(0, 12);
    const cipher = packed.slice(12);
    const key = await deriveKey(code, fromBase64(cryptoSalt));
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    return JSON.parse(new TextDecoder().decode(plain)) as WbsSecretPayload;
  } catch {
    return null;
  }
}

/** Kode laporan terenkripsi disensor di log publik; kode demo lama tetap tampil penuh. */
export function maskTrackingCode(code: string): string {
  const parts = code.split('-');
  const secret = parts[2] || '';
  if (secret.length <= 4) return code;
  return `${parts[0]}-${parts[1]}-${'•'.repeat(secret.length - 2)}${secret.slice(-2)}`;
}