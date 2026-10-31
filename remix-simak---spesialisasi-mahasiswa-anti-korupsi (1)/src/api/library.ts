/**
 * library.ts — API adapter untuk E-Library & Naskah Advokasi
 */

import { LibraryDocument, AdvocacySubmission } from '../types';
import { apiFetch, IS_BACKEND_ENABLED } from './client';
import { LIBRARY_DOCUMENTS, INITIAL_ADVOCACY_SUBMISSIONS } from '../data/mockData';

// ─── Helpers localStorage ─────────────────────────────────────

function loadLocalSubmissions(): AdvocacySubmission[] {
  try {
    const raw = localStorage.getItem('simak_submissions_v1');
    return raw ? JSON.parse(raw) : INITIAL_ADVOCACY_SUBMISSIONS;
  } catch {
    return INITIAL_ADVOCACY_SUBMISSIONS;
  }
}

function saveLocalSubmissions(list: AdvocacySubmission[]): void {
  try {
    localStorage.setItem('simak_submissions_v1', JSON.stringify(list));
  } catch { /* ignore */ }
}

// ─── Types ────────────────────────────────────────────────────

export interface SubmitAdvocacyPayload {
  title: string;
  authorName: string;
  nim: string;
  category: AdvocacySubmission['category'];
  linkUrl?: string;
  abstract: string;
  readTime?: string;
}

// ─── API Functions ─────────────────────────────────────────────

/**
 * Ambil semua dokumen library.
 * Backend → GET /api/library/documents
 * Fallback → mockData statis
 */
export async function getLibraryDocuments(
  category?: string,
  q?: string
): Promise<LibraryDocument[]> {
  if (IS_BACKEND_ENABLED) {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.set('category', category);
    if (q) params.set('q', q);
    const data = await apiFetch<{ documents: LibraryDocument[] }>(
      `/api/library/documents?${params.toString()}`
    );
    return data.documents;
  }

  // Fallback: mockData
  let docs = [...LIBRARY_DOCUMENTS];
  if (category && category !== 'Semua') {
    docs = docs.filter(d => d.category === category);
  }
  if (q) {
    const lower = q.toLowerCase();
    docs = docs.filter(d => d.title.toLowerCase().includes(lower));
  }
  return docs;
}

/**
 * Submit naskah advokasi baru.
 * Backend → POST /api/library/submissions
 * Fallback → localStorage
 */
export async function submitAdvocacy(
  payload: SubmitAdvocacyPayload
): Promise<{ id: string; status: string; message: string }> {
  if (IS_BACKEND_ENABLED) {
    return apiFetch<{ id: string; status: string; message: string }>(
      '/api/library/submissions',
      { method: 'POST', body: JSON.stringify(payload) }
    );
  }

  // Fallback localStorage
  const existing = loadLocalSubmissions();
  const newSub: AdvocacySubmission = {
    id: `local-adv-${Date.now()}`,
    title: payload.title,
    authorName: payload.authorName,
    nim: payload.nim,
    category: payload.category,
    submittedAt: new Date().toISOString(),
    abstract: payload.abstract,
    status: 'Dalam Kurasi',
    readTime: payload.readTime || '5 menit baca',
  };

  saveLocalSubmissions([newSub, ...existing]);
  return {
    id: newSub.id,
    status: 'Dalam Kurasi',
    message: 'Naskah berhasil dikirim dan sedang dalam kurasi Tim Redaksi SIMAK.',
  };
}

/**
 * Ambil semua naskah yang sudah diterbitkan.
 * Backend → GET /api/library/submissions
 * Fallback → localStorage filter Diterbitkan
 */
export async function getPublishedSubmissions(): Promise<AdvocacySubmission[]> {
  if (IS_BACKEND_ENABLED) {
    const data = await apiFetch<{ submissions: AdvocacySubmission[] }>(
      '/api/library/submissions'
    );
    return data.submissions;
  }

  return loadLocalSubmissions().filter(s => s.status === 'Diterbitkan');
}

/**
 * Load semua submissions local (untuk initial state component)
 */
export function getAllSubmissionsLocal(): AdvocacySubmission[] {
  return loadLocalSubmissions();
}
