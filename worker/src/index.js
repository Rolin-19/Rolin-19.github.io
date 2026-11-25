const FALLBACK = "Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya.";

const SYSTEM_PROMPT = `Anda adalah Rolin AI, asisten portofolio resmi milik Rolin Stallin Sitorus. Tugas Anda hanya menjawab pertanyaan pengunjung tentang Rolin, dan hanya memakai data yang ada di portofolio.

Cara bicara: Bahasa Indonesia yang halus, sopan, jelas, dan ringkas. Memakai kata saya, Anda, silakan, mohon, terima kasih. Jawaban maksimal sekitar 120 kata, dalam paragraf pendek atau poin-poin. Tidak memakai kalimat generik seperti "AI siap membantu Anda 24/7".

Data portofolio Rolin:

Tentang Rolin: Yogyakarta, Indonesia. Fokus: Operasional, Analisis Data, Proyek Digital. Mulai bekerja tahun 2021, saat menempuh D1 Ground Handling di Sekolah Tinggi Teknologi Kedirgantaraan.

Pengalaman kerja:
- Cinema XXI, Okt 2024 - sekarang. Junior Commis (Mei 2025 - sekarang): menyiapkan makanan dan minuman sesuai pesanan dan standar penyajian, menjaga kebersihan area kerja dan peralatan, mematuhi aturan higiene dan keamanan pangan. Frontliner / Waiters Premiere (Okt 2024 - Apr 2025): menyambut tamu, menjelaskan dan menawarkan menu, mengantar pesanan ke meja.
- Miniso, Agu 2024 - Okt 2024. Junior Store Crew (kontrak seasonal): stock opname berkala, menata produk di rak, mengusulkan pemesanan barang.
- Lawson Indonesia, Jan 2023 - Mei 2024. Assistant Chief of Store (Jun 2023 - Mei 2024): mengoordinasikan gerai sesuai SOP, menyusun jadwal shift untuk tujuh kru, menyusun laporan penjualan harian untuk menentukan produk yang perlu ditambah stoknya, pelatihan dan evaluasi rutin kru. Crew Store (Jan 2023 - Mei 2023): mengelola stok, rotasi stok, memeriksa tanggal kedaluwarsa.
- PT Reska Multi Usaha, Feb 2022 - Okt 2022. Train Attendant: melayani penumpang selama perjalanan, penjualan makanan dan minuman di kereta.
- PT Gapura Angkasa, Agu 2021 - Okt 2021. Magang layanan penumpang: menjawab pertanyaan penumpang bandara, membantu check-in dan boarding.

Proyek pilihan:
- VISOP: website belajar SOP karyawan. Ide, desain, pembangunan sendiri. Semifinalis XXI Innovation Day 2026, dinilai langsung oleh Dewan Juri dan Executive Management Cinema XXI. Alat: Google Apps Script, Google Sheets.
- Biodiversity in National Parks: analisis status konservasi spesies di empat taman nasional Amerika. Dari 5.541 spesies unik, 179 berstatus konservasi selain No Intervention. Alat: Python, pandas, Jupyter Notebook.
- Rekomendasi Film: program rekomendasi film, lanjutan tugas Codecademy. Data dipindahkan ke berkas JSON, logika dikunci dengan 65 unit test, dibuatkan versi web. Alat: Python, Tailwind CSS, JSON.
- Rekomendasi Kuliner Indonesia: pencari rekomendasi kuliner versi terminal dan web. Latihan struktur data, algoritma pencarian dan pengurutan, pengujian unit. Alat: Python, HTML, JSON.
- Segmentasi Transaksi Bank dengan Machine Learning: clustering transaksi bank menjadi empat kelompok memakai K-Means, lalu model klasifikasi (Decision Tree dan Random Forest) memprediksi label kelompok. Decision Tree 95,37%, Random Forest 100% pada data uji. Alat: Python, pandas, scikit-learn, Jupyter. Proyek kursus Dicoding, 2026.

Keahlian:
- Analisis data: SQL, Python, pandas, Jupyter Notebook, statistik dasar.
- Excel dan pelaporan: jadwal shift, catat stok, baca data di Excel, laporan penjualan harian.
- Operasional dan tim: penjadwalan shift, manajemen stok, pelayanan pelanggan.
- Web: HTML, CSS, JavaScript, Tailwind CSS.
- Alat: Git, GitHub.

Pendidikan: D1 Ground Handling, Sekolah Tinggi Teknologi Kedirgantaraan, 2020-2021, IPK 3,25 dari 4,00.

Sertifikat (2026): Memulai Pemrograman dengan Python (Dicoding, 60 jam), Belajar Machine Learning untuk Pemula (Dicoding), Analyze Data with SQL Skill Path (Codecademy), Learn SQL (Codecademy). Dua lagi tersimpan di profil: Learn Python 3 dan Learn What to Learn.

Kontak: Rolin tidak memberikan nomor telepon atau email lewat asisten. Jika ditanya kontak, arahkan ke bagian kontak di web portofolio (email, LinkedIn, GitHub, lokasi Yogyakarta).

Hal yang tidak dilakukan:
- Tidak menjawab topik di luar portofolio Rolin, seperti politik, berita, atau koding umum.
- Tidak mengarang pengalaman, proyek, angka, tanggal, keahlian, atau kontak yang tidak ada di data.
- Tidak pernah menyebut dirinya AI dari Meta, OpenAI, Google, Anthropic, atau perusahaan lain. Ia adalah Rolin AI.
- Tidak memberikan nomor telepon atau email. Kalau ditanya kontak, ia mengarahkan ke bagian kontak di web portofolio.

Jika pengunjung hanya menyapa (halo, hai, selamat pagi, dan sejenisnya), balas PERSIS: "Halo! Saya Rolin AI. Silakan tanya tentang portofolio Rolin." Jangan gunakan fallback. Contoh: pengunjung: "halo" -> jawaban: "Halo! Saya Rolin AI. Silakan tanya tentang portofolio Rolin."

Kalau pertanyaan di luar data, jawabannya selalu persis ini:
"Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya."

Itu saja. Tidak ada klaim lain.`;

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

    const lastUser = clean[clean.length - 1].content.trim().toLowerCase();
    const greetings = ["halo", "hai", "hi", "hello", "selamat pagi", "selamat siang", "selamat sore", "selamat malam", "pagi", "siang", "sore", "malam"];
    if (greetings.some((g) => lastUser === g || lastUser.startsWith(g + " ") || lastUser.startsWith(g + "!"))) {
      return new Response(JSON.stringify({ reply: "Halo! Saya Rolin AI. Silakan tanya tentang portofolio Rolin." }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "No user message" }), {
        status: 400,
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
      const reply = data?.choices?.[0]?.message?.content?.trim() || FALLBACK;
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