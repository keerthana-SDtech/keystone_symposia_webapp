import { httpClient } from '@/lib/httpClient';
import type { Stage } from './workflowData';

const BASE = '/config/stages';

export const workflowApi = {
  list: (): Promise<Stage[]> =>
    httpClient.get<Stage[]>(BASE).then(r => r.data),

  create: (data: Omit<Stage, 'id' | 'locked'>): Promise<Stage> =>
    httpClient.post<Stage>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<Omit<Stage, 'id'>>): Promise<Stage> =>
    httpClient.patch<Stage>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string): Promise<void> =>
    httpClient.delete(`${BASE}/${id}`).then(() => undefined),

  reorder: (ids: string[]): Promise<void> =>
    httpClient.patch(`${BASE}/reorder`, { ids }).then(() => undefined),
};
