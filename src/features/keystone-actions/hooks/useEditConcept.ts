import { useState, useEffect } from 'react';
import { httpClient } from '../../../lib/httpClient';
import { formBuilderApi } from '../../form-builder/api';
import type { FormDefinition } from '../../form-builder/types';

interface ConceptDetailRaw {
    id: string;
    title?: string;
    formData?: { fieldKey: string; fieldValue?: string | null }[];
}

export function useEditConcept(id: string) {
    const [definition, setDefinition] = useState<FormDefinition | null>(null);
    const [initialValues, setInitialValues] = useState<Record<string, string> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [{ data: concept }, formDefinition] = await Promise.all([
                    httpClient.get<ConceptDetailRaw>(`/keystone/concepts/${id}`),
                    formBuilderApi.getConferenceFormConfig(),
                ]);

                const values: Record<string, string> = {};
                for (const f of concept.formData ?? []) {
                    if (f.fieldKey) values[f.fieldKey] = f.fieldValue ?? '';
                }

                setInitialValues(values);
                setDefinition(formDefinition);
            } catch {
                setError('Failed to load concept');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const saveForm = async (data: Record<string, unknown>) => {
        setIsSaving(true);
        setError(null);
        try {
            const title = String(data.conferenceTitle ?? 'Untitled');

            let categoryId: string | undefined;
            if (data.scientificCategory) {
                try {
                    const { data: cats } = await httpClient.get<{ id: string; name: string }[]>('/keystone/categories');
                    const match = (Array.isArray(cats) ? cats : []).find(
                        c => c.name === String(data.scientificCategory)
                    );
                    categoryId = match?.id;
                } catch { }
            }

            const formData = Object.entries(data).map(([fieldKey, fieldValue]) => ({
                fieldKey,
                fieldValue: fieldValue != null ? String(fieldValue) : undefined,
            }));
            await httpClient.patch(`/keystone/concepts/${id}`, { title, categoryId, formData });
            return true;
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? 'Failed to save concept';
            setError(message);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { definition, initialValues, isLoading, isSaving, error, saveForm };
}
