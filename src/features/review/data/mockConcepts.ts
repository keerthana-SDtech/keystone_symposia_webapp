import type { ConceptReviewType, RationaleQuestion } from "../types/review.types";

const defaultQuestions: RationaleQuestion[] = [
  {
    q: "Why is it important for this conference/topic to be included in the portfolio?",
    a: "This provides a critical update on rapidly evolving fields and bridges gaps between distinct disciplines that are increasingly intersecting in modern research."
  },
  { q: "Why is this the right time to develop this conference/topic?", a: "Recent technological breakthroughs have made this area ripe for collaborative exploration." },
  { q: "What are the important concepts that will be included?", a: "Core mechanisms, novel therapeutic approaches, and cross-disciplinary applications." },
  { q: "Where do you recommend that the conference be held (country or continent)?", a: "North America or Europe, given the concentration of research hubs." }
];

export const MOCK_CONCEPTS: ConceptReviewType[] = [
  { 
    id: "c-001", 
    title: "Stromal Immunology", 
    submitter: "John Doe", 
    category: "Immunology", 
    date: "Jan 4, 2026", 
    status: "Yet to Review",
    description: "Exploring the dynamic role of stromal cells in shaping immune responses, tissue residency, and chronic inflammation.",
    institute: "University of Oxford",
    organizerName: "John Doe",
    organizerEmail: "j.doe@oxford.ac.uk",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-002", 
    title: "Microbiome and Human Health", 
    submitter: "Jane Smith", 
    category: "Micro Biology", 
    date: "Jan 5, 2026", 
    status: "Yet to Review",
    description: "Investigating the complex interactions between the human microbiome and host physiology in health and disease states.",
    institute: "Stanford University",
    organizerName: "Jane Smith",
    organizerEmail: "jsmith@stanford.edu",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-003", 
    title: "Cancer Development Pathways", 
    submitter: "Alan Turing", 
    category: "Cancer Development", 
    date: "Jan 6, 2026", 
    status: "Reviewed",
    description: "Detailed analysis of aberrant signaling pathways driving oncogenesis and tumor progression across various cancer types.",
    institute: "Cambridge Institute",
    organizerName: "Alan Turing",
    organizerEmail: "at@cambridge.ac.uk",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-004", 
    title: "Data Science in Biology", 
    submitter: "Ada Lovelace", 
    category: "Data Science", 
    date: "Jan 7, 2026", 
    status: "Reviewed",
    description: "Leveraging computational algorithms, machine learning, and big data to unravel complex biological systems.",
    institute: "MIT",
    organizerName: "Ada Lovelace",
    organizerEmail: "ada@mit.edu",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-005", 
    title: "Stem Cell Research Frontiers", 
    submitter: "Marie Curie", 
    category: "Biotechnology", 
    date: "Jan 8, 2026", 
    status: "Yet to Review",
    description: "Recent advances in stem cell biology, regenerative medicine, and the ethical implications of emerging somatic therapies.",
    institute: "Curie Institute",
    organizerName: "Marie Curie",
    organizerEmail: "m.curie@institute.fr",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-006", 
    title: "Advancements in Neurobiology", 
    submitter: "Santiago Ramón", 
    category: "Neurobiology", 
    date: "Jan 9, 2026", 
    status: "Yet to Review",
    description: "Mapping neural circuits, understanding synaptic plasticity, and exploring the molecular basis of neurodegenerative diseases.",
    institute: "Cajal Institute",
    organizerName: "Santiago Ramón",
    organizerEmail: "s.ramon@cajal.es",
    rationaleQuestions: defaultQuestions
  },
  { 
    id: "c-007", 
    title: "CRISPR Beyond Gene Editing: Diagnostic and Therapeutic Applications", 
    submitter: "John Smith", 
    category: "Cancer Development", 
    date: "Oct 24, 2024", 
    status: "Yet to Review",
    description: "Expanding CRISPR technology applications beyond traditional gene editing, including CRISPR-based diagnostics (SHERLOCK, DETECTR), epigenetic editing, and next-generation therapeutic strategies.",
    institute: "External Institution",
    organizerName: "John Smith",
    organizerEmail: "johnsmith23@gmail.com",
    rationaleQuestions: [
      {
        q: "Why is it important for this conference/topic to be included in the portfolio?",
        a: "Climate change represents one of the most critical challenges facing humanity, and accurate weather prediction is fundamental to effective mitigation and adaptation strategies. This conference addresses the intersection of quantum computing and climate science, two frontier fields that have historically operated in isolation. By bringing together leading researchers from both domains, we create opportunities for breakthrough collaborations that could revolutionize our ability to model complex climate systems. The portfolio currently lacks representation in quantum applications for environmental science, making this conference essential for maintaining comprehensive coverage of emerging interdisciplinary research areas. Furthermore, this topic directly aligns with multiple UN Sustainable Development Goals and addresses urgent societal needs for improved disaster preparedness and agricultural planning capabilities."
      },
      { q: "Why is this the right time to develop this conference/topic?", a: "Details for this question." },
      { q: "What are the important concepts that will be included?", a: "Details for this question." },
      { q: "Where do you recommend that the conference be held (country or continent)?", a: "Details for this question." }
    ],
    generalComments: ""
  },
  // Ensure the list maintains enough items to test pagination/scrolling if needed,
  // spreading default questions and mock descriptions across generic items to save lines.
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `c-00${i + 8}`,
    title: "Genetics and RNA Sequencing",
    submitter: "Rosalind Franklin",
    category: "Genetics, Genomics",
    date: "Jan 10, 2026",
    status: "Yet to Review" as const,
    description: "Investigating transcriptomic profiles and the role of non-coding RNAs in gene regulation.",
    institute: "King's College London",
    organizerName: "Rosalind Franklin",
    organizerEmail: "r.franklin@kcl.ac.uk",
    rationaleQuestions: defaultQuestions
  }))
];
