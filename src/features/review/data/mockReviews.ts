import type { CompletedReviewType } from "../types/review.types";

export const MOCK_REVIEWS: CompletedReviewType[] = [
  {
    id: "r-001",
    reviewerName: "Anonymous Reviewer",
    relevance: "Highly Relevant",
    scientificQuality: "Strong methodology and innovation. The proposed speakers are top-tier.",
    comments: "This is a promising concept with strong potential. I particularly like the focus on micro-mobility. The integration of cross-disciplinary fields offers a unique perspective that is often missing from typical symposia. I believe this will attract a diverse and highly engaged audience from across the globe, facilitating ground-breaking discussions and future collaborations. Furthermore, the timing is exceptionally appropriate given recent technological advancements in the field."
  },
  {
    id: "r-002",
    reviewerName: "Anonymous Reviewer",
    relevance: "Relevant",
    scientificQuality: "Good methodology, but could benefit from more diverse speaker representation. Some proposed sessions overlap.",
    comments: "The core idea is solid and builds upon previously successful meetings. However, considering the rapid pace of development in this area, the organizers should ensure they are capturing the absolute latest pre-publication data. I would strongly recommend adjusting the session topics slightly to allow for more late-breaking abstract presentations, specifically focusing on translational applications which currently seem underrepresented in the preliminary program outline."
  },
  {
    id: "r-003",
    reviewerName: "Anonymous Reviewer",
    relevance: "Highly Relevant",
    scientificQuality: "Exceptional scientific rigor. The proposal outlines a clear and compelling narrative.",
    comments: "I fully support this proposal moving forward without any major modifications. The organizers have done a fantastic job of gathering the key opinion leaders and structuring the sessions logically. This is exactly the kind of forward-looking, high-impact conference that Keystone Symposia is known for. It will undoubtedly be well-attended and highly productive."
  },
  {
    id: "r-004",
    reviewerName: "Anonymous Reviewer",
    relevance: "Moderately Relevant",
    scientificQuality: "Acceptable quality, though some of the proposed discussion points are slightly outdated.",
    comments: "While the overall topic is acceptable, I feel the angle being taken is somewhat traditional. It would be significantly improved by incorporating newer, disruptive technologies that have recently emerged. If the organizers are willing to pivot slightly to include these newer paradigms, the conference will be much more impactful. Without this adjustment, it runs the risk of simply reiterating what is already well-known in the literature."
  }
];
