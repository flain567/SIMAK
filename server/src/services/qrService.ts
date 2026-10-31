import crypto from 'crypto';

function getSecret(): string {
  const secret = process.env.QR_HMAC_SECRET;
  if (!secret) throw new Error('QR_HMAC_SECRET is not set');
  return secret;
}

/**
 * Generate HMAC-signed QR payload
 * Format: "GUEST-HRL-XXXX:hmacHex"
 */
export function generateQrPayload(ticketCode: string, nim: string): string {
  const secret = getSecret();
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${ticketCode}:${nim}`)
    .digest('hex');
  return `${ticketCode}:${hmac}`;
}

/**
 * Verify QR payload and extract ticket code
 * Returns ticketCode if valid, null if tampered
 */
export function verifyQrPayload(payload: string, nim: string): string | null {
  const parts = payload.split(':');
  if (parts.length !== 2) return null;
  
  const [ticketCode, providedHmac] = parts;
  const secret = getSecret();
  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(`${ticketCode}:${nim}`)
    .digest('hex');

  // Timing-safe comparison to prevent timing attacks
  const expectedBuf = Buffer.from(expectedHmac, 'hex');
  const providedBuf = Buffer.from(providedHmac, 'hex');
  
  if (expectedBuf.length !== providedBuf.length) return null;
  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) return null;
  
  return ticketCode;
}
