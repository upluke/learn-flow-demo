export type MiniDocSection = {
  text: string;
  concepts: string[];
};

export type WorkedExampleSection = MiniDocSection & {
  code_example: string;
  code_breakdown: string;
};

export type QuickCheck = {
  question: string;
  hint: string;
  anchor_text: string;
  anchor_section_key: "core_idea" | "mental_model" | "worked_example";
  type: "recall" | "apply" | "connect";
};

export type MiniDoc = {
  id: string;
  topic: string;
  hook: string;
  core_idea: MiniDocSection;
  mental_model: MiniDocSection;
  worked_example: WorkedExampleSection;
  quick_checks: QuickCheck[];
  mastery: number;     // 0..1
  created_at: string;  // ISO date-time
};

export type CreateDocRequest = {
  input: string;
  source: "chat" | "pdf";
  context_id: string | null;
};

export type ClarifyRequest = {
  doc_id: string;
  question: string;
};

export type ClarifyResponse = {
  doc_id: string;
  answer: string;
  summary: string;
  last_updated: string; // ISO datetime
};
