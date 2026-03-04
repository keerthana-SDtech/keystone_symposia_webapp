interface SidebarProps {
    sections: string[];
    activeSection: string;
    onSelectSection: (section: string) => void;
}

export const Sidebar = ({ sections, activeSection, onSelectSection }: SidebarProps) => {
    return (
        <div className="w-[280px] shrink-0 bg-[#F4F5F7] rounded-l-[10px] border border-gray-200 py-6 flex flex-col">
            <div className="px-6 mb-4">
                <h2 className="text-[18px] font-semibold text-gray-900 pb-4 border-b border-gray-200/60">Sections</h2>
            </div>
            <nav className="flex flex-col">
                {sections.map((section) => {
                    const isActive = activeSection === section;
                    return (
                        <button
                            key={section}
                            onClick={() => onSelectSection(section)}
                            className={`
                                py-4 px-6 text-left text-[14px] font-medium transition-colors border-l-4
                                ${isActive
                                    ? 'border-[#581585] text-[#581585] bg-white'
                                    : 'border-transparent text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                                }
                            `}
                        >
                            {section}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
