import type { FormConfig } from "../types";

export const formBuilderApi = {
    getConferenceFormConfig: async (): Promise<FormConfig> => {
        return Promise.resolve([
            {
                sectionTitle: "Concept Overview",
                fields: [
                    {
                        name: "conferenceTitle",
                        label: "Conference Title question",
                        type: "text",
                        placeholder: "Enter conference title",
                        validation: {
                            minLength: 5,
                            maxLength: 100,
                            required: true,
                        },
                        required: true,
                        layout: "full",
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        placeholder: "Enter description",
                        validation: {
                            minLength: 10,
                            maxLength: 500,
                            required: true,
                        },
                        required: true,
                        layout: "full",
                    },
                ],
            },
            {
                sectionTitle: "Conference & Organizer Details",
                fields: [
                    {
                        name: "institute",
                        label: "Institute",
                        type: "select",
                        placeholder: "Select institute",
                        required: true,
                        options: [
                            { id: 1, label: "IIT Madras" },
                            { id: 2, label: "Anna University" },
                            { id: 3, label: "MIT" },
                            { id: 4, label: "Stanford" },
                        ],
                        layout: "full",
                    },
                    {
                        name: "scientificCategory",
                        label: "Scientific Category",
                        type: "select",
                        placeholder: "Select category",
                        required: true,
                        options: [
                            { id: 1, label: "Artificial Intelligence" },
                            { id: 2, label: "Biotechnology" },
                            { id: 3, label: "Robotics" },
                            { id: 4, label: "Data Science" },
                            { id: 5, label: "Biochemistry" },
                            { id: 6, label: "Structural and Cellular" },
                            { id: 7, label: "Cancer Development" },
                            { id: 8, label: "Reproductive and Regenerative Drug Discovery" },
                            { id: 9, label: "Bioengineering and Digital" },
                            { id: 10, label: "Genetics, Genomics and RNA" },
                            { id: 11, label: "Immunology" },
                            { id: 12, label: "Metabolism and Cardiovascular" },
                            { id: 13, label: "Microbiota and Flora" },
                            { id: 14, label: "Neurobiology" },
                            { id: 15, label: "Technologies" },
                            { id: 16, label: "Other" },
                        ],
                        layout: "full",
                    },
                ],
                subsections: [
                    {
                        sectionTitle: "Organizer Details",
                        fields: [
                            {
                                name: "firstName",
                                label: "First Name",
                                type: "text",
                                placeholder: "Enter first name",
                                required: false,
                                layout: "half",
                            },
                            {
                                name: "lastName",
                                label: "Last Name",
                                type: "text",
                                placeholder: "Enter last name",
                                required: false,
                                layout: "half",
                            },
                            {
                                name: "organizerEmail",
                                label: "Email",
                                type: "text",
                                placeholder: "Enter email",
                                required: false,
                                format: "email",
                                layout: "half",
                            },
                            {
                                name: "organizerInstitute",
                                label: "Institute",
                                type: "select",
                                placeholder: "Select institute",
                                required: false,
                                options: [
                                    { id: 1, label: "IIT Madras" },
                                    { id: 2, label: "Anna University" },
                                    { id: 3, label: "MIT" },
                                    { id: 4, label: "Stanford" },
                                ],
                                layout: "half",
                            },
                        ],
                    },
                ],
            },
            {
                sectionTitle: "Conference Rationale",
                fields: [
                    {
                        name: "importanceInPortfolio",
                        label:
                            "Why is it important for this conference/topic to be included in the portfolio?",
                        type: "textarea",
                        placeholder: "Enter",
                        validation: {
                            required: true,
                            minLength: 20,
                            maxLength: 1000,
                        },
                    },
                    {
                        name: "rightTimeToDevelop",
                        label:
                            "Why is this the right time to develop this conference/topic?",
                        type: "textarea",
                        placeholder: "Enter",
                        validation: {
                            required: true,
                            minLength: 20,
                            maxLength: 1000,
                        },
                    },
                    {
                        name: "importantConcepts",
                        label:
                            "What are the important concepts that will be included?",
                        type: "textarea",
                        placeholder: "Enter",
                        validation: {
                            required: true,
                            minLength: 20,
                            maxLength: 1000,
                        },
                    },
                    {
                        name: "recommendedLocation",
                        label:
                            "Where do you recommend that the conference be held (country or continent)?",
                        type: "select",
                        placeholder: "Select",
                        validation: {
                            required: true,
                        },
                        options: [
                            { id: 1, label: "North America" },
                            { id: 2, label: "South America" },
                            { id: 3, label: "Europe" },
                            { id: 4, label: "Asia" },
                            { id: 5, label: "Africa" },
                            { id: 6, label: "Australia" },
                            { id: 7, label: "Antarctica" },
                        ],
                    },
                    {
                        name: "industryPerspectives",
                        label:
                            "What industry perspectives will be included in the conference (if relevant)?",
                        type: "textarea",
                        placeholder: "Enter",
                        validation: {
                            required: false,
                        },
                    },
                    {
                        name: "similarConferences",
                        label:
                            "Are you aware of similar conferences on this topic? If so, please list relevant conferences, including their typical timing and location (if known), and explain how the proposed conference would be differentiated.",
                        type: "textarea",
                        placeholder: "Enter",
                        validation: {
                            required: false,
                            minLength: 30,
                            maxLength: 1000,
                        },
                    },
                ],
            },
        ]);
    },
};
