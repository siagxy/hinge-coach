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
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ccc" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 font-medium">Paste his first message below</p>
        <p className="text-xs text-gray-300">Your conversation is saved automatically</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 px-4">
      {history.map((msg, i) => {
        const isHim = msg.display?.sender === "him";
        return (
          <div key={i} className={`flex ${isHim ? "justify-start" : "justify-end"}`}>
            <div className="relative group max-w-[80%]">
              <div
                className={`px-4 py-2.5 text-sm leading-relaxed ${
                  isHim
                    ? "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
                    : "bg-[#e84672] text-white rounded-2xl rounded-br-md"
                }`}
              >
                {msg.display?.text}
              </div>
              {!isHim && (
                <button
                  onClick={() => handleCopy(msg.display?.text ?? "", i)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 text-[10px] text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded-full shadow-sm transition opacity-0 group-hover:opacity-100"
                >
                  {copied === i ? "copied!" : "copy"}
                </button>
              )}
              {/* Read receipt for sent messages */}
              {!isHim && (
                <div className="flex justify-end mt-0.5 mr-1">
                  <svg width="14" height="8" viewBox="0 0 16 10" fill="none">
                    <path d="M1 5l3 3 5-7" stroke="#e84672" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5l3 3 5-7" stroke="#e84672" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
