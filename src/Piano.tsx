import React from "react";
import type { Note } from "./utils/notes";

interface PianoProps {
  pressedNotes: Note[];
  startOctave?: number;
  octaves?: number;
}

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"] as const;

const BLACK_KEYS: Record<(typeof WHITE_KEYS)[number], string | null> = {
  C: "C#",
  D: "D#",
  E: null,
  F: "F#",
  G: "G#",
  A: "A#",
  B: null,
};

export const Piano: React.FC<PianoProps> = ({
  pressedNotes,
  startOctave = 3,
  octaves = 3,
}) => {
  const pressedSet = new Set(pressedNotes.map((note) => `${note.name}${note.octave}`));

  const renderOctave = (octave: number) =>
    WHITE_KEYS.map((note) => {
      const whiteNote = `${note}${octave}`;
      const isWhitePressed = pressedSet.has(whiteNote);

      const black = BLACK_KEYS[note];
      const blackNote = black ? `${black}${octave}` : null;
      const isBlackPressed = blackNote ? pressedSet.has(blackNote) : false;

      return (
        <div key={whiteNote} className="relative">
          <div
            className={[
              "w-14 h-48 border border-black",
              "flex items-end justify-center",
              "bg-white transition-colors",
              isWhitePressed ? "bg-yellow-300" : "",
            ].join(" ")}
          >
            {/* <span className="mb-1 text-xs text-gray-700">
              {whiteNote}
            </span> */}
          </div>

          {black && (
            <div
              className={[
                "absolute top-0 -right-3",
                "w-8 h-28 z-10",
                "bg-black rounded-b",
                "flex items-end justify-center",
                "transition-colors",
                isBlackPressed ? "bg-orange-500" : "",
              ].join(" ")}
            >
              {/* <span className="mb-1 text-[10px] text-white">
                {blackNote}
              </span> */}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="flex select-none">
      {Array.from({ length: octaves }).map((_, i) => (
        <div key={i} className="flex relative">
          {renderOctave(startOctave + i)}
        </div>
      ))}
    </div>
  );
};
