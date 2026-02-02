import { useChordSequence } from "./hooks/useChordSequence";
import { CHORDS_PER_SEQUENCE } from "./providers/ChordSequenceProvider";

const calculateScore = (totalTime: number, errors: number): number => {
  const accuracyMultiplier = Math.pow(
    1 - errors / (errors + CHORDS_PER_SEQUENCE),
    3,
  );

  const timeScore = 2000 + 8000 * Math.exp(-totalTime / 40);

  const score = Math.round(accuracyMultiplier * timeScore);
  return Math.max(0, score);
};

export const ResultsScreen: React.FC = () => {
  const {
    lastSequenceResults: { errors, totalTime },
  } = useChordSequence();

  const isPerfect = errors === 0;
  const score = calculateScore(totalTime, errors);
  const accuracy = (1 - errors / (errors + CHORDS_PER_SEQUENCE)) * 100;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-600 mb-1">Average time by chord</p>
        <p className="text-2xl font-bold text-blue-600">
          {(totalTime / CHORDS_PER_SEQUENCE).toFixed(2)}s
        </p>
      </div>

      <div
        className={`p-3 rounded-lg text-center ${isPerfect ? "bg-green-50" : "bg-red-50"}`}
      >
        <p className="text-xs text-gray-600 mb-1">Accuracy</p>
        <p
          className={`text-2xl font-bold ${isPerfect ? "text-green-600" : "text-red-600"}`}
        >
          {accuracy.toFixed(2)}%
        </p>
      </div>

      <div className="bg-purple-50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-600 mb-1">Score</p>
        <p className="text-2xl font-bold text-purple-600">{score}</p>
      </div>
    </div>
  );
};
