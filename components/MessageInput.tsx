"use client";
import { useState } from "react";

export default function MessageInput({
  onSubmit,
  loading,
}: {
  onSubmit: (text: string) => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
      <textarea
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 placeholder-gray-300 transition"
        rows={3}
        placeholder="Paste his message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        className="w-full bg-pink-500 text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-40 hover:bg-pink-600 active:scale-[0.98] transition"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          "get reply suggestions →"
        )}
      </button>
      <p className="text-xs text-center text-gray-300">tap a suggestion to use it as your reply</p>
    </div>
  );
}
