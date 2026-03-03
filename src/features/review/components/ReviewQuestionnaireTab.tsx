import { MOCK_REVIEWS } from "../data/mockReviews";
import { ReviewItem } from "../../../components/ui/review-item";

interface ReviewQuestionnaireTabProps {
  conceptId?: string;
}

export function ReviewQuestionnaireTab(_props: ReviewQuestionnaireTabProps) {
  // In a real app, we would fetch reviews specifically for `conceptId`.
  // Here we use mock data.
  const reviews = MOCK_REVIEWS;

  return (
    <div className="bg-white rounded-[10px] border border-slate-200 shadow-[2px_2px_8px_rgba(0,0,0,0.04)] p-10 lg:p-14 min-h-[600px]">
      <div className="flex flex-col">
        {reviews.map((review, index) => (
          <div key={review.id} className="flex flex-col">
            <ReviewItem 
              reviewerName={review.reviewerName}
              relevance={review.relevance}
              scientificQuality={review.scientificQuality}
              comments={review.comments}
            />
            {/* Divider (except for last item) */}
            {index < reviews.length - 1 && (
              <div className="w-full h-px bg-slate-200 my-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
