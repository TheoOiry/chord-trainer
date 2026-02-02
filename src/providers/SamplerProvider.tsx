import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SamplerContext } from "../contexts";
import * as Tone from "tone";

const SAMPLER_CONFIG: Partial<Tone.SamplerOptions> = {
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
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
};

export const SamplerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSamplerEnabled, setIsSamplerEnabled] = useState(false);

  const samplerRef = useRef<Tone.Sampler | null>(null);

  const initSampler = useCallback(async () => {
    await Tone.start();

    const sampler = new Tone.Sampler(SAMPLER_CONFIG).toDestination();
    sampler.context.lookAhead = 0;

    samplerRef.current = sampler;
  }, []);

  // We need a button to enable audio cleanly cause most browsers will not play any audio until a user clicks something.
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
  const toggleIsSamplerEnable = useCallback(async () => {
    setIsSamplerEnabled((isEnabled) => {
      if (isEnabled) {
        samplerRef.current?.dispose();
        samplerRef.current = null;
      } else {
        initSampler();
      }

      return !isEnabled;
    });
  }, [initSampler]);

  const playNote = useCallback(async (midiNote: number, velocity: number) => {
    if (!samplerRef.current) return;

    const note = Tone.Midi(midiNote).toNote();
    const normalizedVelocity = velocity / 127;

    samplerRef.current.triggerAttack(
      note,
      Tone.immediate(),
      normalizedVelocity,
    );
  }, []);

  const stopNote = useCallback((midiNote: number) => {
    if (!samplerRef.current) return;

    const note = Tone.Midi(midiNote).toNote();
    samplerRef.current.triggerRelease(note);
  }, []);

  useEffect(() => {
    return () => {
      samplerRef.current?.dispose();
      samplerRef.current = null;
    };
  }, []);

  return (
    <SamplerContext.Provider
      value={{
        isSamplerEnabled,
        toggleIsSamplerEnable,
        playNote,
        stopNote,
      }}
    >
      {children}
    </SamplerContext.Provider>
  );
};
