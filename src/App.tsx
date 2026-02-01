import { useEffect, useState, useRef, useCallback } from "react";
import { useMidi } from "./hooks/useMidi";
import {
  ALL_CHORDS,
  CHORD_TYPES,
  type Chord,
  type ChordType,
} from "./utils/notes";
import { ResultsScreen } from "./ResultsScreen";
import { SessionScreen } from "./SessionScreen";
import { Piano } from "./Piano";
import { ChordTypeSelector } from "./ChordTypeSelector";

export const CHORDS_PER_SESSION = 10;

function getRandomChord(chords: Chord[], exclude?: Chord) {
  let chord;
  do {
    chord = chords[Math.floor(Math.random() * chords.length)];
  } while (
    exclude &&
    chord.root === exclude.root &&
    chord.type === exclude.type
  );
  return chord;
}

function generateChordSequence(chords: Chord[], count: number) {
  const sequence: Chord[] = [];
  for (let i = 0; i < count; i++) {
    sequence.push(getRandomChord(chords, sequence[sequence.length - 1]));
  }
  return sequence;
}

export default function App() {
  const { pressedNotes, chord, isReady } = useMidi();

  const [selectedChordTypes, setSelectedChordTypes] = useState<ChordType[]>([
    ...CHORD_TYPES,
  ]);

  const filteredChords = ALL_CHORDS.filter((c) =>
    selectedChordTypes.includes(c.type),
  );

  const [chordSequence, setChordSequence] = useState<Chord[]>(() =>
    generateChordSequence(filteredChords, CHORDS_PER_SESSION),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);

  const [lastSessionResults, setLastSessionResults] = useState<{
    totalTime: number;
    errors: number;
  } | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const lastChordRef = useRef<Chord | null>(null);

  const targetChord = chordSequence[currentIndex];
  const isSessionActive = currentIndex < chordSequence.length;

  const replay = useCallback(() => {
    setChordSequence(generateChordSequence(filteredChords, CHORDS_PER_SESSION));
    setCurrentIndex(0);
    setErrors(0);

    startTimeRef.current = null;
    lastChordRef.current = null;
  }, [filteredChords]);

  const handleChordCorrect = useCallback(() => {
    if (
      lastChordRef.current?.root === targetChord.root &&
      lastChordRef.current?.type === targetChord.type
    ) {
      return;
    }

    if (startTimeRef.current === null && currentIndex === 0) {
      startTimeRef.current = Date.now();
    }

    lastChordRef.current = { ...targetChord };

    const nextIndex = currentIndex + 1;
    if (nextIndex < chordSequence.length) {
      setCurrentIndex(nextIndex);
      return;
    }

    const totalTime = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
    setLastSessionResults({
      totalTime,
      errors,
    });

    replay();
  }, [chordSequence.length, currentIndex, errors, replay, targetChord]);

  const handleChordError = useCallback(() => {
    if (
      lastChordRef.current?.root === chord?.root &&
      lastChordRef.current?.type === chord?.type
    ) {
      return;
    }

    lastChordRef.current = chord || null;
    setErrors((e) => e + 1);
  }, [chord]);

  useEffect(() => {
    if (!chord || !isSessionActive) { 
      lastChordRef.current = null;
      return;
    }

    const isCorrect =
      chord.root === targetChord.root && chord.type === targetChord.type;

    if (isCorrect) {
      handleChordCorrect();
    } else {
      handleChordError();
    }
  }, [
    chord,
    targetChord,
    chordSequence,
    isSessionActive,
    handleChordCorrect,
    handleChordError,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Chord Trainer</h1>

        <div className="flex items-center gap-3">
          {!isReady && (
            <span className="text-sm text-red-600">Connect a MIDI keyboard</span>
          )}

          <button
            onClick={replay}
            className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition-colors text-sm"
          >
            ↻ Replay
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4">
            <ChordTypeSelector
              selectedTypes={selectedChordTypes}
              onSelectionChange={setSelectedChordTypes}
            />

            <SessionScreen
              targetChord={targetChord}
              currentIndex={currentIndex}
              chordSequence={chordSequence}
              chord={chord}
            />

            {lastSessionResults && (
              <ResultsScreen
                totalTime={lastSessionResults.totalTime}
                errors={lastSessionResults.errors}
              />
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
          <div className="w-full bg-white rounded-2xl shadow p-4 overflow-hidden">
            <p className="text-sm text-gray-600 mb-2">Preview keyboard</p>
            <Piano pressedNotes={pressedNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}
