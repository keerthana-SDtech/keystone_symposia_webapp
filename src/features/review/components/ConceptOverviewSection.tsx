import { GraduationCap } from "lucide-react";
import type { ConceptReviewType } from "../types/review.types";

interface ConceptOverviewSectionProps {
  concept: ConceptReviewType;
}

export function ConceptOverviewSection({ concept }: ConceptOverviewSectionProps) {
  return (
    <div id="concept-overview" className="scroll-mt-8">
      {/* Meta Headers */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-slate-500">#{concept.id}</span>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
          <div className={`w-1.5 h-1.5 rounded-full ${concept.status === 'Yet to Review' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          <span className="text-xs font-medium text-slate-700">{concept.status}</span>
        </div>

        <div className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
          <span className="text-xs font-medium text-slate-700">{concept.category}</span>
        </div>
      </div>

      {/* Title & Description */}
      <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
        {concept.title}
      </h2>
      <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
        {concept.description || "No description provided."}
      </p>

      {/* Embedded Institute Component */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] flex items-center justify-center border border-slate-100 shrink-0">
          <GraduationCap className="w-6 h-6 text-slate-500" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col mt-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Institute</span>
          <span className="text-base font-semibold text-slate-800">{concept.institute || "Not specified"}</span>
        </div>
      </div>
    </div>
  );
}
