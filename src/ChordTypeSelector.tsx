import { type ChordType, CHORD_TYPES } from "./utils/notes";

export interface ChordTypeSelectorProps {
  selectedTypes: ChordType[];
  onSelectionChange: (types: ChordType[]) => void;
}

export const ChordTypeSelector: React.FC<ChordTypeSelectorProps> = ({
  selectedTypes,
  onSelectionChange,
}) => {

  const toggleChordType = (type: ChordType) => {
    if (selectedTypes.includes(type)) {
      onSelectionChange(selectedTypes.filter((t) => t !== type));
    } else {
      onSelectionChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-md p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        Types d'accords :
      </p>
      <div className="flex flex-wrap gap-2">
        {CHORD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggleChordType(type)}
            className={`px-3 py-2 rounded-lg font-medium transition-all ${
              selectedTypes.includes(type)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};
