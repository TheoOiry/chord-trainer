import React, { useEffect, useMemo, useState } from "react";
import { useMidi } from "./hooks/useMidi";

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const START_OCTAVE = 3;
const PRESSED_COLOR = "#3580FF";

const BLACK_KEYS: Record<(typeof WHITE_KEYS)[number], string | null> = {
  C: "C#",
  D: "D#",
  E: null,
  F: "F#",
  G: "G#",
  A: "A#",
  B: null,
};

export const Piano: React.FC = () => {
  const { pressedNotes } = useMidi();

  const pressedSet = useMemo(
    () => new Set(pressedNotes.map((note) => `${note.name}${note.octave}`)),
    [pressedNotes],
  );

  const [computedOctaves, setComputedOctaves] = useState<number>(3);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) setComputedOctaves(1);
      else if (w < 768) setComputedOctaves(2);
      else if (w < 1200) setComputedOctaves(3);
      else setComputedOctaves(4);
    };

    calc();

    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const keyWidthPercent = 100 / (7 * computedOctaves);

  const renderOctave = (octave: number) =>
    WHITE_KEYS.map((note) => {
      const whiteNote = `${note}${octave}`;
      const isWhitePressed = pressedSet.has(whiteNote);

      const black = BLACK_KEYS[note];
      const blackNote = black ? `${black}${octave}` : null;
      const isBlackPressed = blackNote ? pressedSet.has(blackNote) : false;

      return (
        <div
          key={whiteNote}
          className="relative flex-1 h-full"
          style={{ width: `${keyWidthPercent}%` }}
        >
          <div
            className="w-full h-full border border-gray-200 flex flex-col items-center justify-end pb-1 transition-colors text-[11px] font-medium text-gray-600"
            style={{
              backgroundColor: isWhitePressed ? PRESSED_COLOR : "white",
            }}
          >
            {note}
            {octave}
          </div>

          {black && (
            <div
              className="absolute top-0 z-10 rounded-b flex items-end justify-center pb-0.5 text-[8px] font-medium text-white"
              style={{
                width: "65%",
                height: "70%",
                left: "67.5%",
                backgroundColor: isBlackPressed ? PRESSED_COLOR : "black",
              }}
            >
              {black}
              {octave}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="flex w-full h-full select-none bg-white">
      {Array.from({ length: computedOctaves }).map((_, i) => (
        <div key={i} className="flex w-full h-full relative">
          {renderOctave(START_OCTAVE + i)}
        </div>
      ))}
    </div>
  );
};
