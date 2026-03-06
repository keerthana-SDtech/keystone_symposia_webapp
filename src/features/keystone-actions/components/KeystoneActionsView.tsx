import { useEffect, useState } from "react";
import { getConceptDetail, submitConcept, shortlistConcept, bankConcept, rejectConcept } from "../api/conceptApi";
import type { SubmissionDetail } from "../types";
import { ActionHeader } from "./ActionHeader";
import { SidebarNav } from "../../../components/ui/sidebar-nav";
import { SubmissionContent } from "./SubmissionContent";
import { useNavigate } from "react-router-dom";
import type { ActionType } from "../types";
import { ActivityTimeline } from "./ActivityTimeline";
import { StudyGroupBanner } from "./StudyGroupBanner";
import { ACTION_TO_STATUS, SIDEBAR_SECTIONS, KEYSTONE_ACTIONS_CONTENT } from "../data/keystoneActionsData";
import { LoadingSpinner } from "../../../components/feedback/LoadingSpinner";

export const KeystoneActionsView = ({ id }: { id: string }) => {
    const navigate = useNavigate();
    const [detail, setDetail] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("Concept Overview");
    const [showToast, setShowToast] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isActivityTimelineOpen, setIsActivityTimelineOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await getConceptDetail(id);
            setDetail(data);
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full py-20 flex justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center">
                <h2 className="text-xl font-medium text-gray-800">{KEYSTONE_ACTIONS_CONTENT.notFound.heading}</h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 text-primary hover:underline"
                >
                    {KEYSTONE_ACTIONS_CONTENT.notFound.returnLink}
                </button>
            </div>
        );
    }

    const sections = [...SIDEBAR_SECTIONS];
    if (detail.sections["Comments"]) {
        sections.push("Comments");
    }

    const handleActionSubmit = async (type: ActionType, comments: string) => {
        const updatedStatus = ACTION_TO_STATUS[type];
        const apiFn = { Shortlist: shortlistConcept, Bank: bankConcept, Reject: rejectConcept }[type];

        setActionError(null);
        try {
            // Ensure concept is in 'submitted' stage before review actions
            try { await submitConcept(id); } catch { /* already submitted — proceed */ }
            await apiFn(id, comments);
            setDetail((prev) => {
                if (!prev) return prev;
                const updatedSections = { ...prev.sections };
                if (comments) updatedSections['Comments'] = { comment: comments };
                return { ...prev, status: updatedStatus, sections: updatedSections };
            });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? `Failed to ${type.toLowerCase()} concept`;
            setActionError(msg);
        }
    };

    const handleSectionSelect = (section: string) => {
        setActiveSection(section);
        const id = section.toLowerCase().replace(/\s+/g, '-');
        const element = document.getElementById(id);
        const container = document.getElementById('submission-content-scroll-area');

        if (element && container) {
            const containerTop = container.getBoundingClientRect().top;
            const elementTop = element.getBoundingClientRect().top;
            const scrollTarget = elementTop - containerTop + container.scrollTop - 32; // 32px for padding

            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto pb-16 relative">
            <StudyGroupBanner status={detail.status} />

            <ActionHeader
                title={detail.title}
                status={detail.status}
                onBack={() => navigate('/dashboard')}
                onActionSubmit={handleActionSubmit}
                onViewActivityTimeline={() => setIsActivityTimelineOpen(true)}
            />

            <div className="flex flex-col md:flex-row items-start mt-6 h-[calc(100vh-180px)] min-h-[600px] overflow-hidden">
                <SidebarNav
                    items={sections.map(s => ({ title: s }))}
                    activeItem={activeSection}
                    onItemClick={handleSectionSelect}
                    className="w-[280px] bg-[#F4F5F7] rounded-l-[10px] rounded-r-none border border-gray-200 min-h-full"
                />
                <SubmissionContent detail={detail} />
            </div>

            {actionError && (
                <div className="fixed bottom-6 right-6 bg-red-50 text-red-800 border border-red-200 rounded-md p-4 shadow-lg flex items-center justify-between min-w-[300px]">
                    <span className="text-[14px] font-medium">{actionError}</span>
                    <button onClick={() => setActionError(null)} className="text-gray-400 hover:text-gray-600 ml-4">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                </div>
            )}

            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-50 text-green-800 border border-green-200 rounded-md p-4 shadow-lg flex items-center justify-between min-w-[300px] animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-[14px] font-medium">Concept {detail?.status.toLowerCase()}{KEYSTONE_ACTIONS_CONTENT.toast.successSuffix}</span>
                    </div>
                    <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                </div>
            )}

            <ActivityTimeline
                isOpen={isActivityTimelineOpen}
                onClose={() => setIsActivityTimelineOpen(false)}
                detail={detail}
            />
        </div>
    );
};
