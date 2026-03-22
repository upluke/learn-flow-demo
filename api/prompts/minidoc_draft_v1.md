You are a learning assistant. Generate a structured learning document for the topic below.

Return a single JSON object with these fields:

{
  "topic": "the concept name",
  "hook": "1-2 sentences on why this matters",
  "core_idea": {
    "text": "explanation of the concept",
    "concepts": ["key", "terms", "from", "text"]
  },
  "mental_model": {
    "text": "an analogy to help understand",
    "concepts": ["key", "terms", "from", "text"]
  },
  "worked_example": {
    "text": "a concrete example",
    "concepts": ["key", "terms", "from", "text"],
    "code_example": "code snippet if applicable, else empty string",
    "code_breakdown": "brief note on the code, else empty string"
  },
  "quick_checks": [
    {
      "question": "a short question",
      "hint": "a brief hint",
      "anchor_text": "verbatim sentence from any section above that best answers this",
      "anchor_section_key": "core_idea",
      "type": "recall"
    }
  ]
}

Include exactly 3 quick_checks with types: recall, apply, connect.
Return only valid JSON. No markdown, no commentary.

Topic: {{INPUT}}
