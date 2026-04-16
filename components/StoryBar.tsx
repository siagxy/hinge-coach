"use client";
import { Conversation } from "@/lib/types";

const PLACEHOLDER_COLORS = [
  "bg-pink-200", "bg-purple-200", "bg-blue-200", "bg-amber-200", "bg-teal-200", "bg-rose-200"
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function StoryBar({
  conversations,
  onNew,
}: {
  conversations: Conversation[];
  onNew: () => void;
}) {
  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Story</p>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        {/* Add Story button */}
        <button onClick={onNew} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#999" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">Add New</span>
        </button>

        {/* Conversation avatars */}
        {conversations.slice(0, 6).map((c, i) => (
          <div key={c.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-2 ring-[#e84672] ring-offset-2 ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]}`}>
              <span className="text-sm font-bold text-gray-700">{getInitials(c.name)}</span>
            </div>
            <span className="text-[10px] text-gray-600 font-medium w-14 text-center truncate">{c.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
