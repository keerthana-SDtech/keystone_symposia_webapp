export interface BulkUploadState {
    file: File | null;
    isUploading: boolean;
    error: string | null;
    success: boolean;
    isDownloadingTemplate: boolean;
    isSubmittingBulk: boolean;
    bulkSuccess: boolean;
}
