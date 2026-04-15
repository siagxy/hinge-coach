"use client";
import { Reply } from "@/lib/types";

const toneStyles: Record<string, { badge: string; card: string }> = {
  witty: {
    badge: "bg-amber-100 text-amber-800",
    card: "hover:bg-amber-50 border-amber-100",
  },
  warm: {
    badge: "bg-pink-100 text-pink-800",
    card: "hover:bg-pink-50 border-pink-100",
  },
  bold: {
    badge: "bg-purple-100 text-purple-800",
    card: "hover:bg-purple-50 border-purple-100",
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
    <div className="flex flex-col gap-2 py-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-300 mb-1">
        choose your reply
      </p>
      {suggestions.map((r) => {
        const styles = toneStyles[r.tone] ?? toneStyles.warm;
        return (
          <button
            key={r.tone}
            onClick={() => onPick(r)}
            className={`text-left border rounded-2xl p-4 transition active:scale-[0.98] bg-white ${styles.card}`}
          >
            <span
              className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full inline-block mb-2 capitalize ${styles.badge}`}
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
