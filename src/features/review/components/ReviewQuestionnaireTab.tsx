import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

interface ReviewQuestionnaireTabProps {
  conceptId: string;
}

export function ReviewQuestionnaireTab({ conceptId }: ReviewQuestionnaireTabProps) {
  const [generalComments, setGeneralComments] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Review submitted", { generalComments, q1, q2 });
    // TODO: Connect to actual submission API and trigger success state
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 min-h-[600px]">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Concept Review</h2>
        <p className="text-slate-500 mb-8">Please provide your detailed feedback for this proposed concept.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          {/* General Comments */}
          <div className="flex flex-col gap-3">
            <Label className="text-base font-semibold text-slate-800">General Comments</Label>
            <p className="text-sm text-slate-500">Provide overall thoughts on the scientific merit, timeliness, and scope.</p>
            <Textarea 
              className="mt-2 min-h-[120px] resize-y" 
              placeholder="Enter your general comments here..."
              value={generalComments}
              onChange={(e) => setGeneralComments(e.target.value)}
            />
          </div>

          <div className="w-full h-px bg-slate-200" />

          {/* Questionnaire */}
          <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold text-slate-800">Questionnaire</h3>

            <div className="flex flex-col gap-3">
              <Label className="text-base font-semibold text-slate-800">
                1. Is the proposed topic sufficiently distinct from recent Keystone Symposia?
              </Label>
              <Textarea 
                className="mt-2 min-h-[100px] resize-y" 
                placeholder="Explain your reasoning..."
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-base font-semibold text-slate-800">
                2. Are the proposed organizers the leaders in this field?
              </Label>
              <Textarea 
                className="mt-2 min-h-[100px] resize-y" 
                placeholder="Explain your reasoning..."
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
              />
            </div>
            
            {/* We could add more fields here matching the actual mockdata if needed */}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" className="px-6 border-slate-300 text-slate-700">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-[#58008e] hover:bg-[#4a0078] text-white px-8">
              Submit Review
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
