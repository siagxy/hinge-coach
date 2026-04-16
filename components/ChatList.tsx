"use client";
import { Conversation } from "@/lib/types";

const PLACEHOLDER_COLORS = [
  "bg-pink-200", "bg-purple-200", "bg-blue-200", "bg-amber-200", "bg-teal-200", "bg-rose-200"
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getTimeLabel(convo: Conversation): string {
  const len = convo.history.length;
  if (len === 0) return "new";
  // Simple relative labels
  const labels = ["just now", "2m ago", "11:45 am", "8:41 am", "7:22 am", "yesterday", "3 days ago"];
  return labels[len % labels.length] || "recently";
}

function getLastMessage(convo: Conversation): string {
  if (convo.history.length === 0) return "Start a conversation...";
  const last = convo.history[convo.history.length - 1];
  return last.display?.text ?? last.content;
}

export default function ChatList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ccc" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 font-medium">No conversations yet</p>
        <p className="text-xs text-gray-300">Tap "Add New" above to start one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chat</p>
        <button className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      </div>

      {conversations.map((c, i) => {
        const lastMsg = getLastMessage(c);
        const timeLabel = getTimeLabel(c);
        const hasMessages = c.history.length > 0;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition hover:bg-gray-50 active:bg-gray-100 ${
              c.id === activeId ? "bg-pink-50/50" : ""
            }`}
          >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]}`}>
              <span className="text-sm font-bold text-gray-700">{getInitials(c.name)}</span>
            </div>

            {/* Name + last message */}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg}</p>
            </div>

            {/* Timestamp + read receipt */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-gray-400">{timeLabel}</span>
              {hasMessages && (
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M1 5l3 3 5-7" stroke="#e84672" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 5l3 3 5-7" stroke="#e84672" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
