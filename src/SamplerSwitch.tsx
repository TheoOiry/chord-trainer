import React from "react";
import { useSampler } from "./hooks/useSampler";

const SamplerSwitch: React.FC = () => {
  const { isSamplerEnabled, toggleIsSamplerEnable } = useSampler();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sound</span>
      <button
        onClick={toggleIsSamplerEnable}
        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
          isSamplerEnabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            isSamplerEnabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default SamplerSwitch;
