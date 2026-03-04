import { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

interface BulkUploadProps {
    file: File | null;
    error: string | null;
    success: boolean;
    isUploading: boolean;
    isDownloadingTemplate: boolean;
    uploadFile: (file: File) => void;
    handleDownloadTemplate: () => void;
}

export function BulkUpload({
    file,
    error,
    success,
    isUploading,
    isDownloadingTemplate,
    uploadFile,
    handleDownloadTemplate
}: BulkUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            uploadFile(selectedFile);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            uploadFile(droppedFile);
        }
    };

    return (
        <div className="bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-200 z-10 flex flex-col p-8 w-full mt-2">
            <div className="mb-6 flex justify-start items-center">
                <button
                    onClick={handleDownloadTemplate}
                    disabled={isDownloadingTemplate}
                    className="text-[#4b286d] font-semibold text-[14px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {isDownloadingTemplate && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Download Sample Template
                </button>
            </div>

            <div
                className={`border-2 border-dashed ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg ${isDragActive ? 'bg-[#FBF0FF]' : 'bg-[#f9fafb] hover:bg-gray-50'} flex flex-col items-center justify-center p-12 min-h-[300px] cursor-pointer transition-colors`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                />
                {isUploading ? (
                    <div className="flex flex-col items-center text-[#4b286d]">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="font-semibold">Uploading...</p>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center text-[#56b47c]">
                        <p className="font-semibold text-[18px]">Upload Successful!</p>
                        <p className="text-sm mt-1 mb-6">{file?.name}</p>
                        <Button
                            variant="outline"
                            className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-medium px-6 py-2 h-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            Browse to Reupload
                        </Button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-[18px] font-semibold text-gray-900 mb-2 mt-4">Drag and drop your file</h3>
                        <p className="text-[14px] text-gray-500 mb-6">Acceptable File Types: Excel (.xlsx)</p>
                        <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-medium px-6 py-2 mb-4 h-auto pointer-events-none">
                            Browse to Upload
                        </Button>
                        {file && !error && <p className="text-sm text-[#56b47c] font-medium mt-2">Selected: {file.name}</p>}
                        {error && <p className="text-sm text-red-500 font-medium mt-2">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
}
