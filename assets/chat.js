(function () {
  "use strict";
  var ENDPOINT = (window.ROLIN_AI_ENDPOINT || "https://rolin-ai-api.pages.dev/chat");
  var history = [];

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
      toggle.setAttribute("aria-label", "Buka chat Rolin AI");
      toggle.setAttribute("aria-expanded", "false");

      var panel = el("div", "rolin-chat-panel");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Rolin AI");

      var kepala = el("div", "rolin-chat-kepala");
      var judul = el("h3", null, "Rolin AI");
      var tutup = el("button", "rolin-chat-tutup", "×");
      tutup.type = "button";
      tutup.setAttribute("aria-label", "Tutup chat");
      kepala.appendChild(judul);
      kepala.appendChild(tutup);

      var pesan = el("div", "rolin-chat-pesan");
      pesan.setAttribute("aria-live", "polite");

      var form = el("form", "rolin-chat-form");
      var input = el("input", "rolin-chat-input");
      input.type = "text";
      input.placeholder = "Tanya tentang Rolin...";
      input.setAttribute("aria-label", "Pertanyaan");
      var kirim = el("button", "rolin-chat-kirim", "Kirim");
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
      if (/^(halo|hai|hi|hello|pagi|siang|sore|malam|selamat pagi|selamat siang|selamat sore|selamat malam)[!.\s]*$/i.test(low)) {
        lokal = "Halo! Saya Rolin AI. Silakan tanya tentang portofolio Rolin.";
      } else if (/^(siapa kamu|siapa anda|kenapa kamu|apa kamu|kamu siapa)[?!\s]*$/i.test(low)) {
        lokal = "Saya Rolin AI, asisten portofolio resmi Rolin Stallin Sitorus. Silakan tanya tentang Rolin.";
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
        var reply = (data && data.reply) ? data.reply : "Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya.";
        balon("bot", reply);
        history.push({ role: "assistant", content: reply });
      } catch (err) {
        loading.remove();
        balon("bot", "Maaf, koneksi Rolin AI belum tersedia. Silakan coba lagi.");
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