import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "dashboard", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get("shared-state", { type: "json" });
    return Response.json(data || { queues: [], updatedAt: null, updatedBy: null });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const state = {
      queues: body.queues,
      updatedAt: new Date().toISOString(),
      updatedBy: body.userName || "Anonymous",
    };
    await store.setJSON("shared-state", state);
    return Response.json({ ok: true, updatedAt: state.updatedAt });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/dashboard-data",
};
