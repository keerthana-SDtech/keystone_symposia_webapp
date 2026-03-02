import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex font-sans bg-white overflow-hidden">
            {/* Left side Form Area */}
            <div className="flex-1 flex items-center justify-center p-8 z-10 w-full lg:w-1/2">
                <div className="w-full max-w-[380px]">
                    {children}
                </div>
            </div>

            {/* Right side Graphics Area */}
            <div className="hidden lg:flex lg:flex-1 relative bg-primary rounded-tl-[140px] overflow-hidden items-center justify-start pl-[10%]">
                {/* Decorative Circles */}
                <div className="absolute top-[30%] right-[-10%] flex items-center justify-center pointer-events-none">
                    <div className="absolute w-[1200px] h-[1200px] rounded-full border border-white/5" />
                    <div className="absolute w-[900px] h-[900px] rounded-full border border-white/10" />
                    <div className="absolute w-[600px] h-[600px] rounded-full border border-white/10">
                        <div className="absolute top-[10%] left-[20%] w-6 h-6 bg-white/10 rounded-full" />
                        <div className="absolute bottom-[20%] right-[10%] w-8 h-8 bg-white/10 rounded-full" />
                    </div>
                    <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10">
                        <div className="absolute top-[30%] right-[-10px] w-5 h-5 bg-white/10 rounded-full" />
                        <div className="absolute bottom-[10%] left-[20%] w-7 h-7 bg-white/10 rounded-full" />
                    </div>
                </div>

                <div className="absolute bottom-[-10%] left-[10%] flex items-center justify-center pointer-events-none">
                    <div className="absolute w-[800px] h-[800px] rounded-full border border-white/5" />
                    <div className="absolute w-[500px] h-[500px] rounded-full border border-white/10">
                        <div className="absolute top-[0] right-[30%] w-6 h-6 bg-white/10 rounded-full" />
                        <div className="absolute bottom-[20%] right-[10%] w-4 h-4 bg-white/10 rounded-full" />
                    </div>
                    <div className="absolute w-[250px] h-[250px] rounded-full border border-white/10">
                        <div className="absolute top-[20%] left-[-10px] w-5 h-5 bg-white/10 rounded-full" />
                    </div>
                </div>

                <div className="relative z-10 max-w-[480px] text-white">
                    <h1 className="text-[44px] font-bold mb-6 leading-[1.15] tracking-tight">
                        Propose a Scientific<br />Conference
                    </h1>
                    <p className="text-[16px] text-white/90 leading-[1.6]">
                        Share your vision for a bold scientific meeting. Our<br />experts review and help bring the best ideas to life
                    </p>
                </div>
            </div>
        </div>
    );
};
