import { httpClient } from '@/lib/httpClient';
import type { Status } from './statusData';

interface ApiStatus {
  id: string;
  name: string;
  color: string;
  description: string | null;
  assignedStages: string[];
  enabled: boolean;
  displayOrder: number;
}

function toStatus(s: ApiStatus): Status {
  return {
    id: s.id,
    color: s.color,
    name: s.name,
    description: s.description ?? '',
    assignedStages: s.assignedStages ?? [],
    enabled: s.enabled,
  };
}

const BASE = '/config/statuses';

export const statusApi = {
  list: () =>
    httpClient.get<ApiStatus[]>(BASE).then(r => r.data.map(toStatus)),

  create: (data: Omit<Status, 'id'>) =>
    httpClient.post<ApiStatus>(BASE, data).then(r => toStatus(r.data)),

  update: (id: string, data: Partial<Omit<Status, 'id'>>) =>
    httpClient.patch<ApiStatus>(`${BASE}/${id}`, data).then(r => toStatus(r.data)),

  toggle: (id: string, enabled: boolean) =>
    httpClient.patch<ApiStatus>(`${BASE}/${id}`, { enabled }).then(r => toStatus(r.data)),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),
};
