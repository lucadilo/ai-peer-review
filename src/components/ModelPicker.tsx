import { AIModel, MODELS } from "../services/aiService";
import { ChevronDown } from "lucide-react";

interface ModelPickerProps {
  label: string;
  selectedModel: AIModel;
  onSelect: (model: AIModel) => void;
  colorClass: string;
}

export function ModelPicker({ label, selectedModel, onSelect, colorClass }: ModelPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">{label}</label>
      <div className="relative group">
        <select
          value={selectedModel.id}
          onChange={(e) => {
            const model = MODELS.find((m) => m.id === e.target.value);
            if (model) onSelect(model);
          }}
          className={`appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all cursor-pointer ${colorClass}`}
        >
          {MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
}
