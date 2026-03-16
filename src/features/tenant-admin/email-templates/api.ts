import { httpClient } from '@/lib/httpClient';
import type { EmailTemplate } from './emailTemplatesData';

const BASE = '/config/notification-templates';

export const emailTemplatesApi = {
  list: () =>
    httpClient.get<EmailTemplate[]>(BASE).then(r => r.data),

  create: (data: Omit<EmailTemplate, 'id'>) =>
    httpClient.post<EmailTemplate>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<Omit<EmailTemplate, 'id'>>) =>
    httpClient.patch<EmailTemplate>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),
};

export interface EntityType {
  id: string;
  entityName: string;
  description?: string | null;
}

export const entityTypesApi = {
  list: () =>
    httpClient.get<EntityType[]>('/config/entity-types').then(r => r.data),
};
