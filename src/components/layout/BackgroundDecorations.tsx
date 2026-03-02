export function BackgroundDecorations() {
    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] right-[-5%] w-[800px] h-[800px] rounded-full border-[1.5px] border-gray-100" />
            <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full border-[1.5px] border-gray-100" />
            <div className="absolute top-[0%] right-[15%] w-[400px] h-[400px] rounded-full border-[1.5px] border-gray-100">
                <div className="absolute top-[10%] left-[20%] w-8 h-8 rounded-full bg-gray-100" />
                <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-gray-100/50" />
            </div>
            <div className="absolute top-[30%] right-[-10%] w-[1200px] h-[1200px] rounded-full border-[1.5px] border-gray-50" />
            <div className="absolute top-[40%] right-[80%] w-[160px] h-[160px] rounded-full bg-gray-100/50 blur-[1px]" />
            <div className="absolute bottom-[20%] right-[-2%] w-[120px] h-[120px] rounded-full bg-gray-200/50" />
        </div>
    );
}
