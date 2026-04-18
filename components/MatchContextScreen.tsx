"use client";
import { useRef, useState } from "react";
import type { ClipboardEvent, RefObject } from "react";
import { compressImageFileToJpegBase64 } from "@/lib/compressImage";
import { Conversation, MatchContextImage } from "@/lib/types";

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

export default function MatchContextScreen({
  conversation,
  colorIndex,
  onBack,
  onUpdateMatchContext,
}: {
  conversation: Conversation;
  colorIndex: number;
  onBack: () => void;
  onUpdateMatchContext: (payload: {
    matchProfileText: string;
    priorChatText: string;
    matchProfileImages: MatchContextImage[];
    priorChatImages: MatchContextImage[];
  }) => void;
}) {
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
          <p className="text-base font-bold text-gray-900 leading-tight">About him</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
            Profile and past chats — used to personalize replies
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center pt-6 pb-4 px-6 border-b border-gray-50">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
            PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length]
          }`}
        >
          <span className="text-lg font-extrabold text-gray-700">{getInitials(conversation.name)}</span>
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">{conversation.name}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{messageCount} messages in this chat</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        {contextSection({
          title: "His profile",
          hint: "Paste his prompts or bio, or add screenshots. Used only to personalize replies.",
          text: matchProfileText,
          setText: setMatchProfileText,
          images: matchProfileImages,
          section: "profile",
          fileInputRef: profileFileRef,
        })}
        {contextSection({
          title: "Prior conversation",
          hint: "Paste an older thread or add screenshots. Optional if this chat is new.",
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
          Save for replies
        </button>
      </div>
    </main>
  );
}
