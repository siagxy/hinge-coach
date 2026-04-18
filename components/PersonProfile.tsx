"use client";
import { useRef, useState } from "react";
import type { ClipboardEvent, RefObject } from "react";
import { compressImageFileToJpegBase64 } from "@/lib/compressImage";
import { Conversation, Flag, MatchContextImage } from "@/lib/types";

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

const MAX_IMAGES_PER_SECTION = 4;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function newId() {
  return crypto.randomUUID();
}

export default function PersonProfile({
  conversation,
  colorIndex,
  onBack,
  onUpdateFlags,
  onUpdateMatchContext,
}: {
  conversation: Conversation;
  colorIndex: number;
  onBack: () => void;
  onUpdateFlags: (flags: Flag[]) => void;
  onUpdateMatchContext: (payload: {
    matchProfileText: string;
    priorChatText: string;
    matchProfileImages: MatchContextImage[];
    priorChatImages: MatchContextImage[];
  }) => void;
}) {
  const [mainTab, setMainTab] = useState<"context" | "green" | "red">("context");
  const [customText, setCustomText] = useState("");
  const [matchProfileText, setMatchProfileText] = useState(
    () => conversation.matchProfileText ?? ""
  );
  const [priorChatText, setPriorChatText] = useState(() => conversation.priorChatText ?? "");
  const [matchProfileImages, setMatchProfileImages] = useState<MatchContextImage[]>(
    () => conversation.matchProfileImages ?? []
  );
  const [priorChatImages, setPriorChatImages] = useState<MatchContextImage[]>(
    () => conversation.priorChatImages ?? []
  );

  const profileFileRef = useRef<HTMLInputElement>(null);
  const priorFileRef = useRef<HTMLInputElement>(null);

  const flags = conversation.flags ?? [];
  const greenFlags = flags.filter((f) => f.type === "green");
  const redFlags = flags.filter((f) => f.type === "red");
  const tab = mainTab === "green" ? "green" : mainTab === "red" ? "red" : "green";
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

  const addImages = async (section: "profile" | "prior", fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const setter = section === "profile" ? setMatchProfileImages : setPriorChatImages;
    for (const file of files) {
      try {
        const { mediaType, data } = await compressImageFileToJpegBase64(file);
        setter((prev) => {
          if (prev.length >= MAX_IMAGES_PER_SECTION) return prev;
          return [...prev, { id: newId(), mediaType, data }];
        });
      } catch {
        /* skip bad image */
      }
    }
  };

  const removeImage = (section: "profile" | "prior", id: string) => {
    if (section === "profile") {
      setMatchProfileImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      setPriorChatImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const saveMatchContext = () => {
    onUpdateMatchContext({
      matchProfileText,
      priorChatText,
      matchProfileImages,
      priorChatImages,
    });
    onBack();
  };

  const handlePasteImages = (section: "profile" | "prior", e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.kind === "file" && it.type.startsWith("image/")) {
        const f = it.getAsFile();
        if (f) imageFiles.push(f);
      }
    }
    if (imageFiles.length === 0) return;
    e.preventDefault();
    void addImages(section, imageFiles);
  };

  const messageCount = conversation.history.length;

  const contextSection = (opts: {
    title: string;
    hint: string;
    text: string;
    setText: (v: string) => void;
    images: MatchContextImage[];
    section: "profile" | "prior";
    fileInputRef: RefObject<HTMLInputElement | null>;
  }) => (
    <div className="mb-5">
      <p className="text-sm font-bold text-gray-900 mb-1">{opts.title}</p>
      <p className="text-[11px] text-gray-400 mb-2">{opts.hint}</p>
      <textarea
        value={opts.text}
        onChange={(e) => opts.setText(e.target.value)}
        onPaste={(e) => handlePasteImages(opts.section, e)}
        rows={4}
        placeholder="Paste text here…"
        className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300 mb-2"
      />
      <input
        ref={opts.fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void addImages(opts.section, e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => opts.fileInputRef.current?.click()}
        className="text-xs font-semibold text-[#e84672] mb-2"
      >
        + Add photos ({opts.images.length}/{MAX_IMAGES_PER_SECTION})
      </button>
      {opts.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {opts.images.map((img) => (
            <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
              {/* Base64 preview: next/image is not suited for dynamic data URLs */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${img.data}`}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(opts.section, img.id)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
      {/* Header */}
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
          <p className="text-base font-bold text-gray-900 leading-tight">Date details</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
            Use Context tab for his profile &amp; past chats
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div className="flex flex-col items-center pt-8 pb-4 px-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
            PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length]
          }`}
        >
          <span className="text-xl font-extrabold text-gray-700">
            {getInitials(conversation.name)}
          </span>
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

      {/* Main tabs */}
      <div className="flex mx-4 mb-3 bg-gray-50 rounded-xl p-1 gap-0.5">
        {(["context", "green", "red"] as const).map((id) => (
          <button
            key={id}
            onClick={() => setMainTab(id)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              mainTab === id
                ? id === "context"
                  ? "bg-white text-[#e84672] shadow-sm"
                  : id === "green"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "bg-white text-red-600 shadow-sm"
                : "text-gray-400"
            }`}
          >
            {id === "context" ? "Context" : id === "green" ? "Green" : "Red"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {mainTab === "context" && (
          <div>
            {contextSection({
              title: "His profile",
              hint: "Paste his prompts or bio, or add screenshots. Helps replies sound tailored to him.",
              text: matchProfileText,
              setText: setMatchProfileText,
              images: matchProfileImages,
              section: "profile",
              fileInputRef: profileFileRef,
            })}
            {contextSection({
              title: "Prior conversation",
              hint: "Paste an older thread or drop screenshots. Optional if this chat is new.",
              text: priorChatText,
              setText: setPriorChatText,
              images: priorChatImages,
              section: "prior",
              fileInputRef: priorFileRef,
            })}
            <button
              type="button"
              onClick={saveMatchContext}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#e84672] hover:bg-[#d63d65] transition"
            >
              Save context
            </button>
          </div>
        )}

        {mainTab !== "context" && (
          <>
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
                        tab === "green"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-700"
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
          </>
        )}
      </div>
    </main>
  );
}
