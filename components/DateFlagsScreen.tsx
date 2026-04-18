"use client";
import { useState } from "react";
import { Conversation, Flag } from "@/lib/types";

const PRESET_GREEN = [
  "Good listener",
  "Funny",
  "Asks questions",
  "Quick replies",
  "Thoughtful",
  "Good vibes",
  "Makes plans",
  "Respectful",
  "Great banter",
  "Consistent",
];

const PRESET_RED = [
  "Slow replies",
  "Dry texter",
  "Love bombs",
  "Talks about ex",
  "Pushy",
  "Flaky",
  "One-word answers",
  "Too intense",
  "Doesn't ask questions",
  "Gives mixed signals",
];

const PLACEHOLDER_COLORS = [
  "bg-pink-200", "bg-purple-200", "bg-blue-200", "bg-amber-200", "bg-teal-200", "bg-rose-200",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function newId() {
  return crypto.randomUUID();
}

export default function DateFlagsScreen({
  conversation,
  colorIndex,
  onBack,
  onUpdateFlags,
}: {
  conversation: Conversation;
  colorIndex: number;
  onBack: () => void;
  onUpdateFlags: (flags: Flag[]) => void;
}) {
  const [tab, setTab] = useState<"green" | "red">("green");
  const [customText, setCustomText] = useState("");

  const flags = conversation.flags ?? [];
  const greenFlags = flags.filter((f) => f.type === "green");
  const redFlags = flags.filter((f) => f.type === "red");
  const presets = tab === "green" ? PRESET_GREEN : PRESET_RED;
  const activeFlags = tab === "green" ? greenFlags : redFlags;
  const activeFlagLabels = new Set(activeFlags.map((f) => f.label));

  const togglePreset = (label: string) => {
    if (activeFlagLabels.has(label)) {
      onUpdateFlags(flags.filter((f) => !(f.label === label && f.type === tab)));
    } else {
      const newFlag: Flag = { id: newId(), label, type: tab };
      onUpdateFlags([...flags, newFlag]);
    }
  };

  const addCustom = () => {
    if (!customText.trim()) return;
    const newFlag: Flag = {
      id: newId(),
      label: customText.trim(),
      type: tab,
    };
    onUpdateFlags([...flags, newFlag]);
    setCustomText("");
  };

  const removeFlag = (id: string) => {
    onUpdateFlags(flags.filter((f) => f.id !== id));
  };

  const messageCount = conversation.history.length;

  return (
    <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#333" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900 leading-tight">Pros & cons</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
            Green = good signs, red = things to watch
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center pt-8 pb-4 px-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
            PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length]
          }`}
        >
          <span className="text-xl font-extrabold text-gray-700">{getInitials(conversation.name)}</span>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">{conversation.name}</h2>
        <p className="text-xs text-gray-400 mt-1">{messageCount} messages exchanged</p>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
              🟢
            </span>
            <span className="font-bold text-emerald-700">{greenFlags.length}</span>
            <span className="text-gray-400 text-xs">green</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">
              🔴
            </span>
            <span className="font-bold text-red-600">{redFlags.length}</span>
            <span className="text-gray-400 text-xs">red</span>
          </div>
        </div>
      </div>

      <div className="flex mx-4 mb-4 bg-gray-50 rounded-xl p-1">
        <button
          onClick={() => setTab("green")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
            tab === "green" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"
          }`}
        >
          🟢 Green flags
        </button>
        <button
          onClick={() => setTab("red")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
            tab === "red" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"
          }`}
        >
          🔴 Red flags
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {activeFlags.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Added
            </p>
            <div className="flex flex-wrap gap-2">
              {activeFlags.map((f) => (
                <button
                  key={f.id}
                  onClick={() => removeFlag(f.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                    tab === "green" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}
                >
                  {f.label}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Tap to add
          </p>
          <div className="flex flex-wrap gap-2">
            {presets
              .filter((p) => !activeFlagLabels.has(p))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => togglePreset(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95 ${
                    tab === "green"
                      ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
                >
                  + {p}
                </button>
              ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Add your own
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={tab === "green" ? "e.g. Remembers details" : "e.g. Cancels last minute"}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
            />
            <button
              onClick={addCustom}
              disabled={!customText.trim()}
              className={`px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition ${
                tab === "green" ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
