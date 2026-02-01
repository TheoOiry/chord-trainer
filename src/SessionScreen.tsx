import type { Chord } from "./utils/notes";

export interface SessionScreenProps {
  targetChord: Chord;
  currentIndex: number;
  chordSequence: Chord[];
  chord: Chord | null;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  targetChord,
  currentIndex,
  chordSequence,
  chord,
}) => {
  const total = chordSequence.length || 1;
  const percent = Math.round((currentIndex / total) * 100);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Play this</p>
        <p className="text-4xl md:text-6xl font-extrabold text-blue-600 leading-tight">
          {targetChord.root} {targetChord.type}
        </p>
      </div>

      <div className="w-full">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 py-3">
          {chordSequence.map((c, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 px-3 py-1 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                idx < currentIndex
                  ? "bg-green-100 text-green-800"
                  : idx === currentIndex
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {c.root} {c.type}
            </div>
          ))}
        </div>
      </div>

      {chord && (
        <div className="text-gray-700 text-sm">
          Détecté: <strong>{chord.root} {chord.type}</strong>
        </div>
      )}
    </div>
  );
};
