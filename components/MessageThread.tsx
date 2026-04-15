"use client";
import { useState } from "react";
import { Message } from "@/lib/types";

export default function MessageThread({ history }: { history: Message[] }) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
          💬
        </div>
        <p className="text-sm text-gray-400">Paste his first message below</p>
        <p className="text-xs text-gray-300">Your conversation is saved automatically</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 py-4">
      {history.map((msg, i) => {
        const isHim = msg.display?.sender === "him";
        return (
          <div key={i} className={`flex flex-col ${isHim ? "items-start" : "items-end"}`}>
            <span className="text-[11px] text-gray-300 mb-1 px-1">
              {isHim ? "him" : "you"}
            </span>
            <div className="relative group">
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isHim
                    ? "bg-gray-100 text-gray-800 rounded-bl-sm"
                    : "bg-pink-500 text-white rounded-br-sm"
                }`}
              >
                {msg.display?.text}
              </div>
              {!isHim && (
                <button
                  onClick={() => handleCopy(msg.display?.text ?? "", i)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 text-[10px] text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded-full shadow-sm transition"
                >
                  {copied === i ? "copied!" : "copy"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}