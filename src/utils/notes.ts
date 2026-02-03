export const CHORD_TYPES = [
  "major",
  "minor",
  "7",
  "maj7",
  "m7",
  "dim",
  "aug",
] as const;

export type ChordType = (typeof CHORD_TYPES)[number];

export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export interface Note {
  name: NoteName;
  octave: number;
}

export interface Chord {
  root: NoteName;
  type: ChordType;
}

export const CHORDS: Record<string, ChordType> = {
  "0,4,7": "major",
  "0,3,7": "minor",
  "0,4,7,11": "maj7",
  "0,3,7,10": "m7",
  "0,4,7,10": "7",
  "0,3,6": "dim",
  "0,4,8": "aug",
};

export const ALL_CHORDS: Chord[] = NOTE_NAMES.flatMap((root) => {
  return CHORD_TYPES.map((type) => ({ root, type }));
});

export const midiToNote = (midiNumber: number): Note => {
  const name = NOTE_NAMES[midiNumber % 12];
  const octave = Math.floor(midiNumber / 12) - 1;
  return { name, octave };
};

export const normalizeNotes = (notes: number[]): number[] => {
  return [...new Set(notes.map((n) => n % 12))].sort((a, b) => a - b);
};

// Some chords can have the same set of notes so 
// this function will return all possible chord interpretations for the given notes
export const detectChordsFromNotes = (notes: number[]): Chord[] => {
  if (notes.length < 3) return [];

  const normalized = normalizeNotes(notes);
  return normalized
    .map((root) => {
      const intervals = normalized
        .map((n) => (n - root + 12) % 12)
        .sort((a, b) => a - b);

      const key = intervals.join(",");

      return { root, key };
    })
    .filter(({ key }) => key in CHORDS)
    .map(({ root, key }) => ({ root: NOTE_NAMES[root], type: CHORDS[key] }));
};

export const chordsEqual = (chords: Chord[], other: Chord[]): boolean => {
  if (chords.length !== other.length) return false;

  return chords.every((chord) =>
    other.some(
      (o) => o.root === chord.root && o.type === chord.type,
    )
  );
};