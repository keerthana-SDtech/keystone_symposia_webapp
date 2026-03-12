
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { LANDING_PAGE_CONTENT, LANDING_PAGE_FEATURES } from "../features/landing/data/landingPageData";
import { Header } from "../components/layout/Header";
import backgroundHomeImg from "../assets/backgroundHome_img.svg?url";
import focusIcon from "../assets/landingicons/focusicon.svg?url";
import userIcon from "../assets/landingicons/usericon.svg?url";
import clockIcon from "../assets/landingicons/clockicon.svg?url";
import layoutDashboardIcon from "../assets/landingicons/layoutDashboard.svg?url";

const ICON_MAP: Record<string, React.ReactNode> = {
    "Focus": <img src={focusIcon} alt="Focus" className="w-15 h-15" />,
    "Users": <img src={userIcon} alt="Users" className="w-15 h-15" />,
    "Clock": <img src={clockIcon} alt="Clock" className="w-15 h-15" />,
    "LayoutDashboard": <img src={layoutDashboardIcon} alt="Layout Dashboard" className="w-15 h-15" />,
};

export default function LandingPage() {
    const navigate = useNavigate();

    const handleLoginNav = () => {
        navigate("/submission");
    };

    return (
        <div className="h-screen bg-white flex flex-col font-sans">
            <Header bg="#4A4A4A" />

            {/* Hero Section */}
            <section className="relative overflow-hidden flex-2 flex items-center" style={{ backgroundColor: "#E8E8E8" }}>
                <img
                    src={backgroundHomeImg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 h-full w-auto pointer-events-none select-none"
                />
                <div className="w-full px-12 lg:px-20 py-20 relative z-10">
             <h1 className="text-[64px] font-semibold text-[#101828] leading-[140%] tracking-[0.2px] mb-6">
    {LANDING_PAGE_CONTENT.hero.title}
</h1>

<div className="text-[#101828] text-[20px] font-normal leading-[140%] tracking-[0.2px] mb-10">
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

              
            </section>

            {/* Features Section */}
            <section className="relative px-12 lg:px-20 py-16 overflow-hidden flex-[1.5] flex items-center" style={{ backgroundColor: "#FAFAFA" }}>
                <svg
                    viewBox="0 0 1440 602"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full pointer-events-none select-none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <g opacity="0.06">
                        <circle cx="120.306" cy="373.747" r="332.669" stroke="#667085" strokeWidth="3.41199" fill="none"/>
                        <circle cx="120.305" cy="373.745" r="259.057" stroke="#667085" strokeWidth="2.65699" fill="none"/>
                        <circle cx="121.729" cy="373.744" r="189.692" stroke="#667085" strokeWidth="1.94556" fill="none"/>
                        <circle cx="121.728" cy="373.745" r="116.08" stroke="#667085" strokeWidth="1.19057" fill="none"/>
                        <circle cx="366.464" cy="312.562" r="14.9941" fill="#667085" stroke="#667085" strokeWidth="1.31504"/>
                        <circle cx="111.059" cy="37.9461" r="22.8909" fill="#667085" stroke="#667085" strokeWidth="1.17287"/>
                        <circle cx="404.169" cy="530.971" r="22.6244" fill="#667085" stroke="#667085" strokeWidth="1.70599"/>
                        <circle cx="220.618" cy="313.274" r="22.6244" fill="#667085" stroke="#667085" strokeWidth="1.70599"/>
                        <circle cx="89.7156" cy="545.202" r="22.6244" fill="#667085" stroke="#667085" strokeWidth="1.70599"/>
                        <circle cx="-4.19451" cy="217.941" r="22.7488" fill="#667085" stroke="#667085" strokeWidth="1.4572"/>
                    </g>
                </svg>

                <div className="relative z-10 w-full">
                    <h2 className="text-[28px] font-semibold text-[#111827] mb-2">
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
