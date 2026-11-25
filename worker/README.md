# Rolin AI Worker

Proxy ke Groq API. Deploy:

1. `cd worker`
2. `npm create cloudflare@latest`? Sudah ada wrangler. Install: `npm i -g wrangler`
3. `wrangler login`
4. `wrangler secret put GROQ_API_KEY` (paste key dari console.groq.com)
5. `wrangler deploy`
6. URL worker: `https://rolin-ai.<akun>.workers.dev`. Sesuaikan `window.ROLIN_AI_ENDPOINT` di `assets/chat.js` bila berbeda.

Origin yang diizinkan: `https://rolin-19.github.io`. Untuk uji lokal, ubah `ALLOWED_ORIGIN` di wrangler.toml sementara.