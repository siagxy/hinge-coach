"use client";
import { useState } from "react";
import { UserProfile } from "@/lib/types";

const VIBES = [
  { id: "flirty", label: "Flirty", desc: "Playful, teasing, fun", icon: "😏" },
  { id: "chill", label: "Chill", desc: "Relaxed, low-key, cool", icon: "😎" },
  { id: "witty", label: "Witty", desc: "Clever, quick humor", icon: "🧠" },
  { id: "warm", label: "Warm", desc: "Genuine, kind, open", icon: "🤗" },
  { id: "bold", label: "Bold", desc: "Direct, confident, leading", icon: "🔥" },
];

const LENGTHS = [
  { id: "short", label: "Short & snappy", desc: "1 sentence max" },
  { id: "medium", label: "Conversational", desc: "1-2 sentences" },
  { id: "long", label: "Detailed", desc: "2-4 sentences" },
];

export default function ToneSetup({
  onComplete,
}: {
  onComplete: (profile: UserProfile) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState("");
  const [length, setLength] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [haha, setHaha] = useState(true);
  const [exampleText, setExampleText] = useState("");
  const [examples, setExamples] = useState<string[]>([]);

  const totalSteps = 4;

  const addExample = () => {
    if (exampleText.trim() && examples.length < 5) {
      setExamples((prev) => [...prev, exampleText.trim()]);
      setExampleText("");
    }
  };

  const removeExample = (i: number) => {
    setExamples((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return vibe !== "";
    if (step === 2) return length !== "";
    return true;
  };

  const handleFinish = () => {
    onComplete({
      name: name.trim(),
      age: age.trim() || "unknown",
      bio: bio.trim(),
      vibe,
      length,
      emoji,
      haha,
      examples,
    });
  };

  return (
    <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#e84672] flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#e84672]">Chat Coach</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-4">Set up your style</h1>
        <p className="text-sm text-gray-400 mt-1">So your AI replies sound like you</p>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                i <= step ? "bg-[#e84672]" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6">
        {/* Step 0: Name & basics */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Your first name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Sia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Your age
              </label>
              <input
                type="text"
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                A little about you <span className="text-gray-300 normal-case">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. Engineer in Seattle, love climbing and dancing"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
              />
            </div>
          </div>
        )}

        {/* Step 1: Vibe picker */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-bold text-gray-900 mb-1">What's your texting vibe?</p>
            <p className="text-xs text-gray-400 mb-2">Pick the one that fits you best</p>
            {VIBES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition active:scale-[0.98] ${
                  vibe === v.id
                    ? "border-[#e84672] bg-pink-50/50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <span className="text-2xl">{v.icon}</span>
                <div className="text-left">
                  <p className={`text-sm font-bold ${vibe === v.id ? "text-[#e84672]" : "text-gray-900"}`}>
                    {v.label}
                  </p>
                  <p className="text-xs text-gray-400">{v.desc}</p>
                </div>
                {vibe === v.id && (
                  <svg className="ml-auto" width="20" height="20" viewBox="0 0 20 20" fill="#e84672">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Message length + toggles */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-base font-bold text-gray-900 mb-1">How long are your messages?</p>
              <p className="text-xs text-gray-400 mb-3">Pick your typical message length</p>
              <div className="flex flex-col gap-2.5">
                {LENGTHS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition active:scale-[0.98] ${
                      length === l.id
                        ? "border-[#e84672] bg-pink-50/50"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-bold ${length === l.id ? "text-[#e84672]" : "text-gray-900"}`}>
                        {l.label}
                      </p>
                      <p className="text-xs text-gray-400">{l.desc}</p>
                    </div>
                    {length === l.id && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="#e84672">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setEmoji(!emoji)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  emoji ? "border-[#e84672] bg-pink-50/30" : "border-gray-100"
                }`}
              >
                <span className="text-sm text-gray-700">I use emojis</span>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${emoji ? "bg-[#e84672]" : "bg-gray-200"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${emoji ? "translate-x-4.5" : "translate-x-0.5"}`} />
                </div>
              </button>
              <button
                onClick={() => setHaha(!haha)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  haha ? "border-[#e84672] bg-pink-50/30" : "border-gray-100"
                }`}
              >
                <span className="text-sm text-gray-700">I say &quot;haha&quot; / &quot;lol&quot;</span>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${haha ? "bg-[#e84672]" : "bg-gray-200"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${haha ? "translate-x-4.5" : "translate-x-0.5"}`} />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Example messages */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base font-bold text-gray-900 mb-1">Paste some example texts</p>
              <p className="text-xs text-gray-400 mb-3">
                Add a few messages you've actually sent so the AI can match your style.
                This is optional but makes replies way better.
              </p>
            </div>

            {/* Example input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste a text you've sent..."
                value={exampleText}
                onChange={(e) => setExampleText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addExample()}
                className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
              />
              <button
                onClick={addExample}
                disabled={!exampleText.trim() || examples.length >= 5}
                className="bg-[#e84672] text-white px-4 rounded-xl text-sm font-semibold disabled:opacity-30 transition"
              >
                Add
              </button>
            </div>

            {/* Examples list */}
            {examples.length > 0 && (
              <div className="flex flex-col gap-2">
                {examples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <p className="flex-1 text-sm text-gray-700 leading-relaxed">&quot;{ex}&quot;</p>
                    <button
                      onClick={() => removeExample(i)}
                      className="text-gray-300 hover:text-red-400 flex-shrink-0 mt-0.5"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-gray-300 text-center">
              {examples.length}/5 examples added {examples.length === 0 && "— you can skip this"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-6 py-5 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step < totalSteps - 1) {
              setStep((s) => s + 1);
            } else {
              handleFinish();
            }
          }}
          disabled={!canNext()}
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#e84672] hover:bg-[#d63d65] disabled:opacity-40 active:scale-[0.98] transition"
        >
          {step < totalSteps - 1 ? "Continue" : "Start chatting"}
        </button>
      </div>
    </main>
  );
}
