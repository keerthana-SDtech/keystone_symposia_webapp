import { Clock, Users, Focus, LayoutDashboard, UserCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../app/providers/TenantProvider";
import { LANDING_PAGE_CONTENT, LANDING_PAGE_FEATURES } from "../features/landing/data/landingPageData";
import { useAuthContext } from "../app/providers/useAuthContext";

const ICON_MAP: Record<string, React.ReactNode> = {
    "Focus": <Focus className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "Users": <Users className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "Clock": <Clock className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "LayoutDashboard": <LayoutDashboard className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
};

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthContext();

    const { name, logo, logoWidth, logoHeight } = useTenant();

    const handleLoginNav = () => {
        navigate("/submission");
    };

    const userName = user?.name ?? user?.email ?? "User";

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-4 bg-[#58008e] w-full z-20 shrink-0">
                <img src={logo} alt={`${name} Logo`} style={{ width: logoWidth, height: logoHeight }} className="object-contain" />
                {isAuthenticated && (
                    <div className="flex items-center gap-3">
                        <span className="text-white text-[14px]">Welcome, {userName}</span>
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <UserCircle2 className="w-5 h-5 text-white" />
                        </div>
                    </div>
                )}
            </header>

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
                        {/* Small floating circles */}
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
