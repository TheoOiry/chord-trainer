import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChordTypeProvider } from "./providers/ChordTypeProvider";
import { MidiProvider } from "./providers/MidiProvider";
import { ChordSequenceProvider } from "./providers/ChordSequenceProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChordTypeProvider>
      <MidiProvider>
        <ChordSequenceProvider>
          <App />
        </ChordSequenceProvider>
      </MidiProvider>
    </ChordTypeProvider>
  </StrictMode>,
);
