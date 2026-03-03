export function BackgroundDecorations() {
    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none z-0">
            {/* Center anchor for rings: placed on the right side of the screen */}
            <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 flex items-center justify-center">

                {/* Ring 4 (Outermost) - 1300px */}
                <div className="absolute w-[1300px] h-[1300px] rounded-full border-[1.5px] border-slate-100/80">
                    {/* Bottom-left white dot: theta = 145 -> left 9.1%, top 78.6% */}
                    <div className="absolute top-[78.6%] left-[9.1%] w-4 h-4 rounded-full bg-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
                    {/* Bottom-right huge grey node: theta = 60 -> left 75%, top 93.3% */}
                    <div className="absolute top-[93.3%] left-[75%] w-28 h-28 rounded-full bg-slate-200/50 -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Ring 3 - 950px */}
                <div className="absolute w-[950px] h-[950px] rounded-full border-[1.5px] border-slate-100/80">
                    {/* Top-left vast grey node: theta = 225 -> left 14.7%, top 14.7% */}
                    <div className="absolute top-[14.7%] left-[14.7%] w-20 h-20 rounded-full bg-slate-100/80 -translate-x-1/2 -translate-y-1/2" />
                    {/* Far left white dot: theta = 180 -> left 0%, top 50% */}
                    <div className="absolute top-[50%] left-[0%] w-[18px] h-[18px] rounded-full bg-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
                    {/* Bottom-left medium grey node: theta = 135 -> left 14.7%, top 85.3% */}
                    <div className="absolute top-[85.3%] left-[14.7%] w-16 h-16 rounded-full bg-slate-200/60 -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Ring 2 - 600px */}
                <div className="absolute w-[600px] h-[600px] rounded-full border-[1.5px] border-slate-100/80">
                    {/* Top-left white node: theta = 215 -> left 9.1%, top 21.4% */}
                    <div className="absolute top-[21.4%] left-[9.1%] w-4 h-4 rounded-full bg-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
                    {/* Top-right large grey node: theta = 290 -> left 67.1%, top 3.1% */}
                    <div className="absolute top-[3.1%] left-[67.1%] w-12 h-12 rounded-full bg-slate-200/80 -translate-x-1/2 -translate-y-1/2" />
                    {/* Bottom-left white node: theta = 145 -> left 9.1%, top 78.6% */}
                    <div className="absolute top-[78.6%] left-[9.1%] w-4 h-4 rounded-full bg-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Ring 1 (Innermost) - 250px */}
                <div className="absolute w-[250px] h-[250px] rounded-full border-[1.5px] border-slate-100/80">
                    <div className="absolute top-[50%] left-[0%] w-3 h-3 rounded-full bg-white shadow-sm -translate-x-1/2 -translate-y-1/2" />
                </div>

            </div>
        </div>
    );
}
