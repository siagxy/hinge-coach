"use client";

import type { MatchContextImage } from "@/lib/types";

const PLACEHOLDER_COLORS = [
  "bg-pink-200",
  "bg-purple-200",
  "bg-blue-200",
  "bg-amber-200",
  "bg-teal-200",
  "bg-rose-200",
];

export function dateInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type Props = {
  name: string;
  avatarImage?: MatchContextImage | null;
  colorIndex: number;
  className?: string;
  textClassName?: string;
};

/**
 * Match avatar: custom photo or colored initials fallback.
 */
export default function DateAvatar({
  name,
  avatarImage,
  colorIndex,
  className = "w-12 h-12",
  textClassName = "text-sm",
}: Props) {
  const bg = PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length];

  if (avatarImage?.data) {
    return (
      <div className={`${className} rounded-full overflow-hidden bg-gray-100 shrink-0`}>
        {/* Local JPEG from localStorage; next/image is a poor fit for dynamic base64 blobs */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${avatarImage.data}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-full flex items-center justify-center shrink-0 ${bg}`}>
      <span className={`font-bold text-gray-700 ${textClassName}`}>{dateInitials(name)}</span>
    </div>
  );
}
