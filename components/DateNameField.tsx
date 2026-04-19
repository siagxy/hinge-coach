"use client";

import { useEffect, useState } from "react";

export default function DateNameField({
  name,
  onUpdateName,
  className = "text-lg font-extrabold text-gray-900",
}: {
  name: string;
  onUpdateName: (name: string) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState(name);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  const commit = () => {
    const t = draft.trim();
    if (!t) {
      setDraft(name);
      return;
    }
    if (t !== name) onUpdateName(t);
  };

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      spellCheck={false}
      autoComplete="off"
      aria-label="Match name"
      className={`w-full max-w-[min(100%,20rem)] mx-auto block text-center bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#e84672] focus:outline-none focus:ring-0 rounded-none px-1 py-0.5 transition-colors ${className}`}
    />
  );
}
