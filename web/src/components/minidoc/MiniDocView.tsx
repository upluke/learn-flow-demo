import type { MiniDoc } from "../../lib/minidoc";
import InlineHalo from "./InlineHalo";

/**
 * Splits `text` around `concepts` terms and wraps each first occurrence
 * in a clickable span. Longer terms are matched first to avoid partial matches.
 */
function renderWithConcepts(
  text: string,
  concepts: string[],
  onConceptClick?: (term: string) => void,
  explored: Set<string> = new Set()
): React.ReactNode {
  if (!concepts.length) return text;

  const sorted = [...concepts].sort((a, b) => b.length - a.length);
  const pattern = sorted.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "g");

  const parts = text.split(regex);
  const seen = new Set<string>();

  return parts.map((part, i) => {
    if (concepts.includes(part) && !seen.has(part)) {
      seen.add(part);
      const isExplored = explored.has(part);
      return (
        <span
          key={i}
          className={isExplored ? "concept-term-explored" : "concept-term"}
          onClick={() => onConceptClick?.(part)}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function MiniDocView({
  doc,
  onConceptClick,
  onConceptClose,
  exploredConcepts = new Set(),
  activeConcept = null,
}: {
  doc: MiniDoc;
  onConceptClick?: (term: string) => void;
  onConceptClose?: () => void;
  exploredConcepts?: Set<string>;
  activeConcept?: string | null;
}) {
  const allConcepts = [
    ...doc.core_idea.concepts,
    ...doc.mental_model.concepts,
    ...doc.worked_example.concepts,
  ];

  const showHalo = activeConcept !== null && allConcepts.includes(activeConcept);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{doc.topic}</h2>
      <p style={{ marginTop: 4, fontStyle: "italic" }}>{doc.hook}</p>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 700 }}>Core Idea</h3>
        <p>{renderWithConcepts(doc.core_idea.text, doc.core_idea.concepts, onConceptClick, exploredConcepts)}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 700 }}>Mental Model</h3>
        <p>{renderWithConcepts(doc.mental_model.text, doc.mental_model.concepts, onConceptClick, exploredConcepts)}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 700 }}>Worked Example</h3>
        <p>{renderWithConcepts(doc.worked_example.text, doc.worked_example.concepts, onConceptClick, exploredConcepts)}</p>
        {doc.worked_example.code_example && (
          <pre style={{ marginTop: 8, padding: 12, background: "#18181b", color: "#f4f4f5", borderRadius: 6, overflowX: "auto", fontSize: 13 }}>
            <code>{doc.worked_example.code_example}</code>
          </pre>
        )}
        {doc.worked_example.code_breakdown && (
          <p style={{ marginTop: 6, fontSize: 13, color: "#71717a" }}>{doc.worked_example.code_breakdown}</p>
        )}
      </section>

      {showHalo && onConceptClose && (
        <InlineHalo
          term={activeConcept}
          docId={doc.id}
          onClose={onConceptClose}
        />
      )}

      <section style={{ marginTop: 16 }}>
        <h3 style={{ fontWeight: 700 }}>Quick Checks</h3>
        <ol style={{ marginTop: 8, paddingLeft: 20 }}>
          {doc.quick_checks.map((qc, i) => (
            <li key={i} style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 600 }}>{qc.question}</p>
              <p style={{ marginTop: 2, fontSize: 13, color: "#71717a" }}>Hint: {qc.hint}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
