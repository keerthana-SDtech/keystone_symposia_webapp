import { useState, useEffect } from "react";
import { formBuilderApi } from "../../form-builder/api";
import type { FormDefinition } from "../../form-builder/types";
import { httpClient } from "../../../lib/httpClient";

interface CreatedConcept {
    id: string;
}

export const useFormSubmission = () => {
    const [definition, setDefinition] = useState<FormDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await formBuilderApi.getConferenceFormConfig();
                setDefinition(data);
            } catch {
                setError("Failed to load form configuration");
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const submitForm = async (data: Record<string, unknown>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Use conferenceTitle as the concept's top-level title
            const title = String(data.conferenceTitle ?? 'Untitled Concept');

            // Look up the category UUID by name from the backend
            let categoryId: string | undefined;
            if (data.scientificCategory) {
                try {
                    const { data: cats } = await httpClient.get<{ id: string; name: string }[]>('/keystone/categories');
                    const match = (Array.isArray(cats) ? cats : []).find(
                        c => c.name === String(data.scientificCategory)
                    );
                    categoryId = match?.id;
                } catch {
                    // leave categoryId undefined if lookup fails
                }
            }

            // Map every form field to the backend's { fieldKey, fieldValue } format
            const formData = Object.entries(data).map(([fieldKey, fieldValue]) => ({
                fieldKey,
                fieldValue: fieldValue != null ? String(fieldValue) : undefined,
            }));

            // Step 1 — create the concept draft
            const { data: concept } = await httpClient.post<CreatedConcept>(
                '/keystone/concepts',
                { title, categoryId, formData },
            );

            // Step 2 — submit for review
            await httpClient.post(`/keystone/concepts/${concept.id}/submit`);

            setIsSuccess(true);
            return true;
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? (err instanceof Error ? err.message : null)
                ?? 'Failed to submit form';
            setError(message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { definition, isLoading, isSubmitting, isSuccess, setIsSuccess, error, submitForm };
};
