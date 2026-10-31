import crypto from 'crypto';
import { prisma } from '../lib/prisma';

const TICKET_PREFIX = 'GUEST-HRL';
const SEAT_PREFIX = 'TAMU';

/**
 * Generate unique ticket code format: GUEST-HRL-XXXX
 * Retries up to 5 times if there's a collision
 */
export async function generateTicketCode(maxRetries = 5): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const code = `${TICKET_PREFIX}-${suffix}`;
    const existing = await prisma.participant.findUnique({ where: { ticketCode: code } });
    if (!existing) return code;
  }
  // Fallback with timestamp for guaranteed uniqueness
  return `${TICKET_PREFIX}-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Generate seat number format: TAMU-XX (sequential)
 */
export async function generateSeatNumber(): Promise<string> {
  const count = await prisma.participant.count();
  const number = String(count + 1).padStart(2, '0');
  return `${SEAT_PREFIX}-${number}`;
}

/**
 * Generate exam number format: KPS-2026-XXXX
 */
export function generateExamNumber(): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `KPS-${year}-${suffix}`;
}
