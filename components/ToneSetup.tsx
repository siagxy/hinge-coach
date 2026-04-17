"use client";
import { useState } from "react";
import { UserProfile } from "@/lib/types";

const CATEGORY_TITLES = [
  "You At A Glance",
  "Dating Intent",
  "Your Texting Voice",
  "Flirting Style",
  "Boundaries & Comfort",
  "Optional Personalization",
];

const AGE_OPTIONS = ["18-24", "25-29", "30-34", "35-39", "40+"];
const WORK_MODE_OPTIONS = ["9-5", "Flexible", "Student", "Shift work", "Founder/Freelance"];
const SOCIAL_ENERGY_OPTIONS = ["Introvert", "Ambivert", "Extrovert"];
const INTEREST_OPTIONS = [
  "Fitness", "Outdoors", "Food", "Travel", "Music", "Art", "Books", "Gaming", "Tech", "Wellness", "Dancing", "Sports",
];

const RELATIONSHIP_GOAL_OPTIONS = ["Long-term", "Short-term", "Open to both", "Not sure yet"];
const DATING_PACE_OPTIONS = ["Slow burn", "Balanced", "Fast momentum"];
const MOVE_TO_DATE_OPTIONS = ["Same day", "2-3 days", "Within a week", "After 1-2 weeks"];
const FIRST_DATE_OPTIONS = ["Coffee", "Walk", "Drinks", "Dinner", "Activity date", "Museum", "Park/Picnic", "Live music"];

const VIBE_OPTIONS = [
  { id: "warm", label: "Warm", desc: "Kind, open, genuine", icon: "🤗" },
  { id: "witty", label: "Witty", desc: "Clever, playful banter", icon: "🧠" },
  { id: "flirty", label: "Flirty", desc: "Playful and teasing", icon: "😏" },
  { id: "chill", label: "Chill", desc: "Relaxed and low-key", icon: "😎" },
  { id: "bold", label: "Bold", desc: "Confident and direct", icon: "🔥" },
];
const LENGTH_OPTIONS = [
  { id: "short", label: "Very short", desc: "1 sentence max" },
  { id: "medium", label: "1-2 sentences", desc: "Conversational default" },
  { id: "long", label: "Longer", desc: "More detailed replies" },
];
const EMOJI_USAGE_OPTIONS = ["Never", "Sometimes", "Often"];
const EMOJI_STYLE_OPTIONS = ["😂", "😅", "😉", "🥹", "🔥", "✨", "😭", "🙃", "❤️", "😌"];
const FILLER_OPTIONS = ["haha", "lol", "lmao", "omg", "fr", "ngl", "tbh", "none"];
const CAPITALIZATION_OPTIONS = ["Proper caps", "Mostly lowercase", "Mixed"];
const PUNCTUATION_OPTIONS = ["Clean punctuation", "Minimal punctuation", "No punctuation"];

const DIRECTNESS_OPTIONS = ["Subtle", "Medium", "Very direct"];
const PLAYFULNESS_OPTIONS = ["Low", "Medium", "High"];
const FLIRTING_STYLE_OPTIONS = ["Teasing", "Sweet", "Witty", "Confident", "Mysterious"];
const HUMOR_STYLE_OPTIONS = ["Sarcastic", "Goofy", "Dry", "Clever", "Wholesome"];
const DRY_TEXTER_OPTIONS = ["Match energy", "Lift energy", "Ask one strong question", "Disengage"];

const AVOID_TOPICS_OPTIONS = ["Exes", "Politics", "Religion", "Money", "Sex", "Family trauma", "None"];
const HARD_BOUNDARY_OPTIONS = [
  "No late-night invites",
  "No sexual talk early",
  "No double-text pressure",
  "No ghosting games",
  "No last-minute-only plans",
];
const TURN_OFF_OPTIONS = [
  "Pushy tone",
  "Too sexual too fast",
  "One-word replies",
  "Inconsistent effort",
  "Negging",
  "Love bombing",
];

