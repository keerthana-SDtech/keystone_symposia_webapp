import * as XLSX from "xlsx-js-style";

// ── Template field definitions ────────────────────────────────────────────────
// Each entry: [sectionTitle, humanLabel, fieldKey]
// Must match the backend parseXlsx expectation:
//   Row 0 = section titles  (col A ignored)
//   Row 1 = field labels    (col A ignored)
//   Row 2 = field keys      (col A ignored)
//   Row 3+ = data rows

const TEMPLATE_FIELDS: [string, string, string][] = [
    // ── Concept Overview ──────────────────────────────────────────────────────
    ['Concept Overview', 'Conference Title',           'conferenceTitle'],
    ['',                 'Description',                'description'],
    ['',                 'Institute',                  'institute'],
    ['',                 'Scientific Category',        'scientificCategory'],
    // ── Organizer Details ─────────────────────────────────────────────────────
    ['Organizer Details','First Name',                 'firstName'],
    ['',                 'Last Name',                  'lastName'],
    ['',                 'Organizer Email',            'organizerEmail'],
    ['',                 'Organizer Institute',        'organizerInstitute'],
    // ── Conference Rationale ──────────────────────────────────────────────────
    ['Conference Rationale', 'Why important for the portfolio?',            'importanceInPortfolio'],
    ['',                     'Why is this the right time to develop it?',   'rightTimeToDevelop'],
    ['',                     'What are the important concepts?',            'importantConcepts'],
    ['',                     'Recommended location',                        'recommendedLocation'],
    ['',                     'Industry perspectives (if relevant)',         'industryPerspectives'],
    ['',                     'Similar conferences',                         'similarConferences'],
];

// ── Realistic sample rows ─────────────────────────────────────────────────────
// Each array maps 1-to-1 with TEMPLATE_FIELDS above
const SAMPLE_ROWS: string[][] = [
    [
        'Advances in CAR-T Cell Therapy 2025',
        'A focused conference on next-generation chimeric antigen receptor T-cell therapies, covering clinical trials, manufacturing scalability, and solid tumour applications.',
        'IIT Madras',
        'Immunology',
        'Dr. Priya',
        'Ramachandran',
        'p.ramachandran@iitm.ac.in',
        'IIT Madras',
        'CAR-T therapy represents the fastest-growing segment of oncology. Portfolio coverage of cellular immunotherapies is currently limited and this conference would fill that gap with high-impact translational science.',
        'Several breakthrough approvals (axicabtagene, lisocabtagene) have occurred in the last 24 months, and regulatory frameworks are now mature enough for a dedicated international forum focused on next steps.',
        'Solid tumour targeting strategies, allogeneic CAR-T platforms, manufacturing cost reduction, toxicity management (CRS/ICANS), real-world outcomes data.',
        'Asia',
        'Major industry sponsors include Novartis, Gilead/Kite, and Bristol Myers Squibb, all of whom have expressed interest in satellite symposia and exhibition space.',
        'CAR-TCon (US, annual) focuses primarily on haematology; ASGCT annual meeting covers gene therapy broadly. Our conference differentiates by focusing exclusively on solid tumours and Asian regulatory pathways.',
    ],
    [
        'Structural Biology of RNA-Binding Proteins 2025',
        'Exploring cryo-EM and AlphaFold-driven insights into RNA-binding protein complexes, with emphasis on disease-relevant targets and therapeutic RNA delivery.',
        'Stanford',
        'Genetics, Genomics and RNA',
        'Prof. James',
        'O\'Sullivan',
        'j.osullivan@stanford.edu',
        'Stanford',
        'RNA-binding proteins (RBPs) are emerging as high-value drug targets for neurodegeneration and cancer, yet no dedicated structural biology conference covers this intersection. Filling this gap will attract a cross-disciplinary audience.',
        'AlphaFold3 and new cryo-EM detectors have made RBP complex structures tractable at scale for the first time. The field is at an inflection point where a community-building conference will have maximum impact.',
        'cryo-EM methods for RBP complexes, AlphaFold predictions vs. experimental validation, phase-separation and condensate biology, antisense oligonucleotide design, CLIP-seq advances.',
        'North America',
        'Pfizer and Alnylam have indicated interest in presenting RBP-targeted RNA therapeutic pipelines; collaboration with EMBL-EBI for data sessions is under discussion.',
        'RNA Society annual meeting covers RNA broadly; Keystone RNA symposia do not focus on structural aspects. This conference bridges structural biology and therapeutic chemistry, a currently unserved niche.',
    ],
    [
        'Microbiome–Immune Axis in Metabolic Disease 2025',
        'A translational conference examining how gut microbial composition shapes systemic inflammation, insulin resistance, and NAFLD progression, with sessions on FMT and next-generation probiotics.',
        'Anna University',
        'Microbiota and Flora',
        'Dr. Ananya',
        'Krishnaswamy',
        'a.krishnaswamy@annauniv.edu',
        'IIT Madras',
        'The microbiome-metabolism interface is one of the highest-cited areas in biology, yet conference coverage is fragmented across gastroenterology, endocrinology, and immunology meetings. A dedicated forum will unify these communities.',
        'Human Microbiome Project phase-2 datasets are now publicly available, enabling meta-analyses that were previously impossible. Industry investment in microbiome therapeutics has tripled in three years, signalling market readiness.',
        'Dysbiosis signatures in Type 2 diabetes and NAFLD, FMT clinical trial outcomes, short-chain fatty acid signalling, next-generation probiotic engineering, microbiome-responsive drug delivery.',
        'Asia',
        'Nestlé Health Science, Danone Nutricia Research, and Enterome have indicated interest in presenting longitudinal cohort data and therapeutic pipeline updates.',
        'DDW (annual, US) has a microbiome track but is dominated by endoscopy. Gut Microbiota for Health Summit is industry-heavy with limited basic science. Our format balances mechanistic science with clinical translation.',
    ],
];

