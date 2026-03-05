import { httpClient } from "../../../lib/httpClient";

export const bulkSubmissionApi = {
    uploadConcept: async (file: File): Promise<{ created: number; failed: number; errors: { row: number; reason: string }[] }> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await httpClient.post('/keystone/concepts/bulk', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    downloadTemplate: async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(new URL('./xlsxWorker.ts', import.meta.url), { type: 'module' });

            worker.onmessage = (e) => {
                if (e.data.success) {
                    const blob = new Blob([e.data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'concept_submission_template.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    worker.terminate();
                    resolve();
                } else {
                    worker.terminate();
                    reject(new Error(e.data.error || 'Worker failed to generate Excel file'));
                }
            };

            worker.onerror = (err) => { worker.terminate(); reject(err); };
            worker.postMessage({});
        });
    }
};
