/**
 * API Client — config & shared fetch helper
 * Semua request ke backend melewati sini.
 * Jika VITE_API_URL tidak di-set, fallback ke localStorage mock.
 */

export const API_BASE = import.meta.env.VITE_API_URL || '';
export const IS_BACKEND_ENABLED = Boolean(import.meta.env.VITE_API_URL);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = null; }
    const message =
      (body as { error?: string })?.error ||
      `HTTP ${res.status}: ${res.statusText}`;
    throw new ApiError(res.status, message, body);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(res.status, 'Endpoint API tidak mengembalikan respon JSON valid');
  }

  return res.json() as Promise<T>;
}
