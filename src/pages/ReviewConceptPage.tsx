import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { BackgroundDecorations } from "../components/layout/BackgroundDecorations";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { ConceptOverviewTab } from "../features/review/components/ConceptOverviewTab";
import { ReviewQuestionnaireTab } from "../features/review/components/ReviewQuestionnaireTab";
import { MOCK_CONCEPTS } from "../features/review/data/mockConcepts";
import { REVIEW_CONCEPT_PAGE_CONTENT } from "../features/review/data/reviewConceptData";

export default function ReviewConceptPage() {
  const navigate = useNavigate();
  const { conceptId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // In a real app, we would fetch the concept details using the conceptId from an API.
  // For now, we find it in our mock JSON data array.
  const concept = MOCK_CONCEPTS.find(c => c.id === conceptId) || MOCK_CONCEPTS[0];

  return (
    <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
      <BackgroundDecorations />
      
      <div className="w-full max-w-[1720px] mx-auto pt-8 px-6 lg:px-12 relative z-10">
        
        {/* Breadcrumb & Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-[15px] font-medium text-slate-500">
            <span
              className="cursor-pointer hover:text-slate-800 transition-colors"
              onClick={() => navigate('/reviewer/dashboard')}
            >
              {REVIEW_CONCEPT_PAGE_CONTENT.breadcrumb.dashboard}
            </span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-semibold">
              {concept.title}
            </span>
          </div>

          <Button
            type="button"
            className="bg-[#58008e] hover:bg-[#4a0078] text-white px-6 font-medium rounded-md"
            onClick={() => navigate(`/reviewer/review/${concept.id}/submit`)}
          >
            {REVIEW_CONCEPT_PAGE_CONTENT.submitReviewButton}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-100 p-1.5 rounded-lg inline-flex gap-1 mb-8">
            <TabsTrigger
              value={REVIEW_CONCEPT_PAGE_CONTENT.tabs.overview.value}
              className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-600 data-[state=active]:text-slate-900 font-medium transition-all"
            >
              {REVIEW_CONCEPT_PAGE_CONTENT.tabs.overview.label}
            </TabsTrigger>
            <TabsTrigger
              value={REVIEW_CONCEPT_PAGE_CONTENT.tabs.reviews.value}
              className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-600 data-[state=active]:text-slate-900 font-medium transition-all"
            >
              {REVIEW_CONCEPT_PAGE_CONTENT.tabs.reviews.label}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <ConceptOverviewTab concept={concept} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-0">
            <ReviewQuestionnaireTab conceptId={concept.id} />
          </TabsContent>
        </Tabs>

      </div>
    </PageShell>
  );
}
