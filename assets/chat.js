(function () {
  "use strict";
  var ENDPOINT = (window.ROLIN_AI_ENDPOINT || "https://rolin-ai-api.pages.dev/chat");
  var history = [];
  var IS_EN = /^en([-_]|$)/i.test(document.documentElement.lang || "") || /\/en(\/|$)/.test(location.pathname);
  var UI = IS_EN ? {
    toggleLabel: "Open Rolin AI chat",
    closeLabel: "Close Rolin AI chat",
    placeholder: "Ask about Rolin...",
    inputLabel: "Question for Rolin AI",
    send: "Send",
    greeting: "Hello! I'm Rolin AI, the virtual assistant for Rolin Stallin Sitorus's portfolio. Feel free to ask about his work experience, VISOP, or data analysis skills.",
    about: "I'm Rolin AI, the official virtual assistant for Rolin Stallin Sitorus's portfolio. Feel free to ask about Rolin.",
    fallback: "That is not covered in Rolin's portfolio. You can reach Rolin directly through the contact links on the site.",
    error: "Sorry, Rolin AI is temporarily unavailable. Please try again."
  } : {
    toggleLabel: "Buka chat Rolin AI",
    closeLabel: "Tutup chat Rolin AI",
    placeholder: "Tanya tentang pengalaman, proyek, atau keahlian Rolin...",
    inputLabel: "Pertanyaan untuk Rolin AI",
    send: "Kirim",
    greeting: "Halo! Saya Rolin AI, asisten virtual untuk portofolio Rolin Stallin Sitorus. Silakan tanyakan pengalaman kerja, proyek VISOP, atau keahlian analisis datanya.",
    about: "Saya Rolin AI, asisten virtual resmi untuk portofolio Rolin Stallin Sitorus. Silakan tanyakan tentang Rolin.",
    fallback: "Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya.",
    error: "Maaf, koneksi Rolin AI belum tersedia. Silakan coba lagi."
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function boot() {
    var root = document.querySelector(".rolin-chat");
    if (!root) {
      root = el("div", "rolin-chat");
      root.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:9999;pointer-events:auto;";

      var toggle = el("button", "rolin-chat-toggle", "Rolin AI");
      toggle.type = "button";
      toggle.setAttribute("aria-label", UI.toggleLabel);
      toggle.setAttribute("aria-expanded", "false");

      var panel = el("div", "rolin-chat-panel");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Rolin AI");

      var kepala = el("div", "rolin-chat-kepala");
      var judul = el("h3", null, "Rolin AI");
      var tutup = el("button", "rolin-chat-tutup", "×");
      tutup.type = "button";
      tutup.setAttribute("aria-label", UI.closeLabel);
      kepala.appendChild(judul);
      kepala.appendChild(tutup);

      var pesan = el("div", "rolin-chat-pesan");
      pesan.setAttribute("aria-live", "polite");

      var form = el("form", "rolin-chat-form");
      var input = el("input", "rolin-chat-input");
      input.type = "text";
      input.placeholder = UI.placeholder;
      input.setAttribute("aria-label", UI.inputLabel);
      var kirim = el("button", "rolin-chat-kirim", UI.send);
      kirim.type = "submit";
      form.appendChild(input);
      form.appendChild(kirim);

      panel.appendChild(kepala);
      panel.appendChild(pesan);
      panel.appendChild(form);
      root.appendChild(toggle);
      root.appendChild(panel);

      var target = document.body || document.documentElement;
      target.appendChild(root);
    }

    var toggle = root.querySelector(".rolin-chat-toggle");
    var panel = root.querySelector(".rolin-chat-panel");
    var pesan = root.querySelector(".rolin-chat-pesan");
    var form = root.querySelector(".rolin-chat-form");
    var input = root.querySelector(".rolin-chat-input");
    var kirim = root.querySelector(".rolin-chat-kirim");
    var tutup = root.querySelector(".rolin-chat-tutup");

    if (!toggle || !panel || !pesan || !form || !input || !kirim) return;

    function balon(role, text) {
      var b = el("div", "rolin-chat-balon " + role, text);
      pesan.appendChild(b);
      pesan.scrollTop = pesan.scrollHeight;
      return b;
    }

    function tutupPanel() { panel.classList.remove("terbuka"); toggle.setAttribute("aria-expanded", "false"); }

    // Hindari double-binding
    if (toggle.__bound) return;
    toggle.__bound = true;

    // Sinkronkan ARIA & fokus berdasarkan state panel (tanpa menambah click
    // listener pada tombol pemicu, agar tidak bentrok dengan onclick inline).
    function syncState() {
      var terbuka = panel.classList.contains("terbuka");
      toggle.setAttribute("aria-expanded", terbuka ? "true" : "false");
      panel.setAttribute("aria-hidden", terbuka ? "false" : "true");
      if (terbuka) { setTimeout(function () { try { input.focus(); } catch (e) {} }, 100); }
    }
    syncState();
    if (window.MutationObserver) {
      var obs = new MutationObserver(syncState);
      obs.observe(panel, { attributes: true, attributeFilter: ["class"] });
    }

    if (tutup) tutup.addEventListener("click", function () { tutupPanel(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("terbuka")) tutupPanel();
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = "";
      balon("user", q);
      history.push({ role: "user", content: q });

      var low = q.toLowerCase().trim();
      var lokal = null;
      var greetingPattern = IS_EN
        ? /^(hi|hello|hey|good morning|good afternoon|good evening)\s*[!.,]?\s*$/i
        : /^(halo|hai|selamat pagi|selamat siang|selamat sore|selamat malam|pagi|siang|sore|malam)\s*[!.,]?\s*$/i;
      var aboutPattern = IS_EN
        ? /^(who are you|what are you|who am i talking to)[?!\s]*$/i
        : /^(siapa kamu|siapa anda|kenapa kamu|apa kamu|kamu siapa)[?!\s]*$/i;
      if (greetingPattern.test(low)) {
        lokal = UI.greeting;
      } else if (aboutPattern.test(low)) {
        lokal = UI.about;
      }
      if (lokal) {
        balon("bot", lokal);
        history.push({ role: "assistant", content: lokal });
        return;
      }

      kirim.disabled = true;
      var loading = balon("bot", "...");
      try {
        var res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        var data = await res.json();
        loading.remove();
        var reply = (data && data.reply) ? data.reply : UI.fallback;
        balon("bot", reply);
        history.push({ role: "assistant", content: reply });
      } catch (err) {
        loading.remove();
        balon("bot", UI.error);
      } finally {
        kirim.disabled = false;
        try { input.focus(); } catch (e) {}
      }
    });

  }

  function start() {
    try {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
      } else {
        boot();
      }
    } catch (e) {
      try { console.error("Rolin AI boot error", e); } catch (err) {}
    }
  }

  start();
})();