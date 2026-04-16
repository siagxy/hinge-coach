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
    <div className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 bg-white">
      <div className="flex-1 relative">
        <textarea
          className="w-full bg-gray-50 rounded-2xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-400 transition min-h-[44px] max-h-[120px]"
          rows={1}
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
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        className="w-11 h-11 rounded-full bg-[#e84672] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#d63d65] active:scale-95 transition flex-shrink-0"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-white/70 animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
