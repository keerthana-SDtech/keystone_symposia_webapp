import { useState, useEffect } from "react";
import { formBuilderApi } from "../../form-builder/api";
import type { FormDefinition } from "../../form-builder/types";

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
            } catch (err: any) {
                setError("Failed to load form configuration");
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const submitForm = async (data: any) => {
        setIsSubmitting(true);
        try {
            console.log("Submitting form data:", data);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSuccess(true);
            return true;
        } catch (err: any) {
            setError("Failed to submit form");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { definition, isLoading, isSubmitting, isSuccess, setIsSuccess, error, submitForm };
};
