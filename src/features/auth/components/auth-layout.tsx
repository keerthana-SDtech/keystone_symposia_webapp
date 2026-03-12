import React from "react";
import bgImage from "../../../assets/backgroundlogin_img.svg";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex font-sans bg-white overflow-hidden">
            {/* Left side Form Area */}
            <div className="flex items-center justify-center p-8 z-10 w-full lg:w-1/2">
                <div className="w-full max-w-[380px]">
                    {children}
                </div>
            </div>

            {/* Right side Graphics Area */}
         <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-start pl-[6%]">
    
    <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
    />

    <div className="relative z-10 max-w-[620px]">
        <h1 className="text-[64px] font-bold leading-[1.2] tracking-[0.2px] text-[#101828] mb-8">
            Propose a Scientific <br />
            Conference
        </h1>

        <p className="text-[20px] font-normal leading-[1.4] tracking-[0.2px] text-[#101828] max-w-[560px]">
            Share your vision for a bold scientific meeting. Our experts review
            and help bring the best ideas to life
        </p>
    </div>

</div>
        </div>
    );
};
