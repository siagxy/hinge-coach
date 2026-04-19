"use client";

import { useRef } from "react";
import { compressImageFileToJpegBase64 } from "@/lib/compressImage";
import type { Conversation, MatchContextImage } from "@/lib/types";
import DateAvatar from "./DateAvatar";

function newId() {
  return crypto.randomUUID();
}

export default function DateMatchPhotoRow({
  conversation,
  colorIndex,
  size,
  onChange,
}: {
  conversation: Conversation;
  colorIndex: number;
  onChange: (next: MatchContextImage | null) => void;
  size: "md" | "lg";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const dims =
    size === "lg"
      ? { outer: "w-20 h-20", text: "text-xl" }
      : { outer: "w-16 h-16", text: "text-lg" };

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file?.type.startsWith("image/")) return;
    try {
      const { mediaType, data } = await compressImageFileToJpegBase64(file, {
        maxWidth: 480,
        quality: 0.85,
      });
      onChange({ id: newId(), mediaType, data });
    } catch {
      /* skip bad image */
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84672] focus-visible:ring-offset-2"
        aria-label={conversation.avatarImage ? "Change match photo" : "Add match photo"}
      >
        <DateAvatar
          name={conversation.name}
          avatarImage={conversation.avatarImage}
          colorIndex={colorIndex}
          className={dims.outer}
          textClassName={dims.text}
        />
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      <div className="flex items-center gap-3 mt-0.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-semibold text-[#e84672] hover:text-[#d63d65] transition"
        >
          {conversation.avatarImage ? "Change photo" : "Add photo"}
        </button>
        {conversation.avatarImage && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
