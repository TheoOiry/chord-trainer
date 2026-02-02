import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChordTypeProvider } from "./providers/ChordTypeProvider";
import { MidiProvider } from "./providers/MidiProvider";
import { ChordSequenceProvider } from "./providers/ChordSequenceProvider.tsx";
import { SamplerProvider } from "./providers/SamplerProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChordTypeProvider>
      <SamplerProvider>
        <MidiProvider>
          <ChordSequenceProvider>
            <App />
          </ChordSequenceProvider>
        </MidiProvider>
      </SamplerProvider>
    </ChordTypeProvider>
  </StrictMode>,
);
