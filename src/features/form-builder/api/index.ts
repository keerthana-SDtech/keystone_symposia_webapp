import type { FormDefinition } from '../types';

export const formBuilderApi = {
    getConferenceFormConfig: async (): Promise<FormDefinition> => {
        return Promise.resolve({
            schema: {
                type: 'object',
                properties: {
                    // ── Section 1: Concept Overview ────────────────────────
                    conferenceTitle: { type: 'string', minLength: 5, maxLength: 100 },
                    description: { type: 'string', minLength: 10, maxLength: 500 },

                    // ── Section 2: Conference & Organizer Details ──────────
                    institute: {
                        type: 'string',
                        enum: ['IIT Madras', 'Anna University', 'MIT', 'Stanford'],
                    },
                    scientificCategory: {
                        type: 'string',
                        enum: [
                            'Artificial Intelligence',
                            'Biotechnology',
                            'Robotics',
                            'Data Science',
                            'Biochemistry',
                            'Structural and Cellular',
                            'Cancer Development',
                            'Reproductive and Regenerative Drug Discovery',
                            'Bioengineering and Digital',
                            'Genetics, Genomics and RNA',
                            'Immunology',
                            'Metabolism and Cardiovascular',
                            'Microbiota and Flora',
                            'Neurobiology',
                            'Technologies',
                            'Other',
                        ],
                    },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    organizerEmail: { type: 'string', format: 'email' },
                    organizerInstitute: {
                        type: 'string',
                        enum: ['IIT Madras', 'Anna University', 'MIT', 'Stanford'],
                    },

                    // ── Section 3: Conference Rationale ────────────────────
                    importanceInPortfolio: { type: 'string', minLength: 20, maxLength: 1000 },
                    rightTimeToDevelop: { type: 'string', minLength: 20, maxLength: 1000 },
                    importantConcepts: { type: 'string', minLength: 20, maxLength: 1000 },
                    recommendedLocation: {
                        type: 'string',
                        enum: [
                            'North America',
                            'South America',
                            'Europe',
                            'Asia',
                            'Africa',
                            'Australia',
                            'Antarctica',
                        ],
                    },
                    industryPerspectives: { type: 'string' },
                    similarConferences: { type: 'string', minLength: 30, maxLength: 1000 },
                },
                required: [
                    'conferenceTitle',
                    'description',
                    'institute',
                    'scientificCategory',
                    'importanceInPortfolio',
                    'rightTimeToDevelop',
                    'importantConcepts',
                    'recommendedLocation',
                ],
            },

            sections: [
                {
                    id: 'concept-overview',
                    label: 'Concept Overview',
                    uischema: {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                scope: '#/properties/conferenceTitle',
                                label: 'Conference Title',
                                options: { placeholder: 'Enter conference title' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/description',
                                label: 'Description',
                                options: { multi: true, placeholder: 'Enter description' },
                            },
                        ],
                    } as any,
                },
                {
                    id: 'conference-organizer-details',
                    label: 'Conference & Organizer Details',
                    uischema: {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                scope: '#/properties/institute',
                                label: 'Institute',
                                options: { placeholder: 'Select institute' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/scientificCategory',
                                label: 'Scientific Category',
                                options: { placeholder: 'Select category' },
                            },
                            {
                                type: 'Group',
                                label: 'Organizer Details',
                                elements: [
                                    {
                                        type: 'HorizontalLayout',
                                        elements: [
                                            {
                                                type: 'Control',
                                                scope: '#/properties/firstName',
                                                label: 'First Name',
                                                options: { placeholder: 'Enter first name' },
                                            },
                                            {
                                                type: 'Control',
                                                scope: '#/properties/lastName',
                                                label: 'Last Name',
                                                options: { placeholder: 'Enter last name' },
                                            },
                                        ],
                                    },
                                    {
                                        type: 'HorizontalLayout',
                                        elements: [
                                            {
                                                type: 'Control',
                                                scope: '#/properties/organizerEmail',
                                                label: 'Email',
                                                options: { placeholder: 'Enter email' },
                                            },
                                            {
                                                type: 'Control',
                                                scope: '#/properties/organizerInstitute',
                                                label: 'Institute',
                                                options: { placeholder: 'Select institute' },
                                            },
                                        ],
                                    },
                                ],
                            } as any,
                        ],
                    } as any,
                },
                {
                    id: 'conference-rationale',
                    label: 'Conference Rationale',
                    uischema: {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                scope: '#/properties/importanceInPortfolio',
                                label: 'Why is it important for this conference/topic to be included in the portfolio?',
                                options: { multi: true, placeholder: 'Enter' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/rightTimeToDevelop',
                                label: 'Why is this the right time to develop this conference/topic?',
                                options: { multi: true, placeholder: 'Enter' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/importantConcepts',
                                label: 'What are the important concepts that will be included?',
                                options: { multi: true, placeholder: 'Enter' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/recommendedLocation',
                                label: 'Where do you recommend that the conference be held (country or continent)?',
                                options: { placeholder: 'Select' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/industryPerspectives',
                                label: 'What industry perspectives will be included in the conference (if relevant)?',
                                options: { multi: true, placeholder: 'Enter' },
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/similarConferences',
                                label: 'Are you aware of similar conferences on this topic? If so, please list relevant conferences, including their typical timing and location (if known), and explain how the proposed conference would be differentiated.',
                                options: { multi: true, placeholder: 'Enter' },
                            },
                        ],
                    } as any,
                },
            ],
        });
    },
};
