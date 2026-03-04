import { formBuilderApi } from '../../form-builder/api';
import type { SubmissionDetail } from '../types';

export const getSubmissionDetail = async (id: string): Promise<SubmissionDetail | null> => {
    // We fetch the form config to know what fields exist and populate realistic mock data
    const config = await formBuilderApi.getConferenceFormConfig();

    // Simulate finding a submission. We just randomly generate content for the requested ID.
    // In a real app, we would fetch from a database.
    const detail: SubmissionDetail = {
        id,
        displayId: `#KY-${id.replace('sub-', '').padStart(3, '0')}`,
        title: "CRISPR Beyond Gene Editing: Diagnostic and Therapeutic Applications",
        category: "Cancer Development",
        status: "New Submission",
        sections: {}
    };

    // Populate mock answers dynamically based on the form config structure
    config.forEach(section => {
        detail.sections[section.sectionTitle] = {};

        section.fields.forEach(field => {
            detail.sections[section.sectionTitle][field.name] = generateMockValueForField(field.name, field.type);
        });

        // Handle subsections (e.g., Organizer Details)
        if (section.subsections) {
            section.subsections.forEach(sub => {
                detail.sections[sub.sectionTitle] = {};
                sub.fields.forEach(field => {
                    detail.sections[sub.sectionTitle][field.name] = generateMockValueForField(field.name, field.type);
                });
            });
        }
    });

    return detail;
};

const generateMockValueForField = (fieldName: string, type: string) => {
    switch (fieldName) {
        case 'conferenceTitle':
            return "CRISPR Beyond Gene Editing: Diagnostic and Therapeutic Applications";
        case 'description':
            return "Expanding CRISPR technology applications beyond traditional gene editing, including CRISPR-based diagnostics (SHERLOCK, DETECTR), epigenetic editing, and next-generation therapeutic strategies.";
        case 'institute':
        case 'organizerInstitute':
            return "External Institution";
        case 'scientificCategory':
            return "Cancer Development";
        case 'firstName':
            return "John";
        case 'lastName':
            return "Smith";
        case 'organizerEmail':
            return "johnsmith23@gmail.com";
        case 'importanceInPortfolio':
            return "Climate change represents one of the most critical challenges facing humanity, and accurate weather prediction is fundamental to effective mitigation and adaptation strategies. This conference addresses the intersection of quantum computing and climate science, two frontier fields that have historically operated in isolation. By bringing together leading researchers from both domains, we create opportunities for breakthrough collaborations that could revolutionize our ability to model complex climate systems. The portfolio currently lacks representation in quantum applications for environmental science, making this conference essential for maintaining comprehensive coverage of emerging interdisciplinary research areas. Furthermore, this topic directly aligns with multiple UN Sustainable Development Goals and addresses urgent societal needs for improved disaster preparedness and agricultural planning capabilities.";
        default:
            if (type === 'textarea') return "This is a detailed response outlining the rationale, perspective, or concepts requested for this specific field. It is populated with mock data just to demonstrate the layout.";
            if (type === 'text') return "Mock Text Value";
            if (type === 'select') return "Mock Selection";
            return "N/A";
    }
};
