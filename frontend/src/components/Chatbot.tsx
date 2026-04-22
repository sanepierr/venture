"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { PredictResponse, Prediction } from "@/lib/api";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function Chatbot({ data }: { data: PredictResponse | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    // Reset chat when new data
    if (data) setMessages([]);
  }, [data]);

  const getBotResponse = (query: string): string => {
    if (!data) return "Pick a location first!";
    const top = data.recommendations[0];
    const q = query.toLowerCase();

    if (q.includes("why") || q.includes("reason") || q.includes(top.category.toLowerCase())) {
      const cat = top.category.toLowerCase();
      const anchors = data.anchors;
      let reasons = [];
      if (anchors.schools >= 3) reasons.push("Proximity to schools boosts daytime foot traffic.");
      if (anchors.taxi_stages >= 2) reasons.push("High commuter traffic from taxi stages.");
      if (anchors.population_density >= 70) reasons.push("Dense population ensures steady customers.");
      if (data.competitors[top.category] <= 1) reasons.push(`Low competition (${data.competitors[top.category] || 0}).`);
      return `${top.category} scores high (${Math.round(top.score*100)}%) because: ${reasons.join(" ")}`;
    }

    if (q.includes("cost") || q.includes("startup")) {
      return `Typical ${top.category} startup: UGX 5M-20M (inventory/shop rent). Low-revenue quick-service (<UGX 100k/day) needs less capital.`;
    }

    if (q.includes("risk") || q.includes("survival")) {
      return `12mo survival: ${Math.round(top.survival_12mo*100)}%. Favors ${(top.survival_12mo > 0.7 ? "stable" : "riskier")} ops. Watch competitors: ${data.competitors[top.category] || 0}.`;
    }

    if (q.includes("revenue")) {
      return `Expected daily: UGX ${top.daily_revenue_ugx[0].toLocaleString()}–${top.daily_revenue_ugx[1].toLocaleString()}. Scales with score/traffic.`;
    }

    if (q.includes("schools") || q.includes("taxi") || q.includes("market")) {
      return `Area profile: ${data.anchors.schools} schools, ${data.anchors.taxi_stages} stages, ${data.anchors.markets} markets, ${data.anchors.population_density}% density.`;
    }

    // Fallback
    return `Top pick: ${top.category} (${Math.round(top.score*100)}%). Ask about "why", "cost", "risk", or features!`;
  };

  const sendMessage = () => {
    if (!input.trim() || !data) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const botMsg: Message = { role: "bot", content: getBotResponse(input) };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : "72px" }}
      className="border-t border-[var(--border)] bg-[var(--surface)] px-7 py-4"
    >
      <AnimatePresence mode="wait">
        {data && !isOpen && (
          <motion.button
            key="toggle"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 w-full text-left p-0 h-12 opacity-60 hover:opacity-100 transition-opacity"
          >
            <MessageCircle size={18} className="text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--ink)]">Ask about this location…</span>
          </motion.button>
        )}
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-xs text-[var(--ink-muted)] italic pt-2">
                Ask "Why [top business]?" or "Startup costs?" etc.
              </div>
            )}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user" ? "bg-[var(--accent)] text-[var(--bg-surface)]" : "bg-[var(--bg)] border border-[var(--border)]"}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about business viability..."
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2 text-sm outline-none placeholder:text-[var(--ink-subtle)]"
              />
              <button onClick={sendMessage} disabled={!input.trim() || !data} className="p-2 rounded-full border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-40">
                <Send size={16} />
              </button>
              <button onClick={() => { setIsOpen(false); setMessages([]); setInput(""); }} className="p-2 rounded-full border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

