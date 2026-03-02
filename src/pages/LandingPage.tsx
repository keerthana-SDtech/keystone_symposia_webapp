import { Clock, Users, Focus, LayoutDashboard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../app/providers/useAuthContext";
import { useTenant } from "../app/providers/TenantProvider";

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
                        Propose a Scientific Conference
                    </h1>

                    <div className="text-[#4b5563] text-center text-[14px] md:text-[15.5px] leading-[1.65] mb-[3vh]">
                        <p>Share your vision for a groundbreaking scientific meeting.</p>
                        <p>Our expert panel reviews proposals and helps bring the most impactful conferences to life.</p>
                    </div>

                    <Button
                        onClick={handleLoginNav}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-md text-[14px] font-normal transition-colors"
                    >
                        Submit Concept
                    </Button>
                </div>

                {/* Sub-container holding the Info Card */}
                <div className="w-full mt-[5vh] px-4 xl:px-8 z-10 flex justify-center flex-1 min-h-0">
                    <Card className="w-full max-w-[1024px] h-max bg-white pt-[4vh] pb-[5vh] px-8 md:px-14 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-0 mb-[4vh]">
                        <h2 className="text-[24px] md:text-[28px] font-medium text-center mb-[2vh] text-[#111827]">
                            What is a Conference Concept?
                        </h2>

                        <p className="text-center text-[#6b7280] max-w-[760px] mx-auto mb-[5vh] text-[14px] md:text-[15px] leading-relaxed">
                            A conference concept is a proposal for a focused scientific meeting that brings together researchers to advance
                            a specific field. Your submission should articulate the scientific need, timing rationale, and potential impact of
                            the proposed conference.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 md:gap-y-10">
                            <FeatureItem
                                icon={<Focus className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />}
                                title="Clear Focus"
                                description="Define the scientific topic and why it needs dedicated attention now."
                            />
                            <FeatureItem
                                icon={<Users className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />}
                                title="Community Impact"
                                description="Explain how this conference advances the field and benefits."
                            />
                            <FeatureItem
                                icon={<Clock className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />}
                                title="Timely Relevance"
                                description="Demonstrate why this is the right moment for this conference."
                            />
                            <FeatureItem
                                icon={<LayoutDashboard className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />}
                                title="Feasibility & Clarity"
                                description="Show the concept is well-structured and achievable."
                            />
                        </div>
                    </Card>
                </div>
            </main>

            {/* Purple stretch footer background */}
            <div className="absolute bottom-0 w-full h-[35vh] bg-primary z-0" />
        </div>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex flex-col items-start px-2">
            <div className="bg-[#f9fafb] w-[48px] h-[48px] rounded-xl mb-[1.5vh] flex items-center justify-center text-gray-400 shrink-0">
                {icon}
            </div>
            <h3 className="text-[16px] md:text-[17px] font-medium mb-[1vh] text-[#111827] tracking-tight">{title}</h3>
            <p className="text-[#6b7280] text-[13px] md:text-[14.5px] leading-[1.6]">{description}</p>
        </div>
    );
}
