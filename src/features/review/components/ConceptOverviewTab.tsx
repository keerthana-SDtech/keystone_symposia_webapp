import { useState, useEffect } from "react";
import { SidebarNav } from "../../../components/ui/sidebar-nav";
import { ConceptOverviewSection } from "./ConceptOverviewSection";
import { OrganizerDetailsSection } from "./OrganizerDetailsSection";
import { ConferenceRationaleSection } from "./ConferenceRationaleSection";

import type { ConceptReviewType } from "../types/review.types";

interface ConceptOverviewTabProps {
  concept: ConceptReviewType;
}

export function ConceptOverviewTab({ concept }: ConceptOverviewTabProps) {
  const [activeSection, setActiveSection] = useState("concept-overview");

  const sections = [
    { id: "concept-overview", label: "Concept Overview" },
    { id: "organizer", label: "Organizer" },
    { id: "conference-rationale", label: "Conference Rationale" },
    { id: "comments", label: "Comments" }
  ];

  // Optional: Add simple intersection observer or scroll listener here if we want auto-updating active states.
  // For now, setting on click works smoothly.
  
  useEffect(() => {
    // Enable smooth scrolling on the html element when this component mounts
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="flex w-full items-start">
      
      {/* Left Sidebar Sections Navigation */}
      <SidebarNav 
        items={sections.map(s => ({ title: s.label, href: `#${s.id}` }))}
        activeItem={`#${activeSection}`}
        onItemClick={(href) => setActiveSection(href.replace('#', ''))}
      />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[10px] rounded-l-none border border-slate-200 shadow-[2px_2px_8px_rgba(0,0,0,0.04)] py-10 flex flex-col gap-10">
        <div className="px-10 lg:px-14">
          <ConceptOverviewSection concept={concept} />
        </div>
        
        <div className="mx-10 lg:mx-14 h-px bg-slate-200" />
        
        <div className="px-10 lg:px-14">
          <OrganizerDetailsSection concept={concept} />
        </div>

        <div className="mx-10 lg:mx-14 h-px bg-slate-200" />
        
        <div className="px-10 lg:px-14">
          <ConferenceRationaleSection concept={concept} />
        </div>
        
        {/* Comments Section Placeholder */}
        <div id="comments" className="scroll-mt-8 px-10 lg:px-14 mt-2">
           <h3 className="text-[17px] font-bold text-slate-800 mb-4">Comments</h3>
           <div className="p-8 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
             No general comments provided for this concept.
           </div>
        </div>
      </div>

    </div>
  );
}
