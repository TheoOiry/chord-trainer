import { useEffect, useRef, useState } from "react";
import {
  detectChordFromNotes,
  midiToNote,
  type Chord,
  type Note,
} from "../utils/notes";

export function useMidi() {
  const pressedNotesRef = useRef<Set<number>>(new Set());

  const [isReady, setIsReady] = useState<boolean>(false);
  const [pressedNotes, setPressedNotes] = useState<Note[]>([]);
  const [chord, setChord] = useState<Chord | null>(null);

  function handleMIDIMessage(event: MIDIMessageEvent) {
    if (!event.data) return;

    const [status, note, velocity] = event.data;
    const command = status & 0xf0;

    const pressedNotesSet = pressedNotesRef.current;

    if (command === 0x90 && velocity > 0) {
      pressedNotesSet.add(note);
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      pressedNotesSet.delete(note);
    }

    const notesArray = Array.from(pressedNotesSet);

    setPressedNotes(notesArray.map(midiToNote));
    setChord(detectChordFromNotes(notesArray));
  }

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI API non supportée");
      return;
    }

    let midiAccess: MIDIAccess;

    navigator
      .requestMIDIAccess()
      .then((access: MIDIAccess) => {
        midiAccess = access;

        const attachListeners = () => {
            const inputs = [...access.inputs.values()];
            setIsReady(inputs.length !== 0);
            inputs.forEach((input) => (input.onmidimessage = handleMIDIMessage));
        }

        attachListeners();
        access.onstatechange = attachListeners;

      })
      .catch((err: Error) => {
        console.error("MIDI Error", err);
      });

    return () => {
      if (!midiAccess) return;

      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = null;
      }
    };
  }, []);

  return {
    isReady,
    pressedNotes,
    chord,
  };
}
