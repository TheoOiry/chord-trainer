import React, { useState, useCallback, type ReactNode, useMemo } from "react";
import { ALL_CHORDS, CHORD_TYPES, type ChordType } from "../utils/notes";
import { ChordTypeContext } from "../contexts";

const STORAGE_KEY = "chord-trainer:selectedChordTypes";

const loadSelectedChordTypes = (): ChordType[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [...CHORD_TYPES];

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    console.error(`Failed to parse ${STORAGE_KEY} JSON:`, stored);
  }
  console.error(`Bad format for ${STORAGE_KEY}`, stored);

  return [...CHORD_TYPES];
};

export const ChordTypeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedChordTypes, setSelectedChordTypes] = useState<ChordType[]>(
    loadSelectedChordTypes(),
  );

  const selectChordTypes = useCallback((types: ChordType[]) => {
    if (types.length === 0) return;

    setSelectedChordTypes(types);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
  }, []);

  const selectedChords = useMemo(
    () => ALL_CHORDS.filter((c) => selectedChordTypes.includes(c.type)),
    [selectedChordTypes],
  );

  return (
    <ChordTypeContext.Provider
      value={{ selectedChordTypes, selectedChords, selectChordTypes }}
    >
      {children}
    </ChordTypeContext.Provider>
  );
};
