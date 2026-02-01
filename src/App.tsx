import { useMidi } from "./hooks/useMidi";
import { SessionScreen } from "./SessionScreen";
import { Piano } from "./Piano";
import { ChordTypeSelector } from "./ChordTypeSelector";
import { useChordSequence } from "./hooks/useChordSequence";
import { ResultsScreen } from "./ResultsScreen";

export default function App() {
  const { isReady } = useMidi();
  const { replay } = useChordSequence();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Chord Trainer</h1>

        <div className="flex items-center gap-3">
          {!isReady && (
            <span className="text-sm text-red-600">
              Connect a MIDI keyboard
            </span>
          )}

          <button
            onClick={replay}
            className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition-colors text-sm"
          >
            ↻ Replay
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <ChordTypeSelector />
          </div>
          <div className="flex-1 flex items-center justify-end">
            <ResultsScreen />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4">
          <SessionScreen />
        </div>

        <div className="h-56 bg-white rounded-2xl shadow p-4 overflow-hidden">
          <p className="text-sm text-gray-600 mb-2">Preview keyboard</p>
          <div className="w-full h-[calc(100%-2rem)]">
            <Piano />
          </div>
        </div>
      </div>
    </div>
  );
}
