import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  detectChordFromNotes,
  midiToNote,
  type Chord,
  type Note,
} from "../utils/notes";
import { MidiContext, type ChordLister } from "../contexts";
import { useSampler } from "../hooks/useSampler";

export const MidiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pressedNotesRef = useRef<Set<number>>(new Set());

  const [isReady, setIsReady] = useState<boolean>(false);
  const [pressedNotes, setPressedNotes] = useState<Note[]>([]);

  const onChordListnersRef = useRef<Set<ChordLister>>(new Set());
  const lastChordRef = useRef<Chord | null>(null);

  const { playNote, stopNote } = useSampler();

  const subscribeChord = useCallback((callback: ChordLister) => {
    onChordListnersRef.current.add(callback);
    return () => onChordListnersRef.current.delete(callback);
  }, []);

  const handleMIDIMessage = useCallback(
    (event: MIDIMessageEvent) => {
      if (!event.data) return;

      const [status, note, velocity] = event.data;
      const command = status & 0xf0;

      const pressedNotesSet = pressedNotesRef.current;

      if (command === 0x90 && velocity > 0) {
        pressedNotesSet.add(note);
        playNote(note, velocity);
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        pressedNotesSet.delete(note);
        stopNote(note);
      }

      const notesArray = Array.from(pressedNotesSet);

      setPressedNotes(notesArray.map(midiToNote));

      const chord = detectChordFromNotes(notesArray);
      if (!chord) {
        lastChordRef.current = chord;
        return;
      }

      if (
        lastChordRef.current &&
        chord.root === lastChordRef.current.root &&
        chord.type === lastChordRef.current.type
      )
        return;

      lastChordRef.current = chord;

      onChordListnersRef.current.forEach((callback) => callback(chord));
    },
    [playNote, stopNote],
  );

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
        };

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
  }, [handleMIDIMessage]);

  return (
    <MidiContext.Provider value={{ isReady, pressedNotes, subscribeChord }}>
      {children}
    </MidiContext.Provider>
  );
};
