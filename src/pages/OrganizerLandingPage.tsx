import { Focus, UsersRound, Clock3, LayoutPanelTop } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { FeatureItem } from "../components/ui/feature-item";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../app/providers/useAuthContext";
import { useTenant } from "../app/providers/TenantProvider";
import { ORGANIZER_LANDING_FEATURES, ORGANIZER_LANDING_CONTENT } from "../features/organizer/data/organizerLandingData";

// Map icon string names → lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Focus: <Focus className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
  UsersRound: <UsersRound className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
  Clock3: <Clock3 className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
  LayoutPanelTop: <LayoutPanelTop className="h-[20px] w-[20px] text-gray-400 stroke-[1.5]" />,
};

export default function OrganizerLandingPage() {
  const navigate = useNavigate();
  useAuthContext(); // keep context available for future auth-gating
  const { name, logo, logoWidth, logoHeight } = useTenant();

  const handleSubmitProposal = () => {
    navigate("/organizer/proposal/submit");
  };

  const handleDownloadConcept = () => {
    // TODO: hook up to actual concept PDF download
    console.log("Download concept triggered");
  };

  return (
    <div className="h-screen bg-[#F9FAFB] flex flex-col font-sans relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-start items-center px-8 py-4 bg-[#4a4a4a] w-full z-20 shrink-0">
        <img
          src={logo}
          alt={`${name} Logo`}
          style={{ width: logoWidth, height: logoHeight }}
          className="object-contain ml-2 xl:ml-4"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-[10vh] z-10 w-full relative">
        {/* Hero section */}
        <div className="flex flex-col items-center px-4 w-full shrink-0">
          <h1 className="text-[38px] md:text-[42px] font-bold text-[#111827] mb-[1.5vh] text-center tracking-tight">
            {ORGANIZER_LANDING_CONTENT.hero.title}
          </h1>

          <div className="text-[#4b5563] text-center text-[15.5px] md:text-[17px] font-medium leading-[1.65] mb-[5vh] max-w-[700px]">
            {ORGANIZER_LANDING_CONTENT.hero.subtitle.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-[2vh]">
            <Button
              variant="outline"
              onClick={handleDownloadConcept}
              className="px-8 py-6 rounded-md text-[15px] font-medium border-slate-300 text-slate-700 transition-colors"
            >
              {ORGANIZER_LANDING_CONTENT.hero.buttons.download}
            </Button>
            <Button
              onClick={handleSubmitProposal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-md text-[15px] font-medium transition-colors"
            >
              {ORGANIZER_LANDING_CONTENT.hero.buttons.submit}
            </Button>
          </div>
        </div>

        {/* Info card */}
        <div className="w-full mt-[5vh] px-3 z-10 flex justify-center flex-1 min-h-0">
          <Card className="w-[95%] h-max bg-white pt-[4vh] pb-[5vh] px-8 md:px-14 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-0 mb-[4vh]">
            <h2 className="text-[26px] md:text-[30px] font-semibold text-center mb-[2vh] text-[#111827]">
              {ORGANIZER_LANDING_CONTENT.card.heading}
            </h2>

            <p className="text-center text-[#6b7280] max-w-[95%] mx-auto mb-[5vh] text-[15px] md:text-[16px] leading-relaxed">
              {ORGANIZER_LANDING_CONTENT.card.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 md:gap-y-10">
              {ORGANIZER_LANDING_FEATURES.map((feature) => (
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
      <div className="absolute bottom-0 w-full h-[20vh] bg-primary z-0" />
    </div>
  );
}
