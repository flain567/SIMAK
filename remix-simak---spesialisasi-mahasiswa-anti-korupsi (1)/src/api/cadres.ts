/**
 * cadres.ts — API adapter untuk Direktori Kader SIMAK
 */

import { apiFetch, IS_BACKEND_ENABLED } from './client';

export interface ApiCadreMember {
  id: string;
  cohort: string;
  name: string;
  nim: string;
  division: string;
  subDivision: string;
  status: string;
  avatarUrl?: string;
  joinedAt?: string;
}

export async function fetchCadreMembers(params?: {
  cohort?: string;
  division?: string;
  q?: string;
}): Promise<ApiCadreMember[]> {
  if (IS_BACKEND_ENABLED) {
    try {
      const sp = new URLSearchParams();
      if (params?.cohort) sp.set('cohort', params.cohort);
      if (params?.division && params.division !== 'all' && params.division !== 'Semua') sp.set('division', params.division);
      if (params?.q) sp.set('q', params.q);
      const query = sp.toString() ? `?${sp.toString()}` : '';
      const res = await apiFetch<{ members: ApiCadreMember[] }>(`/api/cadres${query}`);
      return res.members || [];
    } catch (err) {
      console.warn('Gagal memuat direktori kader dari API:', err);
      return [];
    }
  }
  return [];
}
