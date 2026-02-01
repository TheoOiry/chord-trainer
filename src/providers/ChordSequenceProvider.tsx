import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ChordSequenceContext,
  type SequenceResults,
} from "../contexts";
import { useMidi } from "../hooks/useMidi";
import { useChordTypes } from "../hooks/useChordTypes";
import type { Chord } from "../utils/notes";

export const CHORDS_PER_SEQUENCE = 15;

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

export const ChordSequenceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { subscribeChord } = useMidi();
  const { selectedChords } = useChordTypes();

  const [chordSequence, setChordSequence] = useState<Chord[]>(() =>
    generateChordSequence(selectedChords, CHORDS_PER_SEQUENCE),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lastSequenceResults, setLastSequenceResults] =
    useState<SequenceResults>({
      totalTime: 0,
      errors: 0,
    });

  const startTimeRef = useRef<number | null>(null);
  const currentChord = chordSequence[currentIndex];

  const replay = useCallback(() => {
    setChordSequence(
      generateChordSequence(selectedChords, CHORDS_PER_SEQUENCE),
    );
    setCurrentIndex(0);
    setErrors(0);

    startTimeRef.current = null;
  }, [selectedChords]);

  const handleChord = useEffectEvent((chord: Chord) => {
    const isCorrect =
      chord.root === currentChord.root && chord.type === currentChord.type;

    if (!isCorrect) {
      setErrors((e) => e + 1);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < chordSequence.length) {
      setCurrentIndex(nextIndex);
      return;
    }

    const totalTime = startTimeRef.current
      ? (Date.now() - startTimeRef.current) / 1000
      : 0;

    setLastSequenceResults({ totalTime, errors });
    replay();
  });

  useEffect(() => subscribeChord(handleChord), [subscribeChord]);

  return (
    <ChordSequenceContext.Provider
      value={{
        lastSequenceResults,
        chordSequence,
        currentIndex,
        currentChord,
        replay,
      }}
    >
      {children}
    </ChordSequenceContext.Provider>
  );
};
