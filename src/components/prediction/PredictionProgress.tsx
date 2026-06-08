// src/components/prediction/PredictionProgress.tsx
import { Loader2, AlertCircle } from 'lucide-react';

interface PredictionProgressProps {
  isPredicting: boolean;
  predictProgress: number;
  predictError: boolean;
}

export function PredictionProgress({ isPredicting, predictProgress, predictError }: PredictionProgressProps) {
  if (!isPredicting) return null;

  return (
    <div className={`mb-6 border rounded-xl p-4 flex flex-col gap-3 transition-colors ${predictError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
      <div className={`flex justify-between items-center text-sm font-medium ${predictError ? 'text-red-800' : 'text-blue-800'}`}>
        <span className="flex items-center gap-2">
          {predictError ? (
            <AlertCircle size={16} className="text-red-600" />
          ) : (
            <Loader2 size={16} className="animate-spin text-blue-600" />
          )}
          {predictError 
            ? "Failed to predict the remaining data. Check your backend connection or console." 
            : "Predicting the remaining data automatically... (You can switch tabs while this is happening)"}
        </span>
        <span>{predictProgress}%</span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${predictError ? 'bg-red-200' : 'bg-blue-200'}`}>
        <div 
          className={`h-full transition-all duration-300 ease-out ${predictError ? 'bg-red-600' : 'bg-blue-600'}`}
          style={{ width: `${predictProgress}%` }}
        />
      </div>
    </div>
  );
}