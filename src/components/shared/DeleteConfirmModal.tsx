import { X, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-[460px] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-[18px] font-semibold text-gray-900">Confirm Delete</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning box */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 border border-gray-200 rounded-lg px-4 py-4 border-l-4 border-l-red-500">
            <TriangleAlert className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900 mb-1">This action cannot be undone.</p>
              <p className="text-[14px] text-gray-600">Are you sure you want to delete this item?</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-6 bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>

      </div>
    </div>
  );
};
