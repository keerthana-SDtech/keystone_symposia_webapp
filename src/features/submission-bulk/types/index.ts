export interface BulkResult {
    created: number;
    failed: number;
    errors: { row: number; reason: string }[];
}

export interface BulkUploadState {
    file: File | null;
    isUploading: boolean;
    error: string | null;
    success: boolean;
    isDownloadingTemplate: boolean;
    isSubmittingBulk: boolean;
    bulkSuccess: boolean;
    bulkResult: BulkResult | null;
}
