import { Clock, Focus, LayoutDashboard } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { LANDING_PAGE_CONTENT, LANDING_PAGE_FEATURES } from "../features/landing/data/landingPageData";
import { Header } from "../components/layout/Header";
import groupIcon from "../assets/group.png";

const ICON_MAP: Record<string, React.ReactNode> = {
    "Focus": <div className="flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[#F9FAFB] p-2"><Focus className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" /></div>,
    "Users": <div className="flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[#F9FAFB] p-2"><img src={groupIcon} alt="Community Impact" className="h-[20px] w-[20px]" /></div>,
    "Clock": <div className="flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[#F9FAFB] p-2"><Clock className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" /></div>,
    "LayoutDashboard": <div className="flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[#F9FAFB] p-2"><LayoutDashboard className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" /></div>,
};

export default function LandingPage() {
    const navigate = useNavigate();

    const handleLoginNav = () => {
        navigate("/submission");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Shared header with purple brand background */}
            <Header bg="#58008e" />

            {/* Hero Section */}
            <section className="relative bg-[#E8E8E8] overflow-hidden">
                <div className="w-full px-12 lg:px-20 py-20 relative z-10 max-w-[760px]">
                    <h1 className="text-[48px] lg:text-[56px] font-bold text-[#58008e] leading-[1.1] mb-6">
                        {LANDING_PAGE_CONTENT.hero.title}
                    </h1>
                    <div className="text-[#7c3aed] text-[16px] leading-[1.7] mb-10">
                        {LANDING_PAGE_CONTENT.hero.subtitle.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                    <Button
                        onClick={handleLoginNav}
                        variant="outline"
                        className="bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 px-6 h-11 text-[14px] font-normal rounded-md"
                    >
                        {LANDING_PAGE_CONTENT.hero.button}
                    </Button>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-[-10%] right-[-8%] pointer-events-none">
                    <div className="relative w-[520px] h-[520px] flex items-center justify-center">
                        <div className="absolute w-[520px] h-[520px] rounded-full border border-white/60" />
                        <div className="absolute w-[380px] h-[380px] rounded-full border border-white/60" />
                        <div className="absolute w-[240px] h-[240px] rounded-full border border-white/60" />
                        <div className="absolute w-[120px] h-[120px] rounded-full border border-white/60" />
                        <div className="absolute top-[8%] left-[32%] w-8 h-8 rounded-full border border-white/60" />
                        <div className="absolute top-[18%] right-[6%] w-6 h-6 rounded-full border border-white/60" />
                        <div className="absolute bottom-[28%] right-[-2%] w-10 h-10 rounded-full border border-white/60" />
                        <div className="absolute bottom-[10%] left-[38%] w-5 h-5 rounded-full border border-white/60" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative bg-white px-12 lg:px-20 py-16 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute bottom-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full bg-[#f3e8ff]/40 pointer-events-none" />
                <div className="absolute bottom-[20px] right-[180px] w-[180px] h-[180px] rounded-full bg-[#f3e8ff]/30 pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-[28px] font-bold text-[#111827] mb-2">
                        {LANDING_PAGE_CONTENT.card.heading}
                    </h2>
                    <p className="text-[#6b7280] text-[14.5px] mb-10">
                        {LANDING_PAGE_CONTENT.card.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {LANDING_PAGE_FEATURES.map((feature) => (
                            <div
                                key={feature.id}
                                className="border border-slate-200 rounded-xl p-6 flex flex-col gap-4 bg-white"
                            >
                                <div className="text-gray-400">
                                    {ICON_MAP[feature.icon]}
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-[#111827] mb-1">{feature.title}</h3>
                                    <p className="text-[13.5px] text-[#6b7280] leading-[1.55]">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
