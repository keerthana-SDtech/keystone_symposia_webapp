import { formBuilderApi } from '../../form-builder/api';
import type { SubmissionSummary, DashboardMetric, SubmissionStatus, SortOption, FilterParams } from '../types';

// Helper to extract options from formBuilderApi
const getCategories = async (): Promise<string[]> => {
    const config = await formBuilderApi.getConferenceFormConfig();
    const conferenceDetailsSection = config.find(s => s.sectionTitle === "Conference & Organizer Details");
    const categoryField = conferenceDetailsSection?.fields?.find(f => f.name === "scientificCategory");

    if (categoryField && categoryField.options) {
        return categoryField.options.map(opt => opt.label);
    }
    return ["Immunology", "Micro Biology", "Genetics"]; // Fallback
};

export const getDashboardData = async (role: string, sort?: SortOption, filter?: FilterParams) => {
    const categories = await getCategories();

    // Generate fixed data for dashboard mapping to provided mockups
    const generateFixedSubmissions = (): SubmissionSummary[] => {
        const subs: SubmissionSummary[] = [];
        let idCounter = 1;

        // Distribution matching screenshots (200 total ideas, numbers based on metric cards)
        // New Concepts (12)
        for (let i = 0; i < 12; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: i % 2 === 0 ? "Stromal Immunology" : "Microbiome and Human Health",
                submitter: "John Doe",
                category: categories[i % categories.length],
                date: "Jan 4, 2026",
                status: 'New Submission'
            });
        }

        // SAB Board Meeting (43)
        for (let i = 0; i < 43; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: i % 2 === 0 ? "Stromal Immunology" : "Microbiome and Human Health",
                submitter: "John Doe",
                category: categories[i % categories.length],
                date: "Jan 4, 2026",
                status: 'SAB Board Meeting'
            });
        }

        // Proposal Submitted (10) - Split between Inprogress/In Review based on visual reference
        for (let i = 0; i < 5; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: "Stromal Immunology",
                submitter: "John Doe",
                category: categories[0],
                date: "Jan 4, 2026",
                status: 'Proposal Inprogress'
            });
        }
        for (let i = 0; i < 5; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: "Microbiome and Human Health",
                submitter: "John Doe",
                category: categories[1] || categories[0],
                date: "Jan 4, 2026",
                status: 'SAB Proposal In Review'
            });
        }

        // Revision Required / Proposal Updates (46) - Split
        for (let i = 0; i < 23; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: "Stromal Immunology",
                submitter: "John Doe",
                category: categories[i % categories.length],
                date: "Jan 4, 2026",
                status: 'Final Revision'
            });
        }
        for (let i = 0; i < 23; i++) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: "Microbiome and Human Health",
                submitter: "John Doe",
                category: categories[i % categories.length],
                date: "Jan 4, 2026",
                status: 'Proposal Inprogress'
            });
        }

        // Add some random others to fill the rest of the 200 list roughly
        const remainingStatuses: SubmissionStatus[] = [
            'Shortlisted', 'Banked', 'Rejected', 'Study Group Review',
            'Ready for SAB Review', 'Proposal Finalized'
        ];

        while (idCounter <= 200) {
            subs.push({
                id: `sub-${idCounter++}`,
                title: idCounter % 2 === 0 ? "Stromal Immunology" : "Microbiome and Human Health",
                submitter: "John Doe",
                category: categories[idCounter % categories.length],
                date: "Jan 4, 2026",
                status: remainingStatuses[idCounter % remainingStatuses.length]
            });
        }

        return subs;
    };

    let submissions = generateFixedSubmissions();

    if (role === 'external_scientist') {
        // External scientist doesn't have a dashboard according to latest requirement, 
        // but if they hit the API, return empty data or filtered data
        return { metrics: [], submissions: [] };
    }

    // DB-side filter
    if (filter?.statuses?.length) {
        submissions = submissions.filter(s => filter.statuses!.includes(s.status));
    }
    if (filter?.dateFrom || filter?.dateTo) {
        submissions = submissions.filter(s => {
            const d = new Date(s.date).getTime();
            if (filter.dateFrom && d < new Date(filter.dateFrom).getTime()) return false;
            if (filter.dateTo && d > new Date(filter.dateTo).getTime()) return false;
            return true;
        });
    }

    // DB-side sort
    if (sort === 'az') submissions.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'za') submissions.sort((a, b) => b.title.localeCompare(a.title));
    else if (sort === 'newest') submissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sort === 'oldest') submissions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Generate accurate metrics
    const metrics: DashboardMetric[] = [
        {
            id: 'm1',
            title: 'New Concepts',
            value: submissions.filter(s => s.status === 'New Submission').length,
            type: 'new',
            statuses: ['New Submission']
        },
        {
            id: 'm2',
            title: 'SAB Board Meeting',
            value: submissions.filter(s => s.status === 'SAB Board Meeting').length,
            type: 'approved',
            statuses: ['SAB Board Meeting']
        },
        {
            id: 'm3',
            title: 'Proposal Submitted',
            value: submissions.filter(s => s.status === 'SAB Proposal In Review' || s.status === 'Proposal Inprogress').length,
            type: 'submitted',
            statuses: ['SAB Proposal In Review', 'Proposal Inprogress']
        },
        {
            id: 'm4',
            title: 'Proposal Updates',
            value: submissions.filter(s => ['Proposal Inprogress', 'Final Revision'].includes(s.status)).length,
            type: 'updates',
            statuses: ['Proposal Inprogress', 'Final Revision']
        }
    ];

    return { metrics, submissions };
};
