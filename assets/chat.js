(function () {
  "use strict";
  var ENDPOINT = (window.ROLIN_AI_ENDPOINT || "https://rolin-ai.stallinrolin.workers.dev/chat");
  var history = [];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var root = el("div", "rolin-chat");
  var toggle = el("button", "rolin-chat-toggle", "Rolin AI");
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Buka chat Rolin AI");
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
  document.body.appendChild(root);

  function balon(role, text) {
    var b = el("div", "rolin-chat-balon " + role, text);
    pesan.appendChild(b);
    pesan.scrollTop = pesan.scrollHeight;
    return b;
  }

  function buka() { panel.classList.add("terbuka"); input.focus(); }
  function tutupPanel() { panel.classList.remove("terbuka"); }

  toggle.addEventListener("click", function () {
    if (panel.classList.contains("terbuka")) tutupPanel(); else buka();
  });
  tutup.addEventListener("click", tutupPanel);
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
      var data = await res.json();
      loading.remove();
      var reply = (data && data.reply) ? data.reply : "Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya.";
      balon("bot", reply);
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      loading.remove();
      balon("bot", "Itu belum ada di portofolio Rolin, bisa tanya langsung ke Rolin lewat kontak di web-nya.");
    } finally {
      kirim.disabled = false;
      input.focus();
    }
  });
})();