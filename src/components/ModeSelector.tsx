import { Mode } from "../types";
import { Eye, Users, Swords } from "lucide-react";

interface ModeSelectorProps {
  selectedMode: Mode;
  onSelectMode: (mode: Mode) => void;
}

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  const modes = [
    {
      id: Mode.REVIEW,
      name: "Review",
      description: "Model A writes, Model B reviews and corrects.",
      icon: <Eye className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      activeColor: "bg-blue-100 border-blue-500 ring-2 ring-blue-500",
    },
    {
      id: Mode.COMPANION,
      name: "Companion",
      description: "Models work together by reasoning during development.",
      icon: <Users className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      activeColor: "bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500",
    },
    {
      id: Mode.CHALLENGE,
      name: "Challenge",
      description: "Models build independently. You decide the winner.",
      icon: <Swords className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      activeColor: "bg-purple-100 border-purple-500 ring-2 ring-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={`flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left ${
            selectedMode === mode.id ? mode.activeColor : `${mode.color} hover:shadow-md opacity-70 hover:opacity-100`
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            {mode.icon}
            <span className="font-semibold text-lg">{mode.name}</span>
          </div>
          <p className="text-sm opacity-80">{mode.description}</p>
        </button>
      ))}
    </div>
  );
}
