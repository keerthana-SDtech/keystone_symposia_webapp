import { httpClient } from '../../../lib/httpClient';
import { formBuilderApi } from '../../form-builder/api';
import type { SubmissionDetail } from '../types';
import type { SubmissionStatus } from '../../dashboard/types';

interface ConceptDetailResponse {
    id: string;
    uniqueRef?: string;
    title?: string;
    stage?: string;
    categoryId?: string;
    submitterId?: string;
    createdAt?: string;
    submittedAt?: string;
    formData?: Array<{ fieldKey: string; fieldValue?: string | null }>;
    suggestedOrganizers?: unknown[];
    contributors?: unknown[];
}

function mapStage(stage: string | undefined): SubmissionStatus {
    switch (stage) {
        case 'draft':              return 'New Submission';
        case 'submitted':          return 'New Submission';
        case 'shortlisted':        return 'Shortlisted';
        case 'banked':             return 'Banked';
        case 'rejected':           return 'Rejected';
        case 'organizer_assigned': return 'Proposal Inprogress';
        case 'proposal_submitted': return 'SAB Proposal In Review';
        case 'finalized':          return 'Proposal Finalized';
        default:                   return 'New Submission';
    }
}

export async function submitConcept(id: string): Promise<void> {
    await httpClient.post(`/keystone/concepts/${id}/submit`, {});
}

export async function shortlistConcept(id: string, notes: string): Promise<void> {
    await httpClient.post(`/keystone/concepts/${id}/shortlist`, { notes });
}

export async function bankConcept(id: string, notes: string): Promise<void> {
    await httpClient.post(`/keystone/concepts/${id}/bank`, { notes });
}

export async function rejectConcept(id: string, notes: string): Promise<void> {
    await httpClient.post(`/keystone/concepts/${id}/reject`, { notes });
}

export async function getConceptDetail(id: string): Promise<SubmissionDetail | null> {
    try {
        const [{ data: concept }, config] = await Promise.all([
            httpClient.get<ConceptDetailResponse>(`/keystone/concepts/${id}`),
            formBuilderApi.getConferenceFormConfig(),
        ]);

        // Build fieldKey → fieldValue lookup from the EAV formData
        const fieldValues: Record<string, string> = {};
        for (const item of concept.formData ?? []) {
            fieldValues[item.fieldKey] = item.fieldValue ?? '';
        }

        // Reconstruct section → fields map from form config
        const sections: SubmissionDetail['sections'] = {};
        for (const section of config) {
            sections[section.sectionTitle] = {};
            for (const field of section.fields) {
                sections[section.sectionTitle][field.name] = fieldValues[field.name] ?? '';
            }
            if (section.subsections) {
                for (const sub of section.subsections) {
                    sections[sub.sectionTitle] = {};
                    for (const field of sub.fields) {
                        sections[sub.sectionTitle][field.name] = fieldValues[field.name] ?? '';
                    }
                }
            }
        }

        return {
            id: concept.id,
            displayId: concept.uniqueRef ? `#${concept.uniqueRef}` : `#KY-${id.slice(0, 6).toUpperCase()}`,
            title: concept.title ?? 'Untitled',
            category: fieldValues['scientificCategory'] ?? concept.categoryId ?? '',
            status: mapStage(concept.stage),
            sections,
        };
    } catch {
        return null;
    }
}
