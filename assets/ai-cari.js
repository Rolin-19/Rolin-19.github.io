(function () {
  "use strict";

  var ENDPOINT = window.ROLIN_AI_ENDPOINT || "https://rolin-ai-api.pages.dev/chat";
  var IS_EN = /^en([-_]|$)/i.test(document.documentElement.lang || "") || /\/en(\/|$)/.test(location.pathname);
  var UI = IS_EN
    ? {
        loading: "Summarizing portfolio...",
        error: "The summary is unavailable right now. Please try again."
      }
    : {
        loading: "Merangkum isi portofolio...",
        error: "Ringkasan belum tersedia. Silakan coba lagi."
      };

  var SUMBER = IS_EN
    ? [
        {
          label: "Experience",
          href: "#experience",
          keys: ["experience", "work", "role", "job", "career", "commis", "cinema", "frontliner", "miniso", "lawson", "reska", "gapura"]
        },
        {
          label: "VISOP",
          href: "../proyek/visop.html",
          keys: ["visop", "sop", "innovation", "apps script", "sheets"]
        },
        {
          label: "Projects",
          href: "#projects",
          keys: ["project", "python", "sql", "pandas", "biodiversity", "movie", "culinary", "segmentation", "machine learning", "data analysis", "analisis"]
        },
        {
          label: "Education",
          href: "#skills",
          keys: ["education", "certificate", "d1", "ground handling", "sttkd", "gpa", "3.25", "dicoding", "codecademy", "skills"]
        },
        {
          label: "Contact",
          href: "#contact",
          keys: ["contact", "email", "linkedin", "github", "reach"]
        }
      ]
    : [
        {
          label: "Pengalaman",
          href: "#pengalaman",
          keys: ["pengalaman", "kerja", "jabatan", "karir", "commis", "cinema", "frontliner", "miniso", "lawson", "reska", "gapura"]
        },
        {
          label: "VISOP",
          href: "proyek/visop.html",
          keys: ["visop", "sop", "innovation", "apps script", "sheets"]
        },
        {
          label: "Proyek",
          href: "#proyek",
          keys: ["proyek", "python", "sql", "pandas", "biodiversitas", "film", "kuliner", "segmentasi", "machine learning", "analisis data"]
        },
        {
          label: "Pendidikan",
          href: "#keahlian",
          keys: ["pendidikan", "kampus", "d1", "ground handling", "sttkd", "ipk", "3,25", "sertifikat", "dicoding", "codecademy", "keahlian"]
        },
        {
          label: "Kontak",
          href: "#kontak",
          keys: ["kontak", "email", "linkedin", "github", "hubungi"]
        }
      ];

  var history = [];
  var requestId = 0;
  var sorotTarget = null;
  var sorotTimer = null;

  function el(tag, text) {
    var e = document.createElement(tag);
    if (text != null) e.textContent = text;
    return e;
  }

  function bersihkan(teks) {
    return String(teks || "").replace(/\*\*/g, "").trim();
  }

  function kurangiGerak() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function hapusSorotan() {
    if (sorotTimer !== null) {
      clearTimeout(sorotTimer);
      sorotTimer = null;
    }
    if (sorotTarget) {
      sorotTarget.classList.remove("ai-sorot-sumber");
      sorotTarget = null;
    }
  }

  function sorot(target) {
    hapusSorotan();
    sorotTarget = target;
    target.classList.add("ai-sorot-sumber");
    sorotTimer = window.setTimeout(function () {
      if (sorotTarget) sorotTarget.classList.remove("ai-sorot-sumber");
      sorotTarget = null;
      sorotTimer = null;
    }, 2400);
  }

  function renderRingkasan(teks) {
    ringkasan.textContent = "";
    var daftar = null;
    String(teks || "")
      .split(/\r?\n/)
      .forEach(function (baris) {
        var asli = baris.trim();
        if (!asli) return;
        var poin = /^(?:[-•*]|\d+[.)])\s*/.test(asli);
        var isi = bersihkan(asli.replace(/^(?:[-•*]|\d+[.)])\s*/, ""));
        if (!isi) return;
        if (poin) {
          if (!daftar) {
            daftar = el("ul");
            ringkasan.appendChild(daftar);
          }
          daftar.appendChild(el("li", isi));
        } else {
          daftar = null;
          ringkasan.appendChild(el("p", isi));
        }
      });
    if (!ringkasan.children.length) ringkasan.appendChild(el("p", bersihkan(teks)));
  }

  function renderSumber(pertanyaan) {
    var teks = String(pertanyaan || "").toLowerCase();
    var cocok = SUMBER.filter(function (s) {
      return s.keys.some(function (k) {
        return teks.indexOf(k) !== -1;
      });
    });
    if (!cocok.length) cocok = SUMBER.slice(0, 3);
    sumber.textContent = "";
    cocok.forEach(function (s) {
      var a = el("a", s.label);
      a.href = s.href;
      sumber.appendChild(a);
    });
  }

  var ringkasan;
  var sumber;
  var status;
  var kartu;
  var input;
  var reset;
  var kirim;
  var tutup;

  function syncReset() {
    if (reset) reset.hidden = !input.value;
  }

  function ajukan(pertanyaan) {
    var teks = String(pertanyaan || "").replace(/\s+/g, " ").trim();
    if (!teks) {
      try { input.focus(); } catch (e) {}
      return;
    }

    var id = ++requestId;
    history.push({ role: "user", content: teks });
    if (history.length > 8) history = history.slice(-8);

    kartu.hidden = false;
    ringkasan.textContent = "";
    sumber.textContent = "";
    status.textContent = UI.loading;
    kirim.disabled = true;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
      cache: "no-store"
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (id !== requestId) return;
        var jawaban = data && typeof data.reply === "string" ? bersihkan(data.reply) : "";
        if (!jawaban) jawaban = UI.error;
        history.push({ role: "assistant", content: jawaban });
        if (history.length > 8) history = history.slice(-8);
        renderRingkasan(jawaban);
        renderSumber(teks);
        status.textContent = "";
        input.value = "";
        syncReset();
      })
      .catch(function () {
        if (id !== requestId) return;
        renderRingkasan(UI.error);
        status.textContent = "";
      })
      .then(function () {
        if (id === requestId) kirim.disabled = false;
      });
  }

  function boot() {
    var form = document.querySelector(".ai-cari-form");
    input = document.querySelector(".ai-cari-input");
    reset = document.querySelector(".ai-cari-reset");
    kartu = document.querySelector(".ai-cari-kartu");
    ringkasan = document.querySelector(".ai-cari-ringkasan");
    sumber = document.querySelector(".ai-cari-sumber");
    status = document.querySelector(".ai-cari-status");
    kirim = document.querySelector(".ai-cari-kirim");
    tutup = document.querySelector(".ai-cari-tutup");

    if (!form || !input || !kartu || !ringkasan || !sumber || !status || !kirim) return;

    syncReset();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ajukan(input.value);
    });

    input.addEventListener("input", syncReset);

    if (reset) {
      reset.addEventListener("click", function () {
        input.value = "";
        syncReset();
        try { input.focus(); } catch (e) {}
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll(".ai-cari-chip"), function (chip) {
      chip.addEventListener("click", function () {
        var teks = chip.textContent.replace(/\s+/g, " ").trim();
        input.value = teks;
        syncReset();
        ajukan(teks);
      });
    });

    sumber.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a || !sumber.contains(a)) return;
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#" || href.length <= 1) return;
      var target = null;
      try { target = document.querySelector(href); } catch (err) { return; }
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: kurangiGerak() ? "auto" : "smooth",
        block: "start"
      });
      sorot(target);
      target.setAttribute("tabindex", "-1");
      try { target.focus({ preventScroll: true }); } catch (err) {}
    });

    if (tutup) {
      tutup.addEventListener("click", function () {
        requestId++;
        kartu.hidden = true;
        status.textContent = "";
        kirim.disabled = false;
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
