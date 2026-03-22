"use client";

import { useEffect, useState } from "react";
import { clarifyDoc } from "@/lib/api";

export default function InlineHalo({
  term,
  docId,
  onClose,
}: {
  term: string;
  docId: string;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setAnswer(null);
    setError(false);
    clarifyDoc({ doc_id: docId, question: `What is ${term}?` })
      .then((resp) => setAnswer(resp.answer))
      .catch(() => setError(true));
  }, [term, docId]);

  return (
    <div
      style={{
        marginTop: 12,
        padding: "12px 14px",
        background: "#f8fafc",
        borderLeft: "3px solid #93c5fd",
        borderRadius: "0 6px 6px 0",
        fontSize: 14,
        lineHeight: 1.6,
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        title="Close"
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          background: "none",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
          color: "#94a3b8",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <div style={{ fontWeight: 600, color: "#1e40af", marginBottom: 6 }}>
        {term}
      </div>

      {error ? (
        <div style={{ color: "#ef4444" }}>Could not load explanation. Try again.</div>
      ) : answer === null ? (
        <div style={{ color: "#94a3b8" }}>Loading…</div>
      ) : (
        <div style={{ color: "#374151" }}>{answer}</div>
      )}
    </div>
  );
}
