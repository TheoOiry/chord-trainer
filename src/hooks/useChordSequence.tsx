import { useContext } from "react";
import { ChordSequenceContext } from "../contexts";

export const useChordSequence = () => {
  const context = useContext(ChordSequenceContext);
  if (!context) {
    throw new Error(
      "useChordSequence must be used within ChordSequenceProvider",
    );
  }
  return context;
};
