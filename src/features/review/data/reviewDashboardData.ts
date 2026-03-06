export const REVIEW_DASHBOARD_CONTENT = {
  pageTitle: "Concepts",
  searchPlaceholder: "Search",
  banner: {
    heading: "Begin Your Review",
    description: "Submit your evaluations before the deadline to ensure your feedback is considered.",
    timer: {
      days:    { label: "days",    initial: 2  },
      hours:   { label: "hours",   initial: 13 },
      minutes: { label: "minutes", initial: 36 },
    },
  },
};

export const REVIEW_DASHBOARD_COLUMNS = [
  { key: 'title',     label: 'Title',     width: 'w-[35%]' },
  { key: 'submitter', label: 'Submitter', width: 'w-[15%]' },
  { key: 'category',  label: 'Category',  width: 'w-[20%]' },
  { key: 'date',      label: 'Date',      width: 'w-[15%]' },
  { key: 'status',    label: 'Status',    width: 'w-[15%]' },
];

export const REVIEW_FILTER_OPTIONS = [
  { value: 'All',            label: 'All Statuses'    },
  { value: 'Yet to Review',  label: 'Yet to Review'   },
  { value: 'Reviewed',       label: 'Reviewed'        },
];

export const REVIEW_SORT_OPTIONS = [
  { value: 'date-desc',  label: 'Sort by Date (Newest)' },
  { value: 'date-asc',   label: 'Sort by Date (Oldest)' },
  { value: 'title-asc',  label: 'Sort by Title (A-Z)'   },
];
