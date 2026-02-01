import { useContext } from "react";
import { ChordTypeContext } from "../contexts";

export const useChordTypes = () => {
  const context = useContext(ChordTypeContext);
  if (!context) {
    throw new Error("useChordTypes must be used within ChordTypeProvider");
  }
  return context;
};
