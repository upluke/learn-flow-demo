"use client";

import { useMemo, useState } from "react";
import { clarifyDoc } from "@/lib/api";

type Turn = { q: string; a: string; at: string };

export default function ClarifyPanel({ docId }: { docId: string | null }) {
  const [open, setOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = !docId || loading;

  async function onAsk() {
    if (!docId) return;
    const q = question.trim();
    if (!q) return;

    setLoading(true);
    try {
      const resp = await clarifyDoc({ doc_id: docId, question: q });
      setTurns((prev) => [...prev, { q, a: resp.answer, at: resp.last_updated }]);
      setSummary(resp.summary);
      setQuestion("");
      if (!open) setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const headerHint = useMemo(() => {
    if (!docId) return "Create a MiniDoc first";
    return "Follow-ups live here — MiniDoc stays unchanged";
  }, [docId]);

  return (
    <div className="h-full border-l p-3 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold">Clarify</div>
          <div className="text-xs text-gray-600">{headerHint}</div>
        </div>
        <button className="text-sm underline" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <>
          {summary && (
            <div className="mt-3 rounded border p-2 text-sm">
              <div className="font-medium">What you seem stuck on</div>
              <div className="text-gray-700">{summary}</div>
            </div>
          )}

          <div className="mt-3 flex-1 overflow-auto space-y-3 text-sm">
            {turns.map((t, i) => (
              <div key={i} className="space-y-1">
                <div className="font-medium">Q: {t.q}</div>
                <div className="text-gray-700">A: {t.a}</div>
                <div className="text-xs text-gray-500">{t.at}</div>
              </div>
            ))}
            {turns.length === 0 && (
              <div className="text-sm text-gray-600 mt-3">
                Ask one focused follow-up. Keep the main MiniDoc clean.
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-3 flex gap-2">
        <input
          className="w-full rounded border p-2 text-sm"
          placeholder={docId ? "Ask a follow-up..." : "Create a MiniDoc first"}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={!docId}
          onKeyDown={(e) => { if (e.key === "Enter") onAsk(); }}
        />
        <button
          className="rounded border px-3 text-sm"
          onClick={onAsk}
          disabled={disabled}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
