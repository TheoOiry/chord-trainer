import { useChordTypes } from "./hooks/useChordTypes";
import { type ChordType, CHORD_TYPES } from "./utils/notes";

export const ChordTypeSelector: React.FC = () => {
  const { selectedChordTypes, selectChordTypes } = useChordTypes();

  const toggleChordType = (type: ChordType) => {
    if (selectedChordTypes.includes(type)) {
      selectChordTypes(selectedChordTypes.filter((t) => t !== type));
    } else {
      selectChordTypes([...selectedChordTypes, type]);
    }
  };

  return (
    <>
      <p className="text-sm font-semibold text-gray-700 mb-3">Chord types :</p>
      <div className="flex flex-wrap gap-2">
        {CHORD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggleChordType(type)}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              selectedChordTypes.includes(type)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </>
  );
};
