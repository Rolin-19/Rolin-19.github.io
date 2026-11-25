const UPSTREAM = "https://rolin-ai-v2.stallinrolin.workers.dev/chat";

function upstreamHeaders(request) {
  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Origin", request.headers.get("Origin") || "https://rolin-19.github.io");
  const requestMethod = request.headers.get("Access-Control-Request-Method");
  if (requestMethod) headers.set("Access-Control-Request-Method", requestMethod);
  const requestHeaders = request.headers.get("Access-Control-Request-Headers");
  if (requestHeaders) headers.set("Access-Control-Request-Headers", requestHeaders);
  return headers;
}

export async function onRequest(context) {
  const request = context.request;
  const origin = request.headers.get("Origin") || "https://rolin-19.github.io";

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
      },
    });
  }

  // Validasi payload kosong di edge agar tidak crash upstream lama.
  if (request.method === "POST") {
    try {
      const clone = request.clone();
      const body = await clone.json();
      const msgs = Array.isArray(body && body.messages) ? body.messages : [];
      const clean = msgs.filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string");
      if (clean.length === 0 || (clean[clean.length - 1] && clean[clean.length - 1].role !== "user")) {
        return new Response(JSON.stringify({ error: "No user message" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Vary": "Origin",
          },
        });
      }
    } catch (e) {
      // biarkan upstream yang menangani jika body bukan JSON
    }
  }

  const init = {
    method: request.method,
    headers: upstreamHeaders(request),
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(UPSTREAM, init);
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Upstream Rolin AI tidak tersedia." }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Vary": "Origin",
        },
      },
    );
  }
}
