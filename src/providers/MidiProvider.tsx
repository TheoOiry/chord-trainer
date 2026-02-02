import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as Tone from "tone";
import {
  detectChordFromNotes,
  midiToNote,
  type Chord,
  type Note,
} from "../utils/notes";
import { MidiContext, type ChordLister } from "../contexts";

export const MidiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pressedNotesRef = useRef<Set<number>>(new Set());
  const synthRef = useRef<Tone.Sampler | null>(null);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [pressedNotes, setPressedNotes] = useState<Note[]>([]);

  const onChordListnersRef = useRef<Set<ChordLister>>(new Set());
  const lastChordRef = useRef<Chord | null>(null);

  const subscribeChord = useCallback((callback: ChordLister) => {
    onChordListnersRef.current.add(callback);
    return () => onChordListnersRef.current.delete(callback);
  }, []);

  const initSynth = useCallback(async () => {
    if (synthRef.current) return;

    await Tone.start(); // required on user interaction

    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1.2,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    synthRef.current = sampler;
  }, []);

  const playNote = useCallback(
    (midiNote: number, velocity: number) => {
      if (!synthRef.current) {
        initSynth();
      }

      const note = Tone.Midi(midiNote).toNote();
      const normalizedVelocity = velocity / 127;

      synthRef.current?.triggerAttack(note, Tone.now(), normalizedVelocity);
    },
    [initSynth],
  );

  const stopNote = useCallback((midiNote: number) => {
    const note = Tone.Midi(midiNote).toNote();
    synthRef.current?.triggerRelease(note);
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

      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, [handleMIDIMessage]);

  return (
    <MidiContext.Provider value={{ isReady, pressedNotes, subscribeChord }}>
      {children}
    </MidiContext.Provider>
  );
};
