import * as XLSX from "xlsx-js-style";
import { formBuilderApi } from "../../form-builder/api";

const THEMES = [
    { bg: "4B286D", fg: "FFFFFF", lightBg: "F0EAF5" }, // Purple
    { bg: "56B47C", fg: "FFFFFF", lightBg: "EAF6EE" }, // Green
    { bg: "2563EB", fg: "FFFFFF", lightBg: "EFF6FF" }, // Blue
    { bg: "D97706", fg: "FFFFFF", lightBg: "FFFBEB" }, // Amber
    { bg: "BE185D", fg: "FFFFFF", lightBg: "FDF2F8" }, // Pink
];

export const bulkSubmissionApi = {
    uploadConcept: async (_file: File): Promise<boolean> => {
        // Mock upload logic
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    },
    downloadTemplate: async (): Promise<void> => {
        const config = await formBuilderApi.getConferenceFormConfig();

        return new Promise((resolve, reject) => {
            // Initiate Web Worker specifically to handle heavy Excel execution away from main UI "message" handlers
            const worker = new Worker(new URL('./xlsxWorker.ts', import.meta.url), {
                type: 'module'
            });

            worker.onmessage = (e) => {
                if (e.data.success) {
                    const blob = new Blob([e.data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "concept_submission_template.xlsx";
                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    worker.terminate();
                    resolve();
                } else {
                    worker.terminate();
                    reject(new Error(e.data.error || "Worker failed to generate Excel file"));
                }
            };

            worker.onerror = (err) => {
                worker.terminate();
                reject(err);
            };

            // Command the worker to process the config off the main thread
            worker.postMessage({ config });
        });
    }
};
