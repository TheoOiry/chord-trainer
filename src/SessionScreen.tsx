import { useChordSequence } from "./hooks/useChordSequence";

export const SessionScreen: React.FC = () => {
  const { chordSequence, currentChord, currentIndex } = useChordSequence();

  const total = chordSequence.length || 1;
  const percent = Math.round((currentIndex / total) * 100);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Play this</p>
        <p className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {currentChord.root} {currentChord.type}
        </p>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 py-3 justify-center w-full">
        {chordSequence.map((c, idx) => (
          <div
            key={idx}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
              idx < currentIndex
                ? "bg-gray-100 text-gray-700"
                : idx === currentIndex
                  ? "bg-gray-900 text-white scale-105"
                  : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            {c.root}
            {c.type}
          </div>
        ))}
      </div>
    </div>
  );
};
