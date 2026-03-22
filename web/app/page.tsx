"use client";

import { useState } from "react";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import MiniDocView from "@/components/minidoc/MiniDocView";
import ClarifyPanel from "@/components/clarify/ClarifyPanel";
import FloatingAskPanel from "@/components/ask/FloatingAskPanel";
import { createMiniDoc } from "@/lib/api";
import type { MiniDoc } from "@/lib/minidoc";

type SelectionPill = { text: string; x: number; y: number };
type AskPanel = { question: string; x: number; y: number };

export default function Page() {
  const [input, setInput] = useState("");
  const [doc, setDoc] = useState<MiniDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [exploredConcepts, setExploredConcepts] = useState<Set<string>>(new Set());
  const [selectionPill, setSelectionPill] = useState<SelectionPill | null>(null);
  const [askPanel, setAskPanel] = useState<AskPanel | null>(null);

  async function onSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    setActiveConcept(null);
    setExploredConcepts(new Set());
    setSelectionPill(null);
    setAskPanel(null);
    try {
      const res = await createMiniDoc({ input, source: "chat", context_id: null });
      setDoc(res);
    } finally {
      setLoading(false);
    }
  }

  function onConceptClick(term: string) {
    setSelectionPill(null);
    setAskPanel(null);
    if (activeConcept === term) {
      setActiveConcept(null);
      return;
    }
    setActiveConcept(term);
    setExploredConcepts((prev) => new Set(prev).add(term));
  }

  // Fires only for mouseup events originating within the MiniDoc wrapper div
  function handleMainMouseUp() {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setSelectionPill(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) {
        setSelectionPill(null);
        return;
      }
      setAskPanel(null);
      setSelectionPill({
        text: sel.toString().trim(),
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }, 10);
  }

  function handleCopy() {
    if (!selectionPill) return;
    navigator.clipboard.writeText(selectionPill.text).catch(() => {});
    setSelectionPill(null);
    window.getSelection()?.removeAllRanges();
  }

  function handleAsk() {
    if (!selectionPill) return;
    const words = selectionPill.text.trim().split(/\s+/);
    const question = words.length <= 3 ? `What is ${selectionPill.text}?` : "";
    setAskPanel({ question, x: selectionPill.x, y: selectionPill.y });
    setSelectionPill(null);
    window.getSelection()?.removeAllRanges();
  }

  return (
    <>
      <ThreePanelLayout
        left={
          <div style={{ padding: 16 }}>
            <h3 style={{ fontWeight: 700 }}>Topic</h3>
            <div style={{ marginTop: 16 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
                placeholder="e.g. how does DNS work?"
                style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
              />
              <button
                onClick={onSubmit}
                disabled={loading}
                style={{ marginTop: 8, width: "100%", padding: 10, borderRadius: 8 }}
              >
                {loading ? "Generating…" : "Generate MiniDoc"}
              </button>
            </div>
          </div>
        }
        main={
          <div style={{ height: "100%", overflowY: "auto" }} onMouseUp={handleMainMouseUp}>
            {doc ? (
              <MiniDocView
                doc={doc}
                onConceptClick={onConceptClick}
                onConceptClose={() => setActiveConcept(null)}
                activeConcept={activeConcept}
                exploredConcepts={exploredConcepts}
              />
            ) : (
              <div style={{ padding: 16, opacity: 0.7 }}>
                No MiniDoc yet. Enter a topic on the left.
              </div>
            )}
          </div>
        }
        right={<ClarifyPanel docId={doc?.id ?? null} />}
      />

      {/* Selection tooltip pill — appears above the selected text */}
      {selectionPill && !askPanel && (
        <div
          style={{
            position: "fixed",
            left: selectionPill.x,
            top: selectionPill.y - 40,
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              background: "white",
              borderRadius: 8,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              border: "1px solid #e4e4e7",
              padding: "4px 8px",
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={handleCopy}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: "2px 4px" }}
            >
              Copy
            </button>
            <span style={{ color: "#d4d4d8" }}>·</span>
            <button
              onClick={handleAsk}
              disabled={!doc}
              style={{
                background: "none",
                border: "none",
                cursor: doc ? "pointer" : "default",
                color: doc ? "#4f46e5" : "#a1a1aa",
                fontWeight: 600,
                padding: "2px 4px",
              }}
            >
              ✦ Ask
            </button>
          </div>
        </div>
      )}

      {/* Floating ask panel */}
      {askPanel && doc && (
        <FloatingAskPanel
          question={askPanel.question}
          docId={doc.id}
          position={{ x: askPanel.x, y: askPanel.y }}
          onClose={() => setAskPanel(null)}
        />
      )}
    </>
  );
}
