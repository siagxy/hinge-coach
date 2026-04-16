"use client";
import { useState, useEffect, useRef } from "react";
import MessageThread from "@/components/MessageThread";
import MessageInput from "@/components/MessageInput";
import ReplySuggestions from "@/components/ReplySuggestions";
import ChatList from "@/components/ChatList";
import StoryBar from "@/components/StoryBar";
import BottomNav from "@/components/BottomNav";
import { Message, Reply, Conversation } from "@/lib/types";

export default function Home() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [view, setView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hinge-convos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConvos(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hinge-convos", JSON.stringify(convos));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos]);

  useEffect(() => {
    setSuggestions([]);
  }, [activeId]);

  const activeConvo = convos.find((c) => c.id === activeId) ?? null;

  const createConvo = () => {
    if (!newName.trim()) return;
    const convo: Conversation = {
      id: Date.now().toString(),
      name: newName.trim(),
      history: [],
    };
    setConvos((prev) => [convo, ...prev]);
    setActiveId(convo.id);
    setNewName("");
    setShowNewForm(false);
    setView("chat");
  };

  const updateHistory = (id: string, history: Message[]) => {
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, history } : c))
    );
  };

  const deleteConvo = (id: string) => {
    const remaining = convos.filter((c) => c.id !== id);
    setConvos(remaining);
    setActiveId(null);
    setView("list");
  };

  const openConvo = (id: string) => {
    setActiveId(id);
    setView("chat");
  };

  const goBack = () => {
    setView("list");
    setSuggestions([]);
  };

  const handleHisMessage = async (text: string) => {
    if (!activeConvo) return;
    const newHistory: Message[] = [
      ...activeConvo.history,
      {
        role: "user",
        content: `His message: "${text}"`,
        display: { sender: "him", text },
      },
    ];
    updateHistory(activeConvo.id, newHistory);
    setSuggestions([]);
    setLoading(true);

    try {
      const apiHistory = newHistory.map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory }),
      });
      const data = await res.json();
      setSuggestions(data.replies ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickReply = (reply: Reply) => {
    if (!activeConvo) return;
    const newHistory: Message[] = [
      ...activeConvo.history,
      {
        role: "assistant",
        content: reply.message,
        display: { sender: "her", text: reply.message },
      },
    ];
    updateHistory(activeConvo.id, newHistory);
    setSuggestions([]);
  };

  // ─── Chat List View ───
  if (view === "list") {
    return (
      <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Chatting</h1>
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Story Bar */}
        <StoryBar
          conversations={convos}
          onNew={() => setShowNewForm(true)}
        />

        {/* New conversation form */}
        {showNewForm && (
          <div className="px-4 py-3 border-b border-gray-100 bg-pink-50/30">
            <p className="text-xs font-semibold text-gray-500 mb-2">New conversation</p>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="His name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createConvo()}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20"
              />
              <button
                onClick={createConvo}
                disabled={!newName.trim()}
                className="bg-[#e84672] text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition"
              >
                Start
              </button>
              <button
                onClick={() => { setShowNewForm(false); setNewName(""); }}
                className="text-gray-400 hover:text-gray-600 px-2"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat List */}
        <ChatList
          conversations={convos}
          activeId={activeId}
          onSelect={openConvo}
        />

        {/* Bottom Nav */}
        <BottomNav active="chat" />
      </main>
    );
  }

  // ─── Conversation View ───
  return (
    <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#333" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">
            {activeConvo?.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900 truncate">{activeConvo?.name}</p>
          <p className="text-[11px] text-green-500 font-medium">Online</p>
        </div>

        <button
          onClick={() => activeConvo && deleteConvo(activeConvo.id)}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition text-gray-400"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white">
        <MessageThread history={activeConvo?.history ?? []} />
        <div ref={bottomRef} />
      </div>

      {/* Reply Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-t border-gray-100">
          <ReplySuggestions suggestions={suggestions} onPick={handlePickReply} />
          <button
            onClick={() => {
              setSuggestions([]);
              setConvos((prev) =>
                prev.map((c) =>
                  c.id === activeId
                    ? { ...c, history: c.history.slice(0, -1) }
                    : c
                )
              );
            }}
            className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition font-medium"
          >
            ← edit his message
          </button>
        </div>
      )}

      {/* Message Input */}
      {suggestions.length === 0 && (
        <MessageInput onSubmit={handleHisMessage} loading={loading} />
      )}
    </main>
  );
}
