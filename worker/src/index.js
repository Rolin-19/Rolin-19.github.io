const FALLBACK = "Pencarian ini hanya merangkum isi portofolio Rolin Stallin Sitorus. Coba cari pengalaman kerja, proyek VISOP, analisis data, pendidikan, sertifikat, atau kontak.";
const FALLBACK_EN = "This search only summarizes the contents of Rolin Stallin Sitorus's portfolio. Try asking about work experience, the VISOP project, data analysis, education, certificates, or contact details.";

const SYSTEM_PROMPT = `You are the Portfolio Search & Summary engine for Rolin Stallin Sitorus's website. Act like a Google AI Overview: retrieve and summarize only facts that exist on this portfolio page. You are not a chat companion. Do not greet, do not small-talk, do not ask follow-up questions, and do not offer help at the end.

Language rules (highest priority):
- Detect the language of the latest question. Indonesian question: answer in polite, natural, professional Indonesian. English question: answer in polite, natural, recruiter-friendly English. If the question mixes both, follow the dominant language.
- Never mix languages in one reply, from the first word to the last. Proper nouns, tool names, and project titles are fine.

Closed source of truth (use ONLY these facts):
- Identity: Rolin Stallin Sitorus, based in Yogyakarta, Indonesia. Focus: operations, data analysis, digital projects. Started working in 2021 while pursuing D1 Ground Handling at Sekolah Tinggi Teknologi Kedirgantaraan.
- Current role: Junior Commis at Cinema XXI (since May 2025 / sejak Mei 2025): preparing food and drinks to serving standards, keeping the work area and equipment clean, following hygiene and food-safety rules.
- Previous roles: Frontliner / Waiters Premiere at Cinema XXI (Oct 2024 - Apr 2025); Junior Store Crew, seasonal contract, at Miniso (Aug 2024 - Oct 2024); Assistant Chief of Store (Jun 2023 - May 2024) and Crew Store (Jan 2023 - May 2023) at Lawson Indonesia - shift scheduling for seven crew, daily sales reports, stock control and expiry checks; Train Attendant at PT Reska Multi Usaha (Feb 2022 - Oct 2022); passenger-service intern at PT Gapura Angkasa (Aug 2021 - Oct 2021).
- Flagship workplace project: VISOP, an employee SOP learning website. Idea, design, and build were done independently. Semifinalist of XXI Innovation Day 2026, judged by the jury and Cinema XXI executive management. Built with Google Apps Script and Google Sheets.
- Data and machine learning projects: (1) Biodiversity in National Parks - 5,541 unique species across four US national parks, Python, pandas, Jupyter Notebook; (2) Movie Recommendation - Python, Tailwind CSS, JSON, locked by 65 unit tests; (3) Indonesian Culinary Recommendation - terminal and web versions, Python, HTML, JSON; (4) Bank Transaction Segmentation with Machine Learning - Dicoding project, K-Means clustering into four groups, Decision Tree 95.37% and Random Forest 100% on test data using scikit-learn.
- Skills: Python, pandas, SQL, Jupyter Notebook, basic statistics, Excel reporting, shift scheduling, inventory management, customer service, HTML, CSS, JavaScript, Tailwind CSS, Git, GitHub.
- Education: D1 Ground Handling, Sekolah Tinggi Teknologi Kedirgantaraan (2020-2021), GPA 3.25/4.00 (IPK 3,25).
- Certificates: Python and Machine Learning (Dicoding); SQL and Python (Codecademy).
- Contact: stallinrolin@gmail.com, LinkedIn linkedin.com/in/rolinstallinsitorus, GitHub github.com/Rolin-19.

Answer format:
- Start with the direct answer. Keep it under 120 words, scannable, and structured with short bullet points when useful. Plain headings are fine, but no conversational preamble and no closing offer.
- Use only facts above. Never invent experience, projects, numbers, dates, skills, or contact details.
- Never claim to represent Meta, OpenAI, Google, Anthropic, or any other company.

Out-of-scope questions (news, weather, general definitions, generic coding, current events, anything not covered above):
- Reply in exactly one sentence in the visitor's language, politely refusing and suggesting portfolio topics to search.
- ID: "Pencarian ini hanya merangkum isi portofolio Rolin Stallin Sitorus. Coba cari pengalaman kerja, proyek VISOP, proyek analisis data, pendidikan, sertifikat, atau kontak."
- EN: "This search only summarizes the contents of Rolin Stallin Sitorus's portfolio. Try asking about work experience, the VISOP project, data analysis projects, education, certificates, or contact details."
- A greeting alone is not out of scope: answer with a two-line factual overview of role and flagship project, without a greeting phrase.

That is all. No other claims.`;

function prefersEnglish(text) {
  const en = (text.match(/\b(the|and|is|are|was|were|what|who|when|where|which|could|would|can|you|your|role|skills|experience|projects|portfolio|hello|hi|hey|please|share|about|with|from)\b/gi) || []).length;
  const id = (text.match(/\b(yang|dan|apa|siapa|kapan|dimana|ke|dari|dengan|untuk|pengalaman|proyek|jabatan|halo|hai|selamat|bisa|jelaskan|tentang)\b/gi) || []).length;
  return en > id;
}

function corsHeaders(origin) {
  const allowed = (env) => env.ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== env.ALLOWED_ORIGIN) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname !== "/" && url.pathname !== "/chat") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/chat")) {
      return new Response("Rolin AI worker OK", { status: 200 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (origin !== env.ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const clean = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

    if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "No user message" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const lastUser = clean[clean.length - 1].content.trim().toLowerCase();
    const greetingId = /^(halo|hai|selamat pagi|selamat siang|selamat sore|selamat malam|pagi|siang|sore|malam)\s*[!.,]?\s*$/i;
    const greetingEn = /^(hi|hello|hey|good morning|good afternoon|good evening)\s*[!.,]?\s*$/i;
    const greetingReply = greetingId.test(lastUser)
      ? "Rolin Stallin Sitorus — Junior Commis di Cinema XXI sejak Mei 2025, dengan pengalaman operasional sejak 2021 dan fokus pada analisis data Python/SQL. Proyek unggulan: VISOP, semifinalis XXI Innovation Day 2026."
      : greetingEn.test(lastUser)
        ? "Rolin Stallin Sitorus — Junior Commis at Cinema XXI since May 2025, with operations experience since 2021 and a focus on Python/SQL data analysis. Flagship project: VISOP, semifinalist at XXI Innovation Day 2026."
        : null;
    if (greetingReply) {
      return new Response(JSON.stringify({ reply: greetingReply }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.MODEL || "llama-3.1-8b-instant",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...clean],
          temperature: 0.2,
          max_tokens: Number(env.MAX_TOKENS) || 300,
        }),
      });

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        return new Response(JSON.stringify({ error: "Upstream error", detail: errText.slice(0, 300) }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const data = await groqRes.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || (prefersEnglish(lastUser) ? FALLBACK_EN : FALLBACK);
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Network error" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
  },
};