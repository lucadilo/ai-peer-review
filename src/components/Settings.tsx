import { ApiKeys } from "../types";
import { X, Key, ShieldCheck } from "lucide-react";

interface SettingsProps {
  keys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  onClose: () => void;
}

export function Settings({ keys, onSave, onClose }: SettingsProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      google: formData.get("google") as string,
      openai: formData.get("openai") as string,
      anthropic: formData.get("anthropic") as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">API Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Google API Key
                <span className="text-[10px] font-normal bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">Optional</span>
              </label>
              <input
                name="google"
                type="password"
                defaultValue={keys.google}
                placeholder="AIza..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-gray-400 ml-1">If empty, the system default key will be used.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                OpenAI API Key
                <span className="text-[10px] font-normal bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">Optional</span>
              </label>
              <input
                name="openai"
                type="password"
                defaultValue={keys.openai}
                placeholder="sk-..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Anthropic API Key
                <span className="text-[10px] font-normal bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 uppercase">Optional</span>
              </label>
              <input
                name="anthropic"
                type="password"
                defaultValue={keys.anthropic}
                placeholder="sk-ant-..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 leading-relaxed">
              Your keys are stored locally in your browser and are only used to communicate with the respective AI providers.
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
