import { httpClient } from '@/lib/httpClient';
import type { EmailTrigger } from './emailTriggersData';

interface NotificationTemplate {
  id: string;
  eventKey: string;
  subject: string;
  bodyTemplate: string;
  isActive: boolean;
  sendTo: string[];
  entityTypeId?: string | null;
}

function toTrigger(t: NotificationTemplate): EmailTrigger {
  return {
    id: t.id,
    name: t.eventKey,
    description: t.bodyTemplate,
    emailTemplate: t.subject,
    sendTo: t.sendTo ?? [],
    enabled: t.isActive,
  };
}

function toTemplate(data: Omit<EmailTrigger, 'id'>) {
  return {
    eventKey: data.name,
    bodyTemplate: data.description,
    subject: data.emailTemplate,
    isActive: data.enabled,
    sendTo: data.sendTo,
  };
}

const BASE = '/config/notification-templates';

export const emailTriggersApi = {
  list: () =>
    httpClient.get<NotificationTemplate[]>(BASE).then(r => r.data.map(toTrigger)),

  create: (data: Omit<EmailTrigger, 'id'>) =>
    httpClient.post<NotificationTemplate>(BASE, toTemplate(data)).then(r => toTrigger(r.data)),

  update: (id: string, data: Omit<EmailTrigger, 'id'>) =>
    httpClient.patch<NotificationTemplate>(`${BASE}/${id}`, toTemplate(data)).then(r => toTrigger(r.data)),

  toggle: (id: string, enabled: boolean) =>
    httpClient.patch<NotificationTemplate>(`${BASE}/${id}`, { isActive: enabled }).then(r => toTrigger(r.data)),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),
};
