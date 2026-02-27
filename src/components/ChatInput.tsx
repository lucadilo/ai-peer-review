import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mt-4">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Enter a coding topic (e.g., create a calculator app...)"
          disabled={disabled}
          className="w-full p-4 pr-14 rounded-2xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none outline-none transition-all disabled:opacity-50 disabled:bg-gray-50 bg-white min-h-[60px] max-h-[200px]"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95 shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