// ── Colour themes per section ─────────────────────────────────────────────────
const THEMES = [
    { bg: '4B286D', fg: 'FFFFFF', lightBg: 'F0EAF5' }, // Purple — Concept Overview
    { bg: '1D6FA4', fg: 'FFFFFF', lightBg: 'EAF4FB' }, // Teal-blue — Organizer Details
    { bg: '1A7A4A', fg: 'FFFFFF', lightBg: 'E8F6EF' }, // Green — Conference Rationale
];

self.onmessage = () => {
    try {
        // ── Identify section spans ────────────────────────────────────────────
        type SectionSpan = { title: string; startCol: number; endCol: number; themeIdx: number };
        const spans: SectionSpan[] = [];
        let themeIdx = 0;

        for (let c = 0; c < TEMPLATE_FIELDS.length; c++) {
            const sectionTitle = TEMPLATE_FIELDS[c][0];
            if (sectionTitle !== '') {
                // Find how far this section stretches
                let end = c;
                while (end + 1 < TEMPLATE_FIELDS.length && TEMPLATE_FIELDS[end + 1][0] === '') end++;
                spans.push({ title: sectionTitle, startCol: c + 1, endCol: end + 1, themeIdx: themeIdx++ });
            }
        }

        // ── Style helpers ─────────────────────────────────────────────────────
        const cell = (v: string, s: object) => ({ v, t: 's', s });

        const emptyStyle = { font: { sz: 10 } };
        const idKeyStyle = emptyStyle;
        const dataStyle = {
            font: { sz: 10 },
            alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
            border: {
                bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
                right:  { style: 'thin', color: { rgb: 'E5E7EB' } },
            },
        };

        // ── Build rows ────────────────────────────────────────────────────────
        // Col A is always blank (parser does slice(1)); cols B onward = fields
        const row0: any[] = [cell('', emptyStyle)];   // section titles
        const row1: any[] = [cell('', emptyStyle)];   // human labels
        const row2: any[] = [cell('', idKeyStyle)];   // machine keys (hidden from user)

        const merges: XLSX.Range[] = [];

        // Fill section-title row and track merges
        for (const span of spans) {
            const theme = THEMES[span.themeIdx % THEMES.length];
            const sectionHeaderStyle = {
                fill: { fgColor: { rgb: theme.bg } },
                font: { color: { rgb: theme.fg }, bold: true, sz: 11 },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { bottom: { style: 'medium', color: { rgb: theme.fg } } },
            };
            const labelStyle = {
                fill: { fgColor: { rgb: theme.lightBg } },
                font: { color: { rgb: '111827' }, bold: true, sz: 10 },
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                border: { bottom: { style: 'thin', color: { rgb: theme.bg } } },
            };
            const keyStyle = {
                fill: { fgColor: { rgb: 'F9FAFB' } },
                font: { color: { rgb: '6B7280' }, italic: true, sz: 9 },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: { bottom: { style: 'thin', color: { rgb: 'E5E7EB' } } },
            };

            row0[span.startCol] = cell(span.title, sectionHeaderStyle);
            // Pad empty merged cells
            for (let c = span.startCol + 1; c <= span.endCol; c++) {
                row0[c] = cell('', sectionHeaderStyle);
            }
            if (span.endCol > span.startCol) {
                merges.push({ s: { r: 0, c: span.startCol }, e: { r: 0, c: span.endCol } });
            }

            // Fill label and key rows for this section's fields
            for (let c = span.startCol; c <= span.endCol; c++) {
                const [, label, key] = TEMPLATE_FIELDS[c - 1];
                row1[c] = cell(label, labelStyle);
                row2[c] = cell(key, keyStyle);
            }
        }

        // Sample data rows — col A blank
        const dataRows: any[][] = SAMPLE_ROWS.map((sampleValues, rowIdx) => {
            const bg = rowIdx % 2 === 0 ? 'FFFFFF' : 'F9FAFB';
            const rowDataStyle = { ...dataStyle, fill: { fgColor: { rgb: bg } } };
            const rowCells: any[] = [cell('', emptyStyle)];
            sampleValues.forEach(v => rowCells.push(cell(v, rowDataStyle)));
            return rowCells;
        });

        // ── Build sheet ───────────────────────────────────────────────────────
        const ws = XLSX.utils.aoa_to_sheet([row0, row1, row2, ...dataRows]);

        // Col A hidden (width 0); per-field widths for data columns
        ws['!cols'] = [
            { wch: 0, hidden: true },
            ...TEMPLATE_FIELDS.map(([, label, key]) => ({
                wch: Math.max(label.length, key.length, 22),
            })),
        ];

        // Row 2 (field keys) hidden — needed by backend parser but invisible to user
        ws['!rows'] = [
            { hpt: 28 },                    // row 0 section titles
            { hpt: 36 },                    // row 1 labels
            { hpt: 0, hidden: true },       // row 2 field keys — hidden
            { hpt: 80 },                    // sample rows
            { hpt: 80 },
            { hpt: 80 },
        ];

        ws['!merges'] = merges;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Concepts');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        self.postMessage({ success: true, data: excelBuffer });
    } catch (error: any) {
        self.postMessage({ success: false, error: error.message });
    }
};
