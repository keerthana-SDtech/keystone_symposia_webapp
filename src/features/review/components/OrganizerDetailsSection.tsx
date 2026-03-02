import { User, Mail, GraduationCap } from "lucide-react";
import type { ConceptReviewType } from "../types/review.types";

interface OrganizerDetailsSectionProps {
  concept: ConceptReviewType;
}

export function OrganizerDetailsSection({ concept }: OrganizerDetailsSectionProps) {
  return (
    <div id="organizer" className="scroll-mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Organizer Details</h3>
      <div className="flex items-center gap-12 p-6 rounded-xl border border-slate-200 bg-white">
        {/* Name Item */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-slate-100 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-500 mb-1">Organizer Name</span>
            <span className="text-[15px] font-medium text-slate-800">{concept.organizerName || "Not specified"}</span>
          </div>
        </div>

        {/* Email Item */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-slate-100 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-500 mb-1">Organizer Email</span>
            <span className="text-[15px] font-medium text-slate-800">{concept.organizerEmail || "Not specified"}</span>
          </div>
        </div>

        {/* Institute Item */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-slate-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-500 mb-1">Institute</span>
            <span className="text-[15px] font-medium text-slate-800">{concept.institute || "Not specified"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
