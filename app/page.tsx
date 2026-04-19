"use client";
import { useState, useEffect, useRef } from "react";
import MessageThread from "@/components/MessageThread";
import MessageInput from "@/components/MessageInput";
import ReplySuggestions from "@/components/ReplySuggestions";
import ChatList from "@/components/ChatList";
import StoryBar from "@/components/StoryBar";
import BottomNav from "@/components/BottomNav";
import ToneSetup from "@/components/ToneSetup";
import DateFlagsScreen from "@/components/DateFlagsScreen";
import DateAvatar from "@/components/DateAvatar";
import MatchContextScreen from "@/components/MatchContextScreen";
import { hasSavedMatchContext } from "@/lib/conversationUtils";
import {
  Message,
  Reply,
  Conversation,
  UserProfile,
  Flag,
  MatchContextImage,
  DEFAULT_USER_DISPLAY_NAME,
} from "@/lib/types";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [view, setView] = useState<"list" | "chat" | "matchContext" | "dateFlags">("list");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [contextSaveNotice, setContextSaveNotice] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("user-profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile) as UserProfile;
      // Older builds used "You" as the placeholder name; migrate to the current default.
      if (parsed.name === "You") {
        const updated = { ...parsed, name: DEFAULT_USER_DISPLAY_NAME };
        localStorage.setItem("user-profile", JSON.stringify(updated));
        setProfile(updated);
      } else {
        setProfile(parsed);
      }
    }
    setProfileLoaded(true);

    const savedConvos = localStorage.getItem("hinge-convos");
    if (savedConvos) {
      setConvos(JSON.parse(savedConvos));
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    if (profileLoaded) {
      localStorage.setItem("hinge-convos", JSON.stringify(convos));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos, profileLoaded]);

  // Clear suggestions on convo switch
  useEffect(() => {
    setSuggestions([]);
  }, [activeId]);

  useEffect(() => {
    if (!resetNotice) return;
    const timer = window.setTimeout(() => {
      setResetNotice(null);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [resetNotice]);

  useEffect(() => {
    if (!contextSaveNotice) return;
    const timer = window.setTimeout(() => {
      setContextSaveNotice(null);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [contextSaveNotice]);

  const activeConvo = convos.find((c) => c.id === activeId) ?? null;

  const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem("user-profile", JSON.stringify(p));
    setIsEditingProfile(false);
  };

  const requestResetProfile = () => {
    setShowSettingsMenu(false);
    setShowResetConfirm(true);
  };

  const openProfileEditor = () => {
    setShowSettingsMenu(false);
    setIsEditingProfile(true);
  };

  const resetProfile = () => {
    setProfile(null);
    localStorage.removeItem("user-profile");
    setShowResetConfirm(false);
    setResetNotice("Profile reset. You can set up your style again.");
  };

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
      const hasMatchContext =
        Boolean(activeConvo.matchProfileText?.trim()) ||
        Boolean(activeConvo.priorChatText?.trim()) ||
        (activeConvo.matchProfileImages?.length ?? 0) > 0 ||
        (activeConvo.priorChatImages?.length ?? 0) > 0;
      const matchContext = hasMatchContext
        ? {
            matchName: activeConvo.name,
            matchProfileText: activeConvo.matchProfileText,
            priorChatText: activeConvo.priorChatText,
            matchProfileImages: activeConvo.matchProfileImages?.map(({ mediaType, data }) => ({
              mediaType,
              data,
            })),
            priorChatImages: activeConvo.priorChatImages?.map(({ mediaType, data }) => ({
              mediaType,
              data,
            })),
          }
        : null;
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory, profile, matchContext }),
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

  const updateFlags = (id: string, flags: Flag[]) => {
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flags } : c))
    );
  };

  const updateMatchContext = (
    id: string,
    payload: {
      matchProfileText: string;
      priorChatText: string;
      matchProfileImages: MatchContextImage[];
      priorChatImages: MatchContextImage[];
    }
  ) => {
    setConvos((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              matchProfileText: payload.matchProfileText,
              priorChatText: payload.priorChatText,
              matchProfileImages: payload.matchProfileImages,
              priorChatImages: payload.priorChatImages,
            }
          : c
      )
    );
  };

  const updateConversationAvatar = (id: string, next: MatchContextImage | null) => {
    setConvos((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (!next) {
          const cleared = { ...c };
          delete cleared.avatarImage;
          return cleared;
        }
        return { ...c, avatarImage: next };
      })
    );
  };

  const updateConversationName = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
    );
  };

  const openMatchContext = () => {
    if (activeConvo) setView("matchContext");
  };

  const openDateFlags = () => {
    if (activeConvo) setView("dateFlags");
  };

  // Don't render until localStorage is loaded
  if (!profileLoaded) return null;

  // ─── Onboarding ───
  if (!profile) {
    return <ToneSetup onComplete={handleProfileComplete} />;
  }

  if (isEditingProfile) {
    return (
      <ToneSetup
        onComplete={handleProfileComplete}
        initialProfile={profile}
        onCancel={() => setIsEditingProfile(false)}
      />
    );
  }

  // ─── Chat List View ───
  if (view === "list") {
    return (
      <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div>
            <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
          </div>
          <button
            onClick={() => setShowSettingsMenu(true)}
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
            title="Open settings"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Vibe badge */}
        <div className="px-4 pb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e84672] bg-pink-50 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e84672]" />
            {profile.vibe} vibe &middot; {profile.length} messages
          </span>
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
        <BottomNav active="chat" visibleTabs={["chat"]} />

        {showSettingsMenu && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl px-5 pt-5 pb-4 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-gray-900">Settings</p>
                <button
                  onClick={() => setShowSettingsMenu(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                  aria-label="Close settings"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={openProfileEditor}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Edit profile
                </button>
                <button
                  onClick={requestResetProfile}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                >
                  Reset profile
                </button>
              </div>
            </div>
          </div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl px-5 pt-5 pb-4 shadow-xl">
              <p className="text-base font-bold text-gray-900">Reset your profile?</p>
              <p className="text-sm text-gray-500 mt-2">
                This will remove your current style profile and send you back to onboarding.
              </p>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={resetProfile}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                >
                  Yes, reset
                </button>
              </div>
            </div>
          </div>
        )}

        {resetNotice && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 px-4">
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg">
              {resetNotice}
            </div>
          </div>
        )}
      </main>
    );
  }

  // ─── Profile View ───
  if (view === "matchContext" && activeConvo) {
    const colorIndex = convos.findIndex((c) => c.id === activeId);
    return (
      <MatchContextScreen
        key={`ctx-${activeConvo.id}`}
        conversation={activeConvo}
        colorIndex={colorIndex}
        onBack={() => setView("chat")}
        onUpdateAvatar={(next) => updateConversationAvatar(activeConvo.id, next)}
        onUpdateName={(name) => updateConversationName(activeConvo.id, name)}
        onUpdateMatchContext={(payload) => {
          updateMatchContext(activeConvo.id, payload);
          setContextSaveNotice("About him saved for this chat.");
        }}
      />
    );
  }

  if (view === "dateFlags" && activeConvo) {
    const colorIndex = convos.findIndex((c) => c.id === activeId);
    return (
      <DateFlagsScreen
        key={`flags-${activeConvo.id}`}
        conversation={activeConvo}
        colorIndex={colorIndex}
        onBack={() => setView("chat")}
        onUpdateAvatar={(next) => updateConversationAvatar(activeConvo.id, next)}
        onUpdateName={(name) => updateConversationName(activeConvo.id, name)}
        onUpdateFlags={(flags) => updateFlags(activeConvo.id, flags)}
      />
    );
  }

  // ─── Conversation View ───
  const flagCount = activeConvo ? (activeConvo.flags?.length ?? 0) : 0;
  const hasContextSaved = activeConvo ? hasSavedMatchContext(activeConvo) : false;
  const headerColorIndex =
    activeConvo && activeId ? Math.max(0, convos.findIndex((c) => c.id === activeId)) : 0;

  return (
    <main className="max-w-md mx-auto w-full min-h-screen flex flex-col bg-white">
      {/* Chat header: two rows so the name is not squeezed next to pills on narrow phones */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex flex-col gap-2.5">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 shrink-0 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#333" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button type="button" onClick={openDateFlags} className="relative shrink-0">
            {activeConvo && (
              <DateAvatar
                name={activeConvo.name}
                avatarImage={activeConvo.avatarImage}
                colorIndex={headerColorIndex}
                className="w-10 h-10"
                textClassName="text-xs"
              />
            )}
            {flagCount > 0 && (
              <span className="absolute -bottom-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-[#e84672] text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                {flagCount}
              </span>
            )}
          </button>

          <button type="button" onClick={openDateFlags} className="flex-1 min-w-0 text-left pt-0.5">
            <p className="text-base font-bold text-gray-900 break-words leading-snug line-clamp-3">
              {activeConvo?.name}
            </p>
            <p className="text-[11px] text-green-500 font-medium">Online</p>
          </button>

          <button
            onClick={() => activeConvo && deleteConvo(activeConvo.id)}
            className="w-9 h-9 shrink-0 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition text-gray-400"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={openMatchContext}
            className="relative shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#e84672] bg-pink-50 hover:bg-pink-100 border border-pink-100 transition"
            title="His profile, screenshots, and prior chats — used to personalize replies"
          >
            About him
            {hasContextSaved && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          <button
            type="button"
            onClick={openDateFlags}
            className="relative shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition"
            title="What stands out — good signs and things to watch"
          >
            Pros & cons
            {flagCount > 0 && (
              <span className="absolute -bottom-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#e84672] text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                {flagCount}
              </span>
            )}
          </button>
        </div>
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

      {contextSaveNotice && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 px-4">
          <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg">
            {contextSaveNotice}
          </div>
        </div>
      )}
    </main>
  );
}
