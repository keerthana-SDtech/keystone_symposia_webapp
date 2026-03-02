export interface RationaleQuestion {
  q: string;
  a: string;
}

export interface ConceptReviewType {
  id: string;
  title: string;
  submitter: string;
  category: string;
  date: string;
  status: 'Yet to Review' | 'Reviewed';
  description?: string;
  institute?: string;
  organizerName?: string;
  organizerEmail?: string;
  rationaleQuestions?: RationaleQuestion[];
  generalComments?: string;
}
