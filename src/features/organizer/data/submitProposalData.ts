export const PROPOSAL_STEPS = [
  { "id": "overview", "label": "Overview" },
  { "id": "keynote-address", "label": "Keynote Address" },
  { "id": "plenary-session", "label": "Plenary Session" }
];

export const SUBMIT_PROPOSAL_PAGE_CONTENT = {
  "pageTitle": "Submit Proposal",
  "pageSubtitle": "Provide review about the proposed concept. All fields marked with * are required.",
  "buttons": {
    "downloadGuidelines": "Download Guidelines",
    "saveAsDraft": "Save as Draft",
    "back": "Back",
    "next": "Next",
    "submit": "Submit Proposal"
  }
};

export const OVERVIEW_STEP_CONTENT = {
  "title": "Overview",
  "fields": {
    "meetingTitle": {
      "label": "Meeting Title",
      "placeholder": "Enter conference title"
    },
    "organizerDetails": {
      "sectionTitle": "Organizer Details",
      "namePlaceholder": "Enter name",
      "institutePlaceholder": "Enter institute",
      "nameLabel": "Name",
      "instituteLabel": "Institute",
      "addButton": "+ Add Organiser"
    }
  }
};

export const KEYNOTE_STEP_CONTENT = {
  "title": "Keynote Address",
  "fields": {
    "keynoteTitle": {
      "label": "Keynote Title",
      "placeholder": "Enter keynote session title"
    },
    "keynoteSpeakerName": {
      "label": "Speaker Name",
      "placeholder": "Enter speaker name"
    },
    "keynoteSpeakerInstitute": {
      "label": "Speaker Institute",
      "placeholder": "Enter speaker institute"
    },
    "keynoteSpeakerBio": {
      "label": "Speaker Bio",
      "placeholder": "Enter brief speaker bio (optional)"
    }
  }
};

export const PLENARY_STEP_CONTENT = {
  "title": "Plenary Session",
  "fields": {
    "plenarySessionTitle": {
      "label": "Session Title",
      "placeholder": "Enter plenary session title"
    },
    "plenaryTopics": {
      "label": "Topics Covered",
      "placeholder": "Describe the key topics to be covered"
    },
    "expectedAttendees": {
      "label": "Expected Attendees",
      "placeholder": "Estimated number of attendees (optional)"
    }
  }
};
