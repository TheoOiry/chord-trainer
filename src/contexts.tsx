import { createContext } from "react";
import type { Chord, ChordType, Note } from "./utils/notes";

interface ChordTypeContextType {
  selectedChordTypes: ChordType[];
  selectedChords: Chord[];

  selectChordTypes: (types: ChordType[]) => void;
}

export const ChordTypeContext = createContext<ChordTypeContextType | undefined>(
  undefined,
);

export type ChordLister = (chord: Chord) => void;

interface MidiContextType {
  isReady: boolean;
  pressedNotes: Note[];
  subscribeChord: (callback: ChordLister) => () => void;
}

export const MidiContext = createContext<MidiContextType | undefined>(undefined);

export interface SequenceResults {
  totalTime: number;
  errors: number;
}

interface ChordSequenceContextProps {
  currentIndex: number,
  lastSequenceResults: SequenceResults,
  chordSequence: Chord[],
  currentChord: Chord,
  replay: () => void,
}

export const ChordSequenceContext = createContext<ChordSequenceContextProps | undefined>(
    undefined
);
