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

        // Base styles for ID col
        const idHeaderStyle = {
            fill: { fgColor: { rgb: "1F2937" } }, // Dark gray
            font: { color: { rgb: "FFFFFF" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" }
        };
        const idSubHeaderStyle = {
            fill: { fgColor: { rgb: "F3F4F6" } }, // Light gray
            font: { color: { rgb: "111827" }, bold: true },
            alignment: { horizontal: "center", vertical: "center" }
        };

        const row1: any[] = [{ v: "System", t: "s", s: idHeaderStyle }];
        const row2: any[] = [{ v: "ID", t: "s", s: idSubHeaderStyle }];
        const merges: XLSX.Range[] = [];
        let currentColIndex = 1;
        let themeIndex = 0;

        config.forEach(section => {
            const theme = THEMES[themeIndex % THEMES.length];
            themeIndex++;

            const headerStyle = {
                fill: { fgColor: { rgb: theme.bg } },
                font: { color: { rgb: theme.fg }, bold: true },
                alignment: { horizontal: "center", vertical: "center" }
            };

            const subHeaderStyle = {
                fill: { fgColor: { rgb: theme.lightBg } },
                font: { color: { rgb: "111827" }, bold: true },
                alignment: { horizontal: "center", vertical: "center" }
            };

            if (section.fields && section.fields.length > 0) {
                const numFields = section.fields.length;
                row1[currentColIndex] = { v: section.sectionTitle, t: "s", s: headerStyle };

                if (numFields > 1) {
                    merges.push({
                        s: { r: 0, c: currentColIndex },
                        e: { r: 0, c: currentColIndex + numFields - 1 }
                    });
                }

                section.fields.forEach(field => {
                    row2[currentColIndex] = { v: field.label, t: "s", s: subHeaderStyle };
                    currentColIndex++;
                });
            }
            if (section.subsections && section.subsections.length > 0) {
                section.subsections.forEach(sub => {
                    if (sub.fields && sub.fields.length > 0) {
                        const numFields = sub.fields.length;
                        row1[currentColIndex] = { v: sub.sectionTitle, t: "s", s: headerStyle };

                        if (numFields > 1) {
                            merges.push({
                                s: { r: 0, c: currentColIndex },
                                e: { r: 0, c: currentColIndex + numFields - 1 }
                            });
                        }

                        sub.fields.forEach(field => {
                            row2[currentColIndex] = { v: field.label, t: "s", s: subHeaderStyle };
                            currentColIndex++;
                        });
                    }
                });
            }
        });

        for (let i = 0; i < row2.length; i++) {
            if (row1[i] === undefined) {
                // Determine a fallback style using the left neighbor's style so background merges cleanly
                let fallbackStyle = null;
                for (let j = i - 1; j >= 0; j--) {
                    if (row1[j] && row1[j].s) {
                        fallbackStyle = row1[j].s;
                        break;
                    }
                }
                row1[i] = { v: "", t: "s", s: fallbackStyle };
            }
        }

        const ws = XLSX.utils.aoa_to_sheet([row1, row2]);

        // Auto-fit columns based on subheader text length
        const colWidths = row2.map(cell => ({ wch: Math.max(15, (cell?.v?.length || 10) + 5) }));
        ws['!cols'] = colWidths;
        if (merges.length > 0) {
            ws['!merges'] = merges;
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");

        XLSX.writeFile(wb, "concept_submission_template.xlsx", { bookType: 'xlsx' });
    }
};
