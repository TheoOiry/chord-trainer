import { CHORDS_PER_SESSION } from "./App";

export interface ResultsScreenProps {
  totalTime: number;
  errors: number;
}

function calculateScore(totalTime: number, errors: number): number {
  const accuracyMultiplier = Math.pow(1 - errors / (errors + CHORDS_PER_SESSION), 3);

  const timeScore = 2000 + 8000 * Math.exp(-totalTime / 40);
  
  const score = Math.round(accuracyMultiplier * timeScore);
  return Math.max(0, score);
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  totalTime,
  errors,
}) => {
  const isPerfect = errors === 0;
  const score = calculateScore(totalTime, errors);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
      <div className="flex items-center justify-between gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-1">Average time by chord</p>
            <p className="text-2xl font-bold text-blue-600">
              {(totalTime / CHORDS_PER_SESSION).toFixed(2)}s
            </p>
          </div>

          {(isPerfect && (
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 mb-1">Precision</p>
              <p className="text-2xl font-bold text-green-600">{errors / (errors + CHORDS_PER_SESSION)}</p>
            </div>
          )) || (
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-600 mb-1">Precision</p>
              <p className="text-2xl font-bold text-red-600">{errors / (errors + CHORDS_PER_SESSION)}</p>
            </div>
          )}

          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-1">Score</p>
            <p className="text-2xl font-bold text-purple-600">{score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
