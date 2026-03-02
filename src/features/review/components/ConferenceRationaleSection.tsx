import type { ConceptReviewType } from "../types/review.types";
import { Accordion } from "../../../components/ui/accordion";

interface ConferenceRationaleSectionProps {
  concept: ConceptReviewType;
}

export function ConferenceRationaleSection({ concept }: ConferenceRationaleSectionProps) {

  const qaList = concept.rationaleQuestions || [];

  return (
    <div id="conference-rationale" className="scroll-mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Conference Rationale</h3>
      {qaList.length === 0 ? (
        <div className="text-slate-500 text-sm italic">No rationale provided.</div>
      ) : (
        <Accordion 
          items={qaList.map((item, index) => ({
             id: `q-${index}`,
             title: item.q,
             content: item.a
          }))}
          defaultOpenItems={["q-0"]}
        />
      )}
    </div>
  );
}
