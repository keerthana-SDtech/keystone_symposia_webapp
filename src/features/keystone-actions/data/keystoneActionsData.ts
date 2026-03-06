import type { ActionType } from '../types';
import type { SubmissionStatus } from '../../dashboard/types';

export const KEYSTONE_ACTIONS_CONTENT = {
  breadcrumb: {
    dashboard: "Dashboard",
  },
  notFound: {
    heading: "Submission not found",
    returnLink: "Return to Dashboard",
  },
  buttons: {
    viewActivityTimeline: "View Activity Timeline",
    actions: "Actions",
  },
  toast: {
    successSuffix: " successfully.",
  },
};

export const ACTION_ITEMS: { type: ActionType; label: string }[] = [
  { type: 'Shortlist', label: 'Shortlist' },
  { type: 'Bank',      label: 'Bank'      },
  { type: 'Reject',    label: 'Reject'    },
];

export const ACTION_TO_STATUS: Record<ActionType, SubmissionStatus> = {
  Shortlist: 'Shortlisted',
  Bank:      'Banked',
  Reject:    'Rejected',
};

export const SIDEBAR_SECTIONS = [
  "Concept Overview",
  "Organizer",
  "Conference Rationale",
];

export const SUBMISSION_CONTENT = {
  labels: {
    institute: "Institute",
    instituteDefault: "External Institution",
    organizerName: "Organizer Name",
    organizerEmail: "Organizer Email",
    instituteSectionLabel: "Institute",
    edit: "Edit",
  },
  sectionHeadings: {
    organizerDetails: "Organizer Details",
    conferenceRationale: "Conference Rationale",
    comments: "Comments",
  },
  rationaleQuestions: [
    "Why is it important for this conference/topic to be included in the portfolio?",
    "Why is this the right time to develop this conference/topic?",
    "What are the important concepts that will be included?",
    "Where do you recommend that the conference be held (country or continent)?",
    "What industry perspectives will be included in the conference (if relevant)?",
    "Are you aware of similar conferences on this topic?",
  ],
};

export const ACTIVITY_TIMELINE_CONTENT = {
  title: "Activity Timeline",
  doneButton: "Done",
  steps: [
    {
      id: "submitted",
      heading: "Concept Submitted",
      description: "Submitted via public portal by Dr. Rachel Kim. Concept entered Keystone system as KS-2026-041.",
    },
    {
      id: "screening",
      heading: "Screening",
      description: "Reviewed. Concept deemed scientifically relevant and aligned with Keystone mission.",
    },
  ],
};

export const STUDY_GROUP_BANNER_CONTENT = {
  triggerStatus: "Shortlisted",
  heading: "Study Group Review About to Begin",
  description: "Shortlisted concepts will move to the Study Group once the review window opens.",
  timer: {
    days: { label: "days",    initial: 2  },
    hours: { label: "hours",  initial: 13 },
    minutes: { label: "minutes", initial: 36 },
  },
};
