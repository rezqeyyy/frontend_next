import { Upload, FileText, X } from 'lucide-react';

interface CsvDropzoneProps {
  file: File | null;
  isUploading: boolean;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
}

export function CsvDropzone({ file, isUploading, onFileSelect, onUpload }: CsvDropzoneProps) {
  return (
    <div className={`w-full border-2 border-dashed rounded-2xl p-8 md:p-12 flex flex-col items-center text-center transition-all duration-200 ${
      file ? 'border-[#8b5cf6] bg-[#f5f3ff]/50' : 'border-gray-200 bg-transparent hover:border-[#8b5cf6]/50 hover:bg-gray-50/50'
    }`}>
      {!file ? (
        <>
          <div className="w-14 h-14 bg-[#8b5cf6] rounded-full flex items-center justify-center mb-5 shadow-lg shadow-[#8b5cf6]/20">
            <Upload size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-[17px] font-bold text-gray-800 mb-1.5">Drop your CSV file here</h3>
          <p className="text-sm text-gray-500 mb-6">or click to browse from your computer</p>
          
          <input 
            type="file" 
            accept=".csv" 
            id="csv-upload" 
            className="hidden" 
            onChange={(e) => onFileSelect(e.target.files?.[0] || null)} 
          />
          <label 
            htmlFor="csv-upload" 
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm"
          >
            Select File
          </label>
          
          <p className="text-xs text-gray-400 mt-8 font-medium">Supported format: CSV • Max file size: 10MB</p>
        </>
      ) : (
        <div className="flex flex-col items-center w-full max-w-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} className="text-[#8b5cf6]" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg truncate w-full px-4">{file.name}</h3>
          <p className="text-sm text-gray-500 mb-6">{(file.size / 1024).toFixed(2)} KB</p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button 
              onClick={() => onFileSelect(null)} 
              disabled={isUploading}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-white hover:border-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={onUpload} 
              disabled={isUploading} 
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isUploading ? 'Uploading...' : 'Upload Data'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}