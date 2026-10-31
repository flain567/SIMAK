/**
 * gallery.ts — API adapter untuk Galeri Kegiatan SIMAK
 */

import { apiFetch, IS_BACKEND_ENABLED } from './client';

export interface ApiGalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  participantsCount: number;
  imageUrl?: string;
  description?: string;
  featured?: boolean;
}

export async function fetchGalleryItems(category?: string): Promise<ApiGalleryItem[]> {
  if (IS_BACKEND_ENABLED) {
    try {
      const query = category && category !== 'all' && category !== 'Semua' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await apiFetch<{ items: ApiGalleryItem[] }>(`/api/gallery${query}`);
      return res.items || [];
    } catch (err) {
      console.warn('Gagal memuat galeri dari API:', err);
      return [];
    }
  }
  return [];
}
