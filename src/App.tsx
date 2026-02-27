import { useState, useRef, useEffect } from "react";
import { Mode, Message, AIModel, ApiKeys } from "./types";
import { ModeSelector } from "./components/ModeSelector";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Settings } from "./components/Settings";
import { ModelPicker } from "./components/ModelPicker";
import { generate, generateStream, MODELS } from "./services/aiService";
import { Bot, Sparkles, AlertCircle, Settings as SettingsIcon } from "lucide-react";

export default function App() {
  const [mode, setMode] = useState<Mode>(Mode.REVIEW);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const saved = localStorage.getItem("ai_peer_review_keys");
    return saved ? JSON.parse(saved) : {};
  });

  const [modelA, setModelA] = useState<AIModel>(MODELS[1]); // Gemini Flash
  const [modelB, setModelB] = useState<AIModel>(MODELS[0]); // Gemini Pro

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem("ai_peer_review_keys", JSON.stringify(keys));
    setShowSettings(false);
  };

  const extractCodeMetrics = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let totalLength = 0;
    let language = "text";

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match[1]) language = match[1];
      totalLength += match[2].length;
    }

    return {
      codeLength: totalLength || content.length,
      language: language || "unknown",
    };
  };

  const handleSend = async (prompt: string) => {
    if (!prompt.trim() || isProcessing) return;

    setError(null);
    setIsProcessing(true);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      if (mode === Mode.REVIEW) {
        await runReviewMode(prompt);
      } else if (mode === Mode.COMPANION) {
        await runCompanionMode(prompt);
      } else if (mode === Mode.CHALLENGE) {
        await runChallengeMode(prompt);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const runReviewMode = async (prompt: string) => {
    // Step 1: Model A writes code
    const msgAId = Date.now().toString() + "-a";
    setMessages((prev) => [
      ...prev,
      { id: msgAId, role: "modelA", content: "", modelName: `${modelA.name} (Coder)` },
    ]);

    let contentA = "";
    const streamA = generateStream(
      modelA,
      prompt,
      apiKeys,
      "You are a fast coder. Write the code requested by the user. Be direct and provide the code."
    );

    for await (const chunk of streamA) {
      contentA += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgAId ? { ...m, content: contentA } : m))
      );
    }

    // Step 2: Model B reviews and corrects
    const msgBId = Date.now().toString() + "-b";
    setMessages((prev) => [
      ...prev,
      { id: msgBId, role: "modelB", content: "", modelName: `${modelB.name} (Reviewer)` },
    ]);

    let contentB = "";
    const reviewPrompt = `Review the following code generated for the prompt: "${prompt}".\n\nCode:\n${contentA}\n\nAct as a senior reviewer. If there are errors or improvements, point them out and provide the corrected code. If it's perfect, just say so.`;
    const streamB = generateStream(
      modelB,
      reviewPrompt,
      apiKeys,
      "You are a senior code reviewer. Analyze the code, point out flaws, and provide the corrected version."
    );

    for await (const chunk of streamB) {
      contentB += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgBId ? { ...m, content: contentB } : m))
      );
    }
  };

  const runCompanionMode = async (prompt: string) => {
    // Step 1: Model A plans architecture
    const msgAId = Date.now().toString() + "-a";
    setMessages((prev) => [
      ...prev,
      { id: msgAId, role: "modelA", content: "", modelName: `${modelA.name} (Architect)` },
    ]);

    let contentA = "";
    const streamA = generateStream(
      modelA,
      prompt,
      apiKeys,
      "You are a software architect. The user wants to build an app. Provide a clear, step-by-step architecture and plan. Do not write the full code, just the structure and logic."
    );

    for await (const chunk of streamA) {
      contentA += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgAId ? { ...m, content: contentA } : m))
      );
    }

    // Step 2: Model B implements
    const msgBId = Date.now().toString() + "-b";
    setMessages((prev) => [
      ...prev,
      { id: msgBId, role: "modelB", content: "", modelName: `${modelB.name} (Developer)` },
    ]);

    let contentB = "";
    const devPrompt = `Implement the following architecture plan for the prompt: "${prompt}".\n\nPlan:\n${contentA}\n\nWrite the actual code based on this plan.`;
    const streamB = generateStream(
      modelB,
      devPrompt,
      apiKeys,
      "You are a developer. Write the code based on the provided architecture plan."
    );

    for await (const chunk of streamB) {
      contentB += chunk;
      setMessages((prev) =>
        prev.map((m) => (m.id === msgBId ? { ...m, content: contentB } : m))
      );
    }
  };

  const runChallengeMode = async (prompt: string) => {
    // Run both models concurrently
    const msgAId = Date.now().toString() + "-a";
    const msgBId = Date.now().toString() + "-b";
    const challengeId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      { id: msgAId, role: "modelA", content: "Generating...", modelName: modelA.name, challengeId },
      { id: msgBId, role: "modelB", content: "Generating...", modelName: modelB.name, challengeId },
    ]);

    const startA = performance.now();
    const promiseA = generate(
      modelA,
      prompt,
      apiKeys,
      "You are competing in a coding challenge. Write the best possible code for the user's request."
    ).then((content) => {
      const timeMs = performance.now() - startA;
      const metrics = { ...extractCodeMetrics(content), timeMs };
      setMessages((prev) =>
        prev.map((m) => (m.id === msgAId ? { ...m, content, metrics } : m))
      );
    });

    const startB = performance.now();
    const promiseB = generate(
      modelB,
      prompt,
      apiKeys,
      "You are competing in a coding challenge. Write the best possible code for the user's request."
    ).then((content) => {
      const timeMs = performance.now() - startB;
      const metrics = { ...extractCodeMetrics(content), timeMs };
      setMessages((prev) =>
        prev.map((m) => (m.id === msgBId ? { ...m, content, metrics } : m))
      );
    });

    await Promise.all([promiseA, promiseB]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">AI Peer Review</h1>
              <p className="text-xs text-gray-500 font-medium">Multi-Model AI Collaboration & Review</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <ModelPicker
                label="Model A"
                selectedModel={modelA}
                onSelect={setModelA}
                colorClass="text-indigo-600"
              />
              <div className="w-px h-8 bg-gray-200" />
              <ModelPicker
                label="Model B"
                selectedModel={modelB}
                onSelect={setModelB}
                colorClass="text-emerald-600"
              />
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-indigo-600 border border-transparent hover:border-gray-200"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col">
        <ModeSelector selectedMode={mode} onSelectMode={setMode} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-[400px] mb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <Bot className="w-16 h-16 opacity-20" />
              <div className="text-center">
                <p className="text-lg font-medium">Select models and enter a prompt to begin</p>
                <p className="text-sm opacity-60 mt-1">Configure OpenAI/Anthropic keys in settings if needed</p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area */}
        <div className="sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-gray-200 shadow-xl z-10">
          <ChatInput onSend={handleSend} disabled={isProcessing} />
        </div>
      </main>

      {showSettings && (
        <Settings
          keys={apiKeys}
          onSave={saveKeys}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
