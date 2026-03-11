import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} b`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} mb`;
}

interface BulkUploadDrawerProps {
  isOpen:   boolean;
  onClose:  () => void;
  onUpload: (file: File) => void;
}

export const BulkUploadDrawer = ({ isOpen, onClose, onUpload }: BulkUploadDrawerProps) => {
  const [file, setFile]       = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) setFile(null); }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-[540px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-8 pt-8 pb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold text-gray-900">Bulk Upload</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="h-px bg-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-6 flex flex-col gap-5">
          <button
            onClick={() => { const a = document.createElement("a"); a.href = "/bulk-upload-template.xlsx"; a.download = "bulk-upload-template.xlsx"; a.click(); }}
            className="text-[14px] font-medium text-primary hover:underline text-left w-fit"
          >
            Download Sample Template
          </button>

          <div className="flex flex-col gap-2">
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 py-14 px-8 transition-colors ${dragging ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50/30"}`}
            >
              <p className="text-[15px] font-semibold text-gray-800">Drag and drop your file</p>
              <div className="text-center text-[13px] text-gray-400 leading-relaxed">
                <p>Acceptable File Types: JPG, PNG, GIF</p>
                <p>File limit: 20mb</p>
              </div>
              <Button variant="outline" onClick={() => inputRef.current?.click()} className="mt-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-[13px] px-5">
                {file ? "Browse to Re-upload" : "Browse to Upload"}
              </Button>
              <input ref={inputRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </div>

            {file && (
              <div className="flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg bg-white">
                <span className="text-[13px] text-gray-700">{file.name}<span className="text-gray-400 ml-1.5">({formatSize(file.size)})</span></span>
                <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="px-6 text-[14px] border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
          <Button onClick={() => { if (!file) return; onUpload(file); onClose(); }} disabled={!file} className="bg-primary hover:bg-primary/90 text-white px-6 text-[14px] disabled:opacity-50">Upload</Button>
        </div>
      </div>
    </>
  );
};
