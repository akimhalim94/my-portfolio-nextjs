"use client";

import { useState } from "react";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";

const QUICK_QUESTIONS = [
  "What are your skills?",
  "What projects have you built?",
  "What is your background?",
  "How can I contact you?",
];

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, status, error } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const handleClick = () => {
    if (isOpen) {
      setMessages([]);
      setInput("");
    } else {
      const audio = new Audio("/audio/chatsound.mp3");
      audio.play().catch((audioError) => {
        console.log("Audio autoplay blocked or failed:", audioError);
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-18 z-50">
      {/* Kotak Chat (Popup) */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 h-[420px] p-4 rounded-2xl bg-gray-950/95 backdrop-blur-xl border border-white/15 shadow-2xl text-white flex flex-col justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="font-semibold text-sm">Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.length === 0 && !error && (
              <div className="flex flex-col gap-4 py-4">
                <div className="text-gray-400 text-center">
                  Hi there! Ask me anything about this site.
                </div>
                <div className="flex flex-col gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage({ text: q })}
                      disabled={isLoading}
                      className="text-left text-gray-300 bg-gray-800/80 hover:bg-blue-600/20 hover:text-white border border-white/10 rounded-xl px-3 py-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-center py-6">
                Something went wrong. Please try again.
              </div>
            )}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-start">
                <div className="max-w-[85%] p-2.5 rounded-xl bg-gray-800 text-gray-200 rounded-bl-none border border-white/10">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none border border-white/10"
                  }`}
                >
                  {m.parts
                    .filter((p) => p.type === "text")
                    .map((p) => p.text)
                    .join("")}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevents page reload and chat closing
              if (!input?.trim() || isLoading) return; // Don't submit empty messages
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex gap-2 border-t border-white/10 pt-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 bg-gray-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Icon Button */}
      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform flex items-center justify-center relative cursor-pointer"
        aria-label="Chat Icon"
      >
        <div
          className="relative w-full h-full"
          style={{
            animation: "waveAnimation 2s ease-in-out infinite",
            transformOrigin: "bottom center",
          }}
        >
          <Image
            src="/chaticon.png"
            alt="Chat Avatar"
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <style jsx>{`
          @keyframes waveAnimation {
            0%,
            100% {
              transform: rotate(0deg);
            }
            20%,
            60% {
              transform: rotate(-15deg);
            }
            40%,
            80% {
              transform: rotate(10deg);
            }
          }
        `}</style>
      </button>
    </div>
  );
}
