import { Clock, Users, Focus, LayoutDashboard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { FeatureItem } from "../components/ui/feature-item";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../app/providers/useAuthContext";
import { useTenant } from "../app/providers/TenantProvider";
import { LANDING_PAGE_CONTENT, LANDING_PAGE_FEATURES } from "../features/landing/data/landingPageData";

const ICON_MAP: Record<string, React.ReactNode> = {
    "Focus": <Focus className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "Users": <Users className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "Clock": <Clock className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
    "LayoutDashboard": <LayoutDashboard className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
};

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { name, logo, logoWidth, logoHeight } = useTenant();

    const handleLoginNav = () => {
        if (isAuthenticated) {
            navigate("/submission");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col font-sans relative overflow-hidden">
            {/* Header */}
            <header className="flex justify-start items-center px-8 py-4 bg-[#4a4a4a] w-full z-20 shrink-0">
                <img src={logo} alt={`${name} Logo`} style={{ width: logoWidth, height: logoHeight }} className="object-contain ml-2 xl:ml-4" />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center pt-[5vh] z-10 w-full relative">
                {/* Titles and Button section */}
                <div className="flex flex-col items-center px-4 w-full shrink-0">
                    <h1 className="text-[30px] md:text-[34px] font-semibold text-[#111827] mb-[1.5vh] text-center tracking-tight">
                        {LANDING_PAGE_CONTENT.hero.title}
                    </h1>

                    <div className="text-[#4b5563] text-center text-[14px] md:text-[15.5px] leading-[1.65] mb-[3vh]">
                        {LANDING_PAGE_CONTENT.hero.subtitle.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>

                    <Button
                        onClick={handleLoginNav}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-md text-[14px] font-normal transition-colors"
                    >
                        {LANDING_PAGE_CONTENT.hero.button}
                    </Button>
                </div>

                {/* Sub-container holding the Info Card */}
                <div className="w-full mt-[5vh] px-4 xl:px-8 z-10 flex justify-center flex-1 min-h-0">
                    <Card className="w-full max-w-[1024px] h-max bg-white pt-[4vh] pb-[5vh] px-8 md:px-14 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-0 mb-[4vh]">
                        <h2 className="text-[24px] md:text-[28px] font-medium text-center mb-[2vh] text-[#111827]">
                            {LANDING_PAGE_CONTENT.card.heading}
                        </h2>

                        <p className="text-center text-[#6b7280] max-w-[760px] mx-auto mb-[5vh] text-[14px] md:text-[15px] leading-relaxed">
                            {LANDING_PAGE_CONTENT.card.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 md:gap-y-10">
                            {LANDING_PAGE_FEATURES.map((feature) => (
                                <FeatureItem
                                    key={feature.id}
                                    icon={ICON_MAP[feature.icon]}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            ))}
                        </div>
                    </Card>
                </div>
            </main>

            {/* Purple stretch footer background */}
            <div className="absolute bottom-0 w-full h-[35vh] bg-primary z-0" />
        </div>
    );
}
