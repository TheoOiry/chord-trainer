import { useContext } from "react";
import { MidiContext } from "../contexts";

export function useMidi() {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error("useMidi must be used within MidiProvider");
  }
  return context;
}
