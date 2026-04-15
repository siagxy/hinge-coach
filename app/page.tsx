"use client";
import { useState, useEffect, useRef } from "react";
import MessageThread from "@/components/MessageThread";
import MessageInput from "@/components/MessageInput";
import ReplySuggestions from "@/components/ReplySuggestions";
import { Message, Reply, Conversation } from "@/lib/types";

export default function Home() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("hinge-convos");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConvos(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
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
  };

  const updateHistory = (id: string, history: Message[]) => {
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, history } : c))
    );
  };

  const deleteConvo = (id: string) => {
    const remaining = convos.filter((c) => c.id !== id);
    setConvos(remaining);
    setActiveId(remaining.length > 0 ? remaining[0].id : null);
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

  return (
    <main className="max-w-md mx-auto px-4 py-0 min-h-screen flex flex-col">
      <div className="py-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">hinge coach</h1>
            <p className="text-xs text-gray-400">ai reply suggestions</p>
          </div>
          <button
            onClick={() => setShowNewForm((v) => !v)}
            className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 transition"
          >
            + new
          </button>
        </div>

        {showNewForm && (
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              type="text"
              placeholder="His name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createConvo()}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <button
              onClick={createConvo}
              disabled={!newName.trim()}
              className="bg-pink-500 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-40"
            >
              start
            </button>
          </div>
        )}

        {convos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition ${
                  c.id === activeId
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {!activeConvo ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-12">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">💬</div>
          <p className="text-sm text-gray-400">no conversations yet</p>
          <p className="text-xs text-gray-300">tap + new to start one</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center pt-3 pb-1">
            <p className="text-sm font-medium text-gray-700">{activeConvo.name}</p>
            <button
              onClick={() => deleteConvo(activeConvo.id)}
              className="text-xs text-gray-300 hover:text-red-400 transition"
            >
              delete
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <MessageThread history={activeConvo.history} />
            <div ref={bottomRef} />
          </div>

          {suggestions.length > 0 && (
            <ReplySuggestions suggestions={suggestions} onPick={handlePickReply} />
          )}

          {suggestions.length === 0 && (
            <MessageInput onSubmit={handleHisMessage} loading={loading} />
          )}
        </>
      )}
    </main>
  );
}