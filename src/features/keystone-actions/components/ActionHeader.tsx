import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionModal } from "./ActionModal";
import type { ActionType } from "../types";
import { KEYSTONE_ACTIONS_CONTENT, ACTION_ITEMS } from "../data/keystoneActionsData";

interface ActionHeaderProps {
    title: string;
    status: string;
    onBack: () => void;
    onActionSubmit: (type: ActionType, comments: string) => void;
    onViewActivityTimeline: () => void;
}

export const ActionHeader = ({ title, status, onBack, onActionSubmit, onViewActivityTimeline }: ActionHeaderProps) => {
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: ActionType | null }>({
        isOpen: false,
        type: null
    });

    const openModal = (type: ActionType) => {
        setModalConfig({ isOpen: true, type });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null });
    };

    return (
        <>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center text-[13px] text-gray-500 font-medium">
                    <button
                        onClick={onBack}
                        className="hover:text-gray-900 transition-colors"
                    >
                        {KEYSTONE_ACTIONS_CONTENT.breadcrumb.dashboard}
                    </button>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-gray-900 truncate max-w-[500px]" title={title}>
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onViewActivityTimeline}
                        className="text-[13px] font-medium text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100"
                    >
                        {KEYSTONE_ACTIONS_CONTENT.buttons.viewActivityTimeline}
                    </Button>

                    {status !== 'Rejected' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-[#581585] hover:bg-[#47116b] text-white text-[13px] font-medium gap-2">
                                    {KEYSTONE_ACTIONS_CONTENT.buttons.actions}
                                    <ChevronDown className="h-4 w-4 opacity-70" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[120px] rounded-[8px] p-1.5 border-gray-200">
                                {ACTION_ITEMS.filter(item =>
                                    !(item.type === 'Shortlist' && status === 'Shortlisted') &&
                                    !(item.type === 'Bank' && status === 'Banked')
                                ).map(item => (
                                    <DropdownMenuItem
                                        key={item.type}
                                        className="text-[14px] font-normal cursor-pointer py-2 px-3 text-gray-800 focus:bg-gray-100 focus:text-gray-900"
                                        onClick={() => openModal(item.type)}
                                    >
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <ActionModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onSubmit={(comments) => {
                    if (modalConfig.type) {
                        onActionSubmit(modalConfig.type, comments);
                    }
                    closeModal();
                }}
                type={modalConfig.type}
            />
        </>
    );
};
