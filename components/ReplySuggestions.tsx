"use client";
import { Reply } from "@/lib/types";

const toneStyles: Record<string, { badge: string; card: string }> = {
  witty: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    card: "hover:bg-amber-50/50 border-amber-100",
  },
  warm: {
    badge: "bg-pink-50 text-[#e84672] border border-pink-200",
    card: "hover:bg-pink-50/50 border-pink-100",
  },
  bold: {
    badge: "bg-purple-50 text-purple-700 border border-purple-200",
    card: "hover:bg-purple-50/50 border-purple-100",
  },
};

export default function ReplySuggestions({
  suggestions,
  onPick,
}: {
  suggestions: Reply[];
  onPick: (r: Reply) => void;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
        Choose your reply
      </p>
      {suggestions.map((r) => {
        const styles = toneStyles[r.tone] ?? toneStyles.warm;
        return (
          <button
            key={r.tone}
            onClick={() => onPick(r)}
            className={`text-left border rounded-2xl p-3.5 transition active:scale-[0.98] bg-white shadow-sm ${styles.card}`}
          >
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-block mb-2 capitalize ${styles.badge}`}
            >
              {r.tone}
            </span>
            <p className="text-sm text-gray-800 leading-relaxed">{r.message}</p>
          </button>
        );
      })}
    </div>
  );
}
