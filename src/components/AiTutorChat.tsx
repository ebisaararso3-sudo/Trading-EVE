import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, Globe, HelpCircle, BookOpen, Sparkles, Check, Volume1 } from "lucide-react";
import { ChatMessage, Book } from "../types";
import { translations } from "../languages";

interface AiTutorChatProps {
  lang: "en" | "om" | "am";
  authToken: string;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  books?: Book[];
}

export default function AiTutorChat({ lang, authToken, initialPrompt, onClearInitialPrompt, books = [] }: AiTutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  // Book study context parameters
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [autopilot, setAutopilot] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = translations[lang];

  // Pull initial chat history or populate default starting messages matching Screenshot 4
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats", {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length === 0) {
          // Setup Screenshot 4 default values if empty chat
          const defaultMsgs: ChatMessage[] = [
            {
              id: "msg-default-1",
              userId: "u-student",
              role: "user",
              content: "Akkam jirtu, 'Ammaa & AI'? Oromoo keessatti gargaarsa barbaada.",
              language: "om",
              timestamp: new Date(Date.now() - 600000).toISOString(),
            },
            {
              id: "msg-default-2",
              userId: "model",
              role: "model",
              content: "Akkam jirtu! Eeyyee, si gargaaruuf as jira. Maal beekuu barbaadda?",
              language: "om",
              timestamp: new Date(Date.now() - 500000).toISOString(),
            },
            {
              id: "msg-default-3",
              userId: "u-student-2",
              role: "user",
              content: "Waa'ee seenaa Oromoo natti himuu dandeessu?",
              language: "om",
              timestamp: new Date(Date.now() - 400000).toISOString(),
            },
            {
              id: "msg-default-4",
              userId: "model",
              role: "model",
              content: "Seenaan Oromoo baay'ee bal'aa fi miidhagaadha. Fakkeenyaaf, Sirna Gadaa dhimma dimokiraasii jalqabaati...",
              language: "om",
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
          ];
          setMessages(defaultMsgs);
        } else {
          setMessages(data);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setError("");
    setLoading(true);

    const tempMsgId = "temp-user-" + Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: tempMsgId,
        userId: "user",
        role: "user",
        content: userMsg,
        language: lang,
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          message: userMsg, 
          language: lang,
          bookId: selectedBookId || undefined,
          autopilot: autopilot
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with AI");
      }

      await fetchChats();

      if (isSpeaking && data.modelResponse?.content) {
        speakMessage(data.modelResponse.content, data.modelResponse.id || "last-ai");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your tutoring conversation?")) return;
    try {
      await fetch("/api/chats/clear", {
        method: "POST",
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      setMessages([]);
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const speakMessage = (text: string, msgId: string) => {
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingMessageId(msgId);

    const cleanText = text
      .replace(/```[\s\S]*?```/g, "[Code block skipped]")
      .replace(/\$\$[\s\S]*?\$\$/g, "[Equation skipped]")
      .replace(/[*#_`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "am" ? "am-ET" : "en-US";
    utterance.rate = 0.95;
    
    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === "am" ? "am-ET" : lang === "om" ? "en-US" : "en-US";

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(text);
      };
      rec.onerror = (e: any) => {
        console.error("STT error", e);
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this device. Try Chrome!");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).replace(/^(dart|javascript|typescript|python|html|css)\n/, "");
        return (
          <div key={idx} className="my-2.5 font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto border border-white/5 relative">
            <span className="absolute top-1 right-2 text-[8px] uppercase text-gray-500 font-bold">Code</span>
            <pre className="whitespace-pre">{code}</pre>
          </div>
        );
      } else if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        return (
          <div key={idx} className="my-2 text-center p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/15 font-bold italic">
            {math}
          </div>
        );
      }
      return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F6FD] max-w-lg mx-auto w-full rounded-[36px] overflow-hidden shadow-2xl border border-gray-200/60 h-[calc(100vh-140px)] relative text-gray-800">
      
      {/* 1. HEADER CARD (Ammaa & AI orange/yellow/blue gradient from Screenshot 4) */}
      <div className="bg-gradient-to-r from-[#DF7649] via-[#E49352] to-[#408FEA] px-5 py-4 flex flex-col shrink-0 text-white relative shadow-md">
        
        {/* Header toolbar icons */}
        <div className="flex justify-between items-center mb-2">
          {/* Top title info with chat and brain connected lines */}
          <div className="flex items-center gap-2">
            {/* SVG Speak bubble */}
            <div className="bg-white/15 p-1.5 rounded-full backdrop-blur-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide leading-tight flex items-center gap-1">
                Ammaa & AI
              </h2>
              <p className="text-[9px] text-orange-100 font-bold tracking-wider">
                {lang === "om" ? "Afaan Oromoo" : lang === "am" ? "አማርኛ" : "English"} Komuniikeeshinii AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-xl">
            {/* TTS Speak controls */}
            <button
              onClick={() => {
                const speakOn = !isSpeaking;
                setIsSpeaking(speakOn);
                if (!speakOn) window.speechSynthesis.cancel();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isSpeaking ? "text-amber-300" : "text-white/70"}`}
              title={isSpeaking ? "TTS On" : "TTS Off"}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Clear button */}
            <button
              onClick={handleClearHistory}
              className="p-1.5 hover:text-red-300 text-white/70 transition-colors cursor-pointer"
              title="Clear history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Banner section: "Ammaa & AI: Bakka AI ittiin keessatti haasofsiisan" */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 mt-1 border border-white/10 text-center">
          <p className="text-[10px] sm:text-[11px] font-black tracking-wide">
            {lang === "om" ? "Ammaa & AI: Bakka AI ittiin keessatti haasofsiisan" : lang === "am" ? "Ammaa & AI: ከኤአይ ጋር በቋንቋዎ የሚወያዩበት ቦታ" : "Ammaa & AI: The place where you converse with AI"}
          </p>
        </div>
      </div>

      {/* 1.5 ACTIVE STUDY BOOK BAR */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-purple-100 p-1.5 rounded-xl text-[#5B37D4] shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <label className="block text-[8px] uppercase font-black text-gray-400 tracking-wider">
              {lang === "om" ? "Kitaaba Qorannoo Adhaan" : lang === "am" ? "መማሪያ መጽሐፍ" : "Active Study Book"}
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                if (e.target.value) {
                  const bk = books.find(b => b.id === e.target.value);
                  if (bk) {
                    setInput(lang === "om" ? `Kitaaba "${bk.title}" natti barsisi. Barnoota hunda jalqabi.` : lang === "am" ? `መጽሐፉን "${bk.title}" አስተምረኝ። ትምህርቱን ጀምር።` : `Please teach me step-by-step from "${bk.title}".`);
                  }
                }
              }}
              className="w-full text-[11px] font-extrabold text-gray-800 bg-transparent border-none p-0 outline-none focus:ring-0 cursor-pointer truncate"
            >
              <option value="">{lang === "om" ? "🎓 AI Barnoota Waliigalaa (Kitaaba malee)" : lang === "am" ? "🎓 አጠቃላይ ትምህርት (ያለ መጽሐፍ)" : "🎓 General AI Tutor (No book active)"}</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  📚 {b.title} ({b.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-gray-100">
          <div className="text-right">
            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest">{lang === "om" ? "Gargaartuu Ofiisaa" : lang === "am" ? "አውቶ ፓይለት መምህር" : "Tutor Autopilot"}</span>
            <span className="block text-[9px] font-black text-purple-600 uppercase">{autopilot ? (lang === "om" ? "ON / NUKU" : lang === "am" ? "ንቁ" : "Active") : (lang === "om" ? "OFF" : lang === "am" ? "ጠፍቷ" : "Inactive")}</span>
          </div>
          <button
            type="button"
            onClick={() => setAutopilot(!autopilot)}
            className={`h-5.5 w-10 rounded-full p-0.5 transition-colors duration-300 relative ${autopilot ? "bg-[#5B37D4]" : "bg-gray-300"}`}
          >
            <div className={`h-4.5 w-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${autopilot ? "translate-x-4.5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* 2. CHAT BUBBLE WORKSPACE (Custom colors matching Screenshot 4) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#E7EEF8] to-[#F1F4FA]">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse text-right" : "flex-row text-left"} animate-in fade-in duration-200`}
            >
              {/* Profile Avatar custom matching Screenshot 4 */}
              <div className="shrink-0">
                {isUser ? (
                  <img 
                    src={msg.id.includes("1") 
                      ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" // lady avatar
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" // boy avatar
                    }
                    alt="User" 
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                  />
                ) : (
                  // Robot Icon matches Screenshot 4 blue round robot icon
                  <div className="h-9 w-9 bg-sky-100 border border-sky-300 rounded-full flex items-center justify-center text-sky-600 shadow-sm">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Chat Bubble Matches Screenshot 4 Colors */}
              <div
                className={`max-w-[75%] rounded-[20px] p-3 shadow-sm relative ${
                  isUser
                    ? "bg-[#D6EBFB] text-[#1E3A5F] border border-[#BFDDF5] rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                <div className="text-[12px] sm:text-xs leading-relaxed font-semibold text-left">
                  {renderMessageContent(msg.content)}
                </div>

                {/* Animated Voice soundwaves if active speaking */}
                {!isUser && speakingMessageId === msg.id && (
                  <div className="mt-2.5 flex items-center gap-1 bg-purple-50 rounded-xl p-1.5 border border-purple-100 animate-pulse text-[10px] text-purple-600 font-extrabold">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-ping"></span>
                    <span className="mr-1">AI speaking...</span>
                    <div className="flex gap-0.5 items-end h-2.5">
                      <div className="w-0.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-0.5 h-2.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                      <div className="w-0.5 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-gray-100/40">
                  {/* Inline Speaker button */}
                  {!isUser ? (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.content, msg.id)}
                      className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-md cursor-pointer transition-all ${
                        speakingMessageId === msg.id
                          ? "bg-purple-600 text-white animate-pulse"
                          : "text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <Volume1 className="h-3 w-3 shrink-0" />
                      {speakingMessageId === msg.id ? (lang === "om" ? "Dhaabi" : lang === "am" ? "አቁም" : "Stop") : (lang === "om" ? "Dubbisi" : lang === "am" ? "አንብብ" : "Speak")}
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <div className="text-[8px] text-right text-gray-400 font-bold">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-end">
            <div className="h-9 w-9 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 border border-sky-300 shadow-sm animate-bounce">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div className="bg-white/80 border border-gray-150 rounded-[20px] rounded-bl-none px-4 py-3 shadow-sm max-w-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce"></span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Coach is writing...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-xl text-[11px] text-red-600 font-bold">
            {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 3. ASSISTANT PILL ACTION SHORTCUTS (Screenshot 4: Qooqa filadhu, Gargaarsa argadhu) */}
      <div className="bg-[#F1F4FA] px-4 py-2 flex gap-2 justify-center shrink-0 border-t border-gray-150">
        <button
          onClick={() => {
            setInput(lang === "om" ? "Afaan biraa filachuu nan danda'aa?" : lang === "am" ? "ሌላ ቋንቋ መምረጥ እችላለሁ?" : "Can I change my language?");
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-[11px] font-black text-gray-700 shadow-sm transition-all cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-orange-500" />
          {lang === "om" ? "Qooqa filadhu" : lang === "am" ? "ቋንቋ ምረጥ" : "Choose language"}
        </button>

        <button
          onClick={() => {
            setInput(lang === "om" ? "Gargaarsa dabalataa maal akka ta'e natti himi" : lang === "am" ? "እንዴት ልታግዘኝ ትችላለህ?" : "How can you help me?");
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-[11px] font-black text-gray-700 shadow-sm transition-all cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-orange-500" />
          {lang === "om" ? "Gargaarsa argadhu" : lang === "am" ? "እርዳታ አግኝ" : "Get help"}
        </button>
      </div>

      {/* 4. CHAT INPUT WITH ORANGE ACTIONS (Screenshot 4 bottom) */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-3.5 shrink-0 flex items-center gap-2">
        
        {/* Rounded Input Field matches Screenshot 4 */}
        <div className="flex-1 bg-[#F1F4FB] rounded-full px-4 py-2.5 flex items-center border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "om" ? "Barreessi..." : lang === "am" ? "ጻፍ..." : "Write..."}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:ring-0"
          />
        </div>

        {/* Orange Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-[#DF7649] hover:opacity-90 text-white"
          }`}
          title="Mic input"
        >
          {isListening ? <Mic className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Orange Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="h-10 w-10 bg-[#DF7649] disabled:opacity-40 hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-sm transition-all cursor-pointer"
        >
          <Send className="h-4.5 w-4.5 transform rotate-0" />
        </button>
      </form>
    </div>
  );
}
