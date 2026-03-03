export type SubmissionStatus =
    | 'New Submission'
    | 'Shortlisted'
    | 'Banked'
    | 'Rejected'
    | 'Study Group Review'
    | 'SAB Board Meeting'
    | 'Proposal Inprogress'
    | 'Ready for SAB Review'
    | 'SAB Proposal In Review'
    | 'Final Revision'
    | 'Proposal Finalized';

export interface DashboardMetric {
    id: string;
    title: string;
    value: number;
    type: 'new' | 'approved' | 'submitted' | 'updates';
    statuses: SubmissionStatus[];
}

export interface SubmissionSummary {
    id: string;
    title: string;
    submitter: string;
    category: string;
    date: string;
    status: SubmissionStatus;
}
