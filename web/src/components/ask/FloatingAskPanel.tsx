"use client";

import { useEffect, useRef, useState } from "react";
import { clarifyDoc } from "@/lib/api";

interface Props {
  question: string;
  docId: string;
  /** Viewport coordinates of the originating selection (used to position the panel) */
  position: { x: number; y: number };
  onClose: () => void;
}

const PANEL_W = 288;

export default function FloatingAskPanel({ question: initialQuestion, docId, position, onClose }: Props) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function submit() {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(false);
    setAnswer(null);
    try {
      const resp = await clarifyDoc({ doc_id: docId, question: q });
      setAnswer(resp.answer);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const left = Math.max(8, Math.min(position.x - PANEL_W / 2, vw - PANEL_W - 8));
  const top = Math.max(8, position.y + 8);

  return (
    <div
      style={{
        position: "fixed",
        left,
        top,
        width: PANEL_W,
        zIndex: 200,
        backgroundColor: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: 12,
        border: "1px solid #e4e4e7",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.04em" }}>✦ Ask</span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", fontSize: 17, lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Ask a question…"
          style={{
            flex: 1,
            padding: "7px 10px",
            border: "1px solid #e4e4e7",
            borderRadius: 7,
            fontSize: 13,
            outline: "none",
            color: "#18181b",
          }}
        />
        <button
          onClick={submit}
          disabled={loading || !question.trim()}
          style={{
            padding: "7px 11px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: loading || !question.trim() ? "default" : "pointer",
            background: loading || !question.trim() ? "#f4f4f5" : "#1e40af",
            color: loading || !question.trim() ? "#a1a1aa" : "white",
            transition: "background 150ms",
          }}
        >
          {loading ? "…" : "→"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>
          Could not fetch answer. Try again.
        </p>
      )}

      {/* Answer */}
      {answer && (
        <p style={{ fontSize: 13, color: "#374151", marginTop: 10, lineHeight: 1.65 }}>
          {answer}
        </p>
      )}
    </div>
  );
}
