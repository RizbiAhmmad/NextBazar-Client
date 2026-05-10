"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { queryRagService, ingestDataService } from "@/services/rag.services";
import { getUserInfo } from "@/services/auth.services";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  matchInfo?: string;   
  isError?: boolean;
  queryToRetry?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! I'm your NextBazar AI assistant 👋\n\nAsk me anything about our products, categories, or shops. I'll find exactly what you're looking for.",
  },
];

const SUGGESTED_QUERIES = [
  "What are the best categories?",
  "Recommend some fresh products",
  "How can I become a seller?",
];

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onRetry }: { message: Message; onRetry?: (query: string) => void }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${isUser ? "bg-slate-800" : "bg-primary"}`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "bg-primary text-white rounded-2xl rounded-br-sm shadow-md" : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm shadow-sm"}`}>
          {message.content}
        </div>
        {message.isError && onRetry && message.queryToRetry && (
          <button onClick={() => onRetry(message.queryToRetry!)} className="flex items-center gap-1 text-[10px] text-primary hover:underline font-medium mt-1">
            <RefreshCw size={10} /> Retry
          </button>
        )}
        {!isUser && message.matchInfo && (
          <span className="inline-flex items-center gap-1 text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-bold">
            <Sparkles size={8} /> {message.matchInfo}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, startQueryTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [userRole, setUserRole] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdCounter = useRef(0);

  const getNextId = () => {
    messageIdCounter.current += 1;
    return messageIdCounter.current;
  };

  useEffect(() => {
    const fetchRole = async () => {
      const user = await getUserInfo();
      setUserRole(user?.role || null);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSync = () => {
    startSyncTransition(async () => {
      const result = await ingestDataService();
      if (result.success) {
        toast.success(`Marketplace data synced!`, {
          description: "All products and categories are now indexed.",
        });
      } else {
        toast.error("Sync failed", { description: result.message || "Failed to sync marketplace data." });
      }
    });
  };

  const handleSend = (query?: string) => {
    const text = (query ?? inputValue).trim();
    if (!text || isQuerying) return;

    const userMsg: Message = { id: `user-${getNextId()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    startQueryTransition(async () => {
      const res = await queryRagService({ query: text });
      
      const botMsg: Message = {
        id: `bot-${getNextId()}`,
        role: "bot",
        content: res.success ? res.data.answer : (res.message || "Something went wrong. Please try again."),
        matchInfo: res.success && res.data.sources?.length > 0 ? `${res.data.sources.length} sources matched` : undefined,
        isError: !res.success,
        queryToRetry: !res.success ? text : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    });
  };

  return (
    <>
      <div className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-[2rem] shadow-2xl border border-slate-200/50 overflow-hidden bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"}`} style={{ maxHeight: "70vh" }}>
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none uppercase tracking-tighter">NextBazar AI</p>
              <p className="text-white/60 text-[10px] font-bold mt-1">SMART ASSISTANT</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <button onClick={handleSync} disabled={isSyncing} className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30 scrollbar-hide" style={{ minHeight: "300px" }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
          ))}
          {isQuerying && <TypingIndicator />}
          {messages.length === 1 && !isQuerying && (
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Suggested Queries</p>
              {SUGGESTED_QUERIES.map((q) => (
                <button key={q} onClick={() => handleSend(q)} className="text-left text-xs bg-white border border-slate-100 text-slate-600 px-4 py-2.5 rounded-2xl hover:border-primary/30 hover:text-primary transition-all shadow-sm">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 p-4 bg-white border-t border-slate-50">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isQuerying}
              className="flex-1 text-sm bg-slate-100 border-none focus:bg-slate-50 rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-slate-400"
            />
            <button type="submit" disabled={isQuerying || !inputValue.trim()} className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 shrink-0">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ${isOpen ? "rotate-90" : ""}`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && <span className="absolute inset-0 rounded-[1.5rem] bg-primary opacity-30 animate-ping" />}
      </button>
    </>
  );
}
