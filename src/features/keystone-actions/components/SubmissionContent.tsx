import { ChevronDown, GraduationCap, User, Mail } from "lucide-react";
import type { SubmissionDetail } from "../types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBMISSION_CONTENT } from "../data/keystoneActionsData";

interface SubmissionContentProps {
    detail: SubmissionDetail;
}

export const SubmissionContent = ({ detail }: SubmissionContentProps) => {
    const navigate = useNavigate();
    // Accordion state for Rationale form section
    const [openAccordion, setOpenAccordion] = useState<string | null>(
        SUBMISSION_CONTENT.rationaleQuestions[0]
    );

    const toggleAccordion = (question: string) => {
        setOpenAccordion(prev => prev === question ? null : question);
    };

    return (
        <div id="submission-content-scroll-area" className="flex-1 bg-white rounded-r-[10px] border border-l-0 border-gray-200 p-8 overflow-y-auto h-full min-h-[600px] scroll-smooth relative">

            {/* Concept Overview Section - starts at meta row */}
            <div id="concept-overview" className="scroll-mt-8">
                {/* Header / Meta Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] text-gray-500 font-medium">{detail.displayId}</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-medium text-gray-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${detail.status === 'Rejected' ? 'bg-red-500' :
                                detail.status === 'Shortlisted' ? 'bg-green-500' : 'bg-purple-500'
                                }`} />
                            {detail.status}
                        </div>
                        <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-medium text-gray-700">
                            {detail.category}
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/dashboard/${detail.id}/edit`)}
                        className="text-[14px] font-medium text-[#581585] hover:text-[#47116b] transition-colors"
                    >
                        {SUBMISSION_CONTENT.labels.edit}
                    </button>
                </div>

                {/* Title & Description */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-4 tracking-tight">
                        {detail.title}
                    </h1>
                    <p className="text-[15px] text-gray-500 leading-relaxed max-w-[900px]">
                        {detail.sections["Concept Overview"]?.description}
                    </p>
                </div>
            </div>

            {/* Institution Badge (Concept Overview fields) */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">{SUBMISSION_CONTENT.labels.institute}</div>
                    <div className="text-[14px] font-medium text-gray-900">
                        {detail.sections["Concept Overview"]?.institute || SUBMISSION_CONTENT.labels.instituteDefault}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 mb-10" />

            {/* Organizer Details */}
            <div id="organizer" className="mb-10 scroll-mt-8">
                <h3 className="text-[18px] font-bold text-gray-900 mb-6">{SUBMISSION_CONTENT.sectionHeadings.organizerDetails}</h3>
                <div className="flex items-center flex-wrap gap-4 border border-gray-200 rounded-[8px] p-2 hover:border-gray-300 transition-colors">
                    {/* Organizer Name */}
                    <div className="flex items-center gap-3 p-3 flex-1 min-w-[200px]">
                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[12px] font-medium text-gray-500">{SUBMISSION_CONTENT.labels.organizerName}</div>
                            <div className="text-[14px] font-medium text-gray-900">
                                {detail.sections["Organizer Details"]?.firstName} {detail.sections["Organizer Details"]?.lastName}
                            </div>
                        </div>
                    </div>
                    {/* Organizer Email */}
                    <div className="flex items-center gap-3 p-3 flex-1 min-w-[200px]">
                        <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[12px] font-medium text-gray-500">{SUBMISSION_CONTENT.labels.organizerEmail}</div>
                            <div className="text-[14px] font-medium text-gray-900">
                                {detail.sections["Organizer Details"]?.organizerEmail}
                            </div>
                        </div>
                    </div>
                    {/* Institute */}
                    <div className="flex items-center gap-3 p-3 flex-1 min-w-[200px]">
                        <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[12px] font-medium text-gray-500">{SUBMISSION_CONTENT.labels.instituteSectionLabel}</div>
                            <div className="text-[14px] font-medium text-gray-900">
                                {detail.sections["Organizer Details"]?.organizerInstitute}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 mb-10" />

            {/* Conference Rationale (Dynamic Accordions) */}
            <div id="conference-rationale" className="scroll-mt-8">
                <h3 className="text-[18px] font-bold text-gray-900 mb-6">{SUBMISSION_CONTENT.sectionHeadings.conferenceRationale}</h3>
                <div className="flex flex-col gap-3">
                    {Object.entries(detail.sections["Conference Rationale"] || {}).map(([key, value], idx) => {
                        const question = SUBMISSION_CONTENT.rationaleQuestions[idx] || key;
                        const isOpen = openAccordion === question;

                        return (
                            <div
                                key={idx}
                                className={`
                                    border rounded-md overflow-hidden transition-all duration-200
                                    ${isOpen ? 'border-[#581585] shadow-sm' : 'border-gray-200 hover:border-gray-300'}
                                `}
                            >
                                <button
                                    onClick={() => toggleAccordion(question)}
                                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                                >
                                    <span className={`text-[14px] font-medium ${isOpen ? 'text-[#581585]' : 'text-gray-900'}`}>
                                        {question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'text-[#581585] rotate-180' : 'text-gray-400'}`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="p-4 pt-0 border-t border-transparent text-[14px] text-gray-500 leading-relaxed pr-10">
                                        {value}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {
                detail.sections["Comments"] && (
                    <>
                        <hr className="border-gray-100 my-10" />
                        <div id="comments" className="scroll-mt-8 pb-10">
                            <h3 className="text-[18px] font-bold text-gray-900 mb-6">{SUBMISSION_CONTENT.sectionHeadings.comments}</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-[8px] p-5 text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {detail.sections["Comments"].comment}
                            </div>
                        </div>
                    </>
                )
            }
        </div >
    );
};
