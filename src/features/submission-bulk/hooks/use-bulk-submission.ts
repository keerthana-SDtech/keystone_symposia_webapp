import { useState } from "react";
import { bulkSubmissionApi } from "../api";
import type { BulkUploadState } from "../types";

export function useBulkSubmission() {
    const [state, setState] = useState<BulkUploadState>({
        file: null,
        isUploading: false,
        error: null,
        success: false,
        isDownloadingTemplate: false,
        isSubmittingBulk: false,
        bulkSuccess: false,
    });

    const uploadFile = async (file: File) => {
        if (!file.name.toLowerCase().endsWith('.xlsx') && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setState((prev) => ({ ...prev, error: "Only Excel (.xlsx) files are allowed" }));
            return;
        }

        setState((prev) => ({ ...prev, isUploading: true, error: null, file }));
        try {
            await bulkSubmissionApi.uploadConcept(file);
            setState((prev) => ({ ...prev, isUploading: false, success: true }));
        } catch (error) {
            setState((prev) => ({ ...prev, isUploading: false, error: "Upload failed" }));
        }
    };

    const handleDownloadTemplate = async () => {
        setState((prev) => ({ ...prev, isDownloadingTemplate: true, error: null }));
        try {
            await bulkSubmissionApi.downloadTemplate();
        } catch (error) {
            setState((prev) => ({ ...prev, error: "Failed to download template" }));
        } finally {
            setState((prev) => ({ ...prev, isDownloadingTemplate: false }));
        }
    };

    const submitBulk = async () => {
        if (!state.file || !state.success) {
            setState((prev) => ({ ...prev, error: "Please upload a valid Excel (.xlsx) file before submitting." }));
            return false;
        }

        setState((prev) => ({ ...prev, isSubmittingBulk: true, error: null }));
        try {
            // Mock API submission logic
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setState((prev) => ({ ...prev, bulkSuccess: true }));
            return true;
        } catch (error) {
            setState((prev) => ({ ...prev, error: "Submission failed" }));
            return false;
        } finally {
            setState((prev) => ({ ...prev, isSubmittingBulk: false }));
        }
    };

    return {
        ...state,
        setFile: (file: File | null) => setState((prev) => ({ ...prev, file })),
        uploadFile,
        handleDownloadTemplate,
        submitBulk,
    };
}
