import type { SubmissionStatus } from '../../dashboard/types';

export interface SubmissionDetail {
    id: string;
    displayId: string; // e.g. #KY-001
    title: string;
    category: string;
    status: SubmissionStatus;
    // Maps a section title to its fields (field name -> value)
    sections: {
        [sectionTitle: string]: {
            [fieldName: string]: string;
        }
    };
}

export type ActionType = 'Shortlist' | 'Bank' | 'Reject';
