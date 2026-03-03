import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import type { ActionType } from "../types";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comments: string) => void;
    type: ActionType | null;
}

export const ActionModal = ({ isOpen, onClose, onSubmit, type }: ActionModalProps) => {
    const [comments, setComments] = useState("");

    if (!type) return null;

    const isReject = type === 'Reject';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${type} Concept`}
        >
            <div className="flex flex-col gap-2 mb-6">
                <label className="text-[13px] font-semibold text-gray-800">
                    Comments<span className="text-red-500">*</span>
                </label>
                <Textarea
                    placeholder="Enter comments..."
                    className="resize-none h-[120px] rounded-[6px] border-gray-200 text-gray-900"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="text-[13px] bg-[#EFEFEF] hover:bg-[#E5E5E5] text-gray-700 border-none font-medium h-9 px-5 hover:text-gray-800"
                >
                    Cancel
                </Button>
                <Button
                    className={`text-[13px] text-white font-medium h-9 px-6 ${isReject
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-[#581585] hover:bg-[#47116b]'
                        }`}
                    onClick={() => {
                        onSubmit(comments);
                        setComments("");
                    }}
                    disabled={!comments.trim()}
                >
                    {type}
                </Button>
            </div>
        </Modal>
    );
};
