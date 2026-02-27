import { Message } from "../types";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, User, Cpu, Zap, Activity, Code2, Clock } from "lucide-react";

function MessageItem({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex gap-4 p-6 rounded-2xl shadow-sm border h-full ${
        msg.role === "user"
          ? "bg-white border-gray-200 ml-auto max-w-[85%]"
          : msg.role === "modelA"
          ? "bg-indigo-50/50 border-indigo-100 mr-auto w-full"
          : msg.role === "modelB"
          ? "bg-emerald-50/50 border-emerald-100 mr-auto w-full"
          : "bg-gray-50 border-gray-200 mx-auto w-full text-center text-gray-500 italic"
      }`}
    >
      {msg.role !== "system" && (
        <div className="flex-shrink-0 mt-1">
          {msg.role === "user" ? (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          ) : msg.role === "modelA" ? (
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
              <Cpu className="w-6 h-6 text-indigo-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        {msg.role !== "system" && msg.role !== "user" && (
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`font-semibold text-sm px-3 py-1 rounded-full ${
                msg.role === "modelA"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {msg.modelName || (msg.role === "modelA" ? "Model A" : "Model B")}
            </span>
          </div>
        )}

        <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
          <Markdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="rounded-xl overflow-hidden my-4 border border-gray-800">
                    <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex justify-between items-center">
                      <span>{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: 0 }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code {...props} className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded-md text-sm font-mono">
                    {children}
                  </code>
                );
              },
            }}
          >
            {msg.content}
          </Markdown>
        </div>

        {msg.metrics && (
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Time: <strong>{(msg.metrics.timeMs / 1000).toFixed(2)}s</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Code2 className="w-4 h-4 text-purple-500" />
              <span>Length: <strong>{msg.metrics.codeLength} chars</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
              <Activity className="w-4 h-4 text-orange-500" />
              <span>Language: <strong className="capitalize">{msg.metrics.language}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const groupedMessages: (Message | Message[])[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.challengeId) {
      const lastGroup = groupedMessages[groupedMessages.length - 1];
      if (Array.isArray(lastGroup) && lastGroup[0].challengeId === msg.challengeId) {
        lastGroup.push(msg);
      } else {
        groupedMessages.push([msg]);
      }
    } else {
      groupedMessages.push(msg);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto pb-24">
      {groupedMessages.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <div key={`challenge-${item[0].challengeId}`} className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {item.map((msg) => (
                <MessageItem key={msg.id} msg={msg} />
              ))}
            </div>
          );
        } else {
          return <MessageItem key={item.id} msg={item} />;
        }
      })}
    </div>
  );
}
