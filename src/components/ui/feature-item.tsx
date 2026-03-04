import * as React from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Reusable feature item used on landing-style pages.
 * Shows an icon box, title, and description in a vertical layout.
 */
export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-start px-2">
      <div className="bg-[#f9fafb] w-[48px] h-[48px] rounded-xl mb-[1.5vh] flex items-center justify-center text-gray-400 shrink-0">
        {icon}
      </div>
      <h3 className="text-[16px] md:text-[17px] font-semibold mb-[1vh] text-[#111827] tracking-tight">{title}</h3>
      <p className="text-[#6b7280] text-[13px] md:text-[14.5px] leading-[1.6]">{description}</p>
    </div>
  );
}