export default function ToneSetup({
  onComplete,
}: {
  onComplete: (profile: UserProfile) => void;
}) {
  const [step, setStep] = useState(0);
  const [ageRange, setAgeRange] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [homeCountry, setHomeCountry] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [socialEnergy, setSocialEnergy] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [relationshipGoal, setRelationshipGoal] = useState("");
  const [datingPace, setDatingPace] = useState("");
  const [moveToDateTiming, setMoveToDateTiming] = useState("");
  const [firstDateTypes, setFirstDateTypes] = useState<string[]>([]);

  const [vibe, setVibe] = useState("");
  const [length, setLength] = useState("");
  const [emojiUsage, setEmojiUsage] = useState("");
  const [emojiStyle, setEmojiStyle] = useState<string[]>([]);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const [capitalizationStyle, setCapitalizationStyle] = useState("");
  const [punctuationStyle, setPunctuationStyle] = useState("");

  const [directnessLevel, setDirectnessLevel] = useState("");
  const [playfulnessLevel, setPlayfulnessLevel] = useState("");
  const [flirtingStyles, setFlirtingStyles] = useState<string[]>([]);
  const [humorStyles, setHumorStyles] = useState<string[]>([]);
  const [dryTexterStrategy, setDryTexterStrategy] = useState("");

  const [avoidTopics, setAvoidTopics] = useState<string[]>([]);
  const [hardBoundaries, setHardBoundaries] = useState<string[]>([]);
  const [turnOffs, setTurnOffs] = useState<string[]>([]);

  const [examples, setExamples] = useState(["", "", ""]);

  const totalSteps = CATEGORY_TITLES.length;

  const toggleMulti = (
    selected: string[],
    setSelected: (values: string[]) => void,
    value: string,
    maxSelections?: number
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
      return;
    }
    if (maxSelections && selected.length >= maxSelections) return;
    setSelected([...selected, value]);
  };

  const toggleMultiWithNone = (
    selected: string[],
    setSelected: (values: string[]) => void,
    value: string,
    noneValue: string,
    maxSelections?: number
  ) => {
    if (value === noneValue) {
      setSelected([noneValue]);
      return;
    }
    const withoutNone = selected.filter((item) => item !== noneValue);
    if (withoutNone.includes(value)) {
      setSelected(withoutNone.filter((item) => item !== value));
      return;
    }
    if (maxSelections && withoutNone.length >= maxSelections) return;
    setSelected([...withoutNone, value]);
  };

  const canNext = () => {
    if (step === 0) {
      return Boolean(
        ageRange &&
          currentCity.trim() &&
          currentCountry.trim() &&
          homeCountry.trim() &&
          workMode &&
          socialEnergy &&
          interests.length > 0
      );
    }
    if (step === 1) return Boolean(relationshipGoal && datingPace && moveToDateTiming && firstDateTypes.length > 0);
    if (step === 2) return Boolean(vibe && length && emojiUsage && capitalizationStyle && punctuationStyle);
    if (step === 3) {
      return Boolean(directnessLevel && playfulnessLevel && flirtingStyles.length > 0 && humorStyles.length > 0 && dryTexterStrategy);
    }
    return true;
  };

  const handleFinish = () => {
    const cleanExamples = examples.map((item) => item.trim()).filter(Boolean);
    const location = `${currentCity.trim()}, ${currentCountry.trim()} (home: ${homeCountry.trim()})`;
    const bio = [
      `Work mode: ${workMode}`,
      `Social energy: ${socialEnergy}`,
      `Dating goal: ${relationshipGoal}`,
    ].join(". ");

    onComplete({
      name: "You",
      age: ageRange,
      location,
      interests: interests.join(", "),
      currentCity: currentCity.trim(),
      currentCountry: currentCountry.trim(),
      homeCountry: homeCountry.trim(),
      workMode,
      socialEnergy,
      relationshipGoal,
      datingPace,
      moveToDateTiming,
      firstDateTypes,
      emojiUsage,
      emojiStyle,
      fillerWords,
      capitalizationStyle,
      punctuationStyle,
      directnessLevel,
      playfulnessLevel,
      flirtingStyles,
      humorStyles,
      dryTexterStrategy,
      avoidTopics,
      hardBoundaries,
      turnOffs,
      vibe,
      length,
      emoji: emojiUsage !== "Never",
      haha: fillerWords.includes("haha") || fillerWords.includes("lol"),
      examples: cleanExamples,
      bio,
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
          <span className="text-sm font-bold text-[#e84672]">Talk Sweet</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-4">Set up your style</h1>
        <p className="text-sm text-gray-400 mt-1">
          Mostly tap-select onboarding to teach AI your dating voice.
        </p>
        <p className="text-xs font-semibold text-[#e84672] mt-4">
          {CATEGORY_TITLES[step]}
        </p>
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
        {/* Step 0: You At A Glance */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">How old are you?</p>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAgeRange(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      ageRange === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">
                Where are you based right now, and where is home for you?
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                <input
                  autoFocus
                  type="text"
                  placeholder="Current city"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
                />
                <input
                  type="text"
                  placeholder="Current country"
                  value={currentCountry}
                  onChange={(e) => setCurrentCountry(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
                />
                <input
                  type="text"
                  placeholder="Home country"
                  value={homeCountry}
                  onChange={(e) => setHomeCountry(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What&apos;s your current work/life mode?</p>
              <div className="flex flex-wrap gap-2">
                {WORK_MODE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setWorkMode(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      workMode === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Your social energy?</p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_ENERGY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSocialEnergy(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      socialEnergy === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What do you like to do? (pick up to 5)</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(interests, setInterests, option, 5)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      interests.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Dating Intent */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What are you looking for right now?</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_GOAL_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setRelationshipGoal(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      relationshipGoal === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What pace feels right for dating?</p>
              <div className="flex flex-wrap gap-2">
                {DATING_PACE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDatingPace(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      datingPace === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">When do you like moving from chat to date?</p>
              <div className="flex flex-wrap gap-2">
                {MOVE_TO_DATE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setMoveToDateTiming(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      moveToDateTiming === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What first dates do you prefer? (pick up to 3)</p>
              <div className="flex flex-wrap gap-2">
                {FIRST_DATE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(firstDateTypes, setFirstDateTypes, option, 3)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      firstDateTypes.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Your Texting Voice */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Pick your texting vibe</p>
              <div className="flex flex-col gap-2.5">
                {VIBE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setVibe(option.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition ${
                      vibe === option.id
                        ? "border-[#e84672] bg-pink-50/50"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${vibe === option.id ? "text-[#e84672]" : "text-gray-900"}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-400">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">How long are your usual messages?</p>
              <div className="flex flex-wrap gap-2">
                {LENGTH_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setLength(option.id)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      length === option.id
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                    title={option.desc}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">How often do you use emojis?</p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_USAGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setEmojiUsage(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      emojiUsage === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Which emojis feel like you? (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(emojiStyle, setEmojiStyle, option)}
                    className={`w-10 h-10 rounded-full text-lg border transition ${
                      emojiStyle.includes(option)
                        ? "border-[#e84672] bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Which filler words do you use? (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {FILLER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMultiWithNone(fillerWords, setFillerWords, option, "none")}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      fillerWords.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Your capitalization style</p>
              <div className="flex flex-wrap gap-2">
                {CAPITALIZATION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setCapitalizationStyle(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      capitalizationStyle === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Your punctuation style</p>
              <div className="flex flex-wrap gap-2">
                {PUNCTUATION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setPunctuationStyle(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      punctuationStyle === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Flirting Style */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">How direct are you when interested?</p>
              <div className="flex flex-wrap gap-2">
                {DIRECTNESS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDirectnessLevel(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      directnessLevel === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">How playful are you in chat?</p>
              <div className="flex flex-wrap gap-2">
                {PLAYFULNESS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setPlayfulnessLevel(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      playfulnessLevel === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What kind of flirting feels natural? (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {FLIRTING_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(flirtingStyles, setFlirtingStyles, option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      flirtingStyles.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What humor style sounds like you? (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {HUMOR_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(humorStyles, setHumorStyles, option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      humorStyles.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">If someone is dry, what do you do?</p>
              <div className="flex flex-wrap gap-2">
                {DRY_TEXTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDryTexterStrategy(option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      dryTexterStrategy === option
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Boundaries & Comfort */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What topics should AI avoid early? (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {AVOID_TOPICS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMultiWithNone(avoidTopics, setAvoidTopics, option, "None")}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      avoidTopics.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">Set your hard boundaries (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {HARD_BOUNDARY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(hardBoundaries, setHardBoundaries, option)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      hardBoundaries.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">What turns you off in chat? (pick up to 3)</p>
              <div className="flex flex-wrap gap-2">
                {TURN_OFF_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleMulti(turnOffs, setTurnOffs, option, 3)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                      turnOffs.includes(option)
                        ? "border-[#e84672] bg-pink-50 text-[#e84672]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Optional Personalization */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base font-bold text-gray-900 mb-1">
                Add 3 real messages you&apos;ve sent (optional)
              </p>
              <p className="text-xs text-gray-400 mb-3">
                These examples help AI match your real texting style.
              </p>
            </div>

            {examples.map((example, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Example ${index + 1}`}
                value={example}
                onChange={(e) =>
                  setExamples((prev) => prev.map((item, i) => (i === index ? e.target.value : item)))
                }
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84672]/20 placeholder-gray-300"
              />
            ))}
            <p className="text-[11px] text-gray-400 text-center">
              Optional, but this gives the strongest voice match.
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
