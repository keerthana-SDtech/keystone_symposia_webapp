import { httpClient } from '@/lib/httpClient';
import type { Stage, StatusActionItem } from './workflowData';

export interface ApiStage {
  id: string;
  name: string;
  description: string;
  roles: string[];
  locked: boolean;
  whoCanAdvance: string[];
  stageOrder: string;
  fromStage: string;
  toStage: string;
  statusActions: StatusActionItem[];
  allowedActions: string[];
  startDate?: string | null;
  endDate?: string | null;
}

const BASE = '/config/stages';

export const workflowApi = {
  list: () =>
    httpClient.get<ApiStage[]>(BASE).then(r => r.data),

  getById: (id: string) =>
    httpClient.get<ApiStage>(`${BASE}/${id}`).then(r => r.data),

  create: (data: Omit<Stage, 'id' | 'locked'> & { locked?: boolean }) =>
    httpClient.post<ApiStage>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<Omit<Stage, 'id'>>) =>
    httpClient.patch<ApiStage>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),

  reorder: (ids: string[]) =>
    httpClient.patch(`${BASE}/reorder`, { ids }),
};
