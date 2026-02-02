import { useContext } from "react";
import { SamplerContext } from "../contexts";

export function useSampler() {
  const context = useContext(SamplerContext);
  if (!context) {
    throw new Error("useSampler must be used within SamplerProvider");
  }
  return context;
}
