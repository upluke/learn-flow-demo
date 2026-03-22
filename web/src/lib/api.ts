import type { ClarifyRequest, ClarifyResponse, CreateDocRequest, MiniDoc } from "./minidoc";

const BASE = "http://localhost:8000";

export async function createMiniDoc(req: CreateDocRequest): Promise<MiniDoc> {
  const res = await fetch(`${BASE}/docs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function clarifyDoc(req: ClarifyRequest): Promise<ClarifyResponse> {
  const res = await fetch(`${BASE}/clarify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}