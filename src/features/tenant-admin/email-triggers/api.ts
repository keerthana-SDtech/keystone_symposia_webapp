import { httpClient } from '@/lib/httpClient';
import type { EmailTrigger } from './emailTriggersData';

interface EmailTriggerResponse {
  id:              string;
  name:            string;
  description?:    string | null;
  emailTemplateId?: string | null;
  sendTo:          string[];
  fromStage?:      string | null;
  toStage?:        string | null;
  action?:         string | null;
  isActive:        boolean;
}

// Map backend → frontend; emailTemplate display name is resolved by the caller
function toTrigger(t: EmailTriggerResponse, templateSubject?: string): EmailTrigger {
  return {
    id:             t.id,
    name:           t.name,
    description:    t.description ?? "",
    emailTemplate:  templateSubject ?? "",
    emailTemplateId: t.emailTemplateId ?? null,
    sendTo:         t.sendTo ?? [],
    fromStage:      t.fromStage ?? "",
    toStage:        t.toStage ?? "",
    action:         t.action ?? "",
    enabled:        t.isActive,
  };
}

function toPayload(data: Omit<EmailTrigger, 'id'>) {
  return {
    name:            data.name,
    description:     data.description || null,
    emailTemplateId: data.emailTemplateId || null,
    sendTo:          data.sendTo,
    fromStage:       data.fromStage || null,
    toStage:         data.toStage || null,
    action:          data.action || null,
    isActive:        data.enabled,
  };
}

const BASE = '/config/email-triggers';

export const emailTriggersApi = {
  list: () =>
    httpClient.get<EmailTriggerResponse[]>(BASE).then(r => r.data.map(t => toTrigger(t))),

  create: (data: Omit<EmailTrigger, 'id'>) =>
    httpClient.post<EmailTriggerResponse>(BASE, toPayload(data)).then(r => toTrigger(r.data, data.emailTemplate)),

  update: (id: string, data: Omit<EmailTrigger, 'id'>) =>
    httpClient.patch<EmailTriggerResponse>(`${BASE}/${id}`, toPayload(data)).then(r => toTrigger(r.data, data.emailTemplate)),

  toggle: (id: string, enabled: boolean) =>
    httpClient.patch<EmailTriggerResponse>(`${BASE}/${id}`, { isActive: enabled }).then(r => toTrigger(r.data)),

  remove: (id: string) =>
    httpClient.delete(`${BASE}/${id}`),
};
