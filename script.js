(function () {
  "use strict";
  var IS_EN = document.documentElement.lang === "en";

  /* ---------- MENU ---------- */
  var nav = document.getElementById("nav");
  var burger = nav.querySelector(".nav__burger");
  function onScrollNav() { nav.classList.toggle("is-solid", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  });
  nav.querySelectorAll(".nav__links a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- APERTURA: logo a 3 s, pulsante a 5 s ---------- */
  var hero = document.querySelector(".hero");
  var video = hero.querySelector("video");
  setTimeout(function () { hero.classList.add("show-logo"); }, 3000);
  setTimeout(function () { hero.classList.add("show-btn"); }, 5000);
  var p = video.play && video.play();
  if (p && p.catch) p.catch(function () {});

  /* ---------- SFONDO VIDEO: molto rallentato ---------- */
  var bg = document.querySelector(".bgvid video");
  if (bg) {
    var slow = function () { bg.playbackRate = 0.1; };
    slow();
    bg.addEventListener("loadedmetadata", slow);
    bg.addEventListener("play", slow);
  }

  /* ---------- GALLERIA: muro in movimento ---------- */
  var wallIn = document.querySelector("#wall .wall__inner");
  if (wallIn) {
    [[1,2,3,4,5,6],[7,8,9,10,11,12],[13,14,15,16,17,18]].forEach(function (row) {
      var r = document.createElement("div"); r.className = "wall__row";
      row.concat(row).forEach(function (n, k) {
        var i = new Image(); i.src = "/assets/serate-q/q" + String(n).padStart(2, "0") + ".webp";
        i.alt = k < row.length ? (IS_EN ? "Dj Reks live" : "Dj Reks in serata") : ""; i.loading = "lazy"; i.width = 280; i.height = 280;
        r.appendChild(i);
      });
      wallIn.appendChild(r);
    });
    // su telefono (senza hover) si colora una foto a caso ogni tanto
    if (!window.matchMedia("(hover: hover)").matches) {
      var imgs = wallIn.querySelectorAll("img");
      setInterval(function () {
        imgs.forEach(function (x) { x.classList.remove("is-lit"); });
        for (var q = 0; q < 3; q++) imgs[Math.floor(Math.random() * imgs.length)].classList.add("is-lit");
      }, 1800);
    }
  }

  /* ---------- DATE ---------- */
  // [anno, mese (1-12), giorno, nome, luogo]
  var EVENTS = [
    [2026, 10, 24, "Pre Partita Modena · Vibra Club", "Modena"],
    [2026, 10, 25, "FPV Tigli Pop Up", "Formigine"],
    [2026, 10, 29, "Lucca Comics · Euronics", "Lucca"],
    [2026, 10, 30, "Lucca Comics · Euronics", "Lucca"],
    [2026, 10, 31, "FPV Sausalito", "Sassuolo"],
    [2026, 11, 8, "Coming Soon", "Rio Saliceto (RE)"],
    [2026, 11, 27, "Milano Games Week · Euronics", "Milano"],
    [2026, 11, 28, "Milano Games Week · Euronics", "Milano"],
    [2026, 12, 18, "Off", "Modena"],
    [2026, 12, 24, "Coming Soon", "Soliera"],
    [2026, 12, 25, "Vibra Club", "Modena"],
    [2026, 12, 31, "Coming Soon", "Luogo da annunciare"]
  ];
  var MESI = IS_EN ? ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
                   : ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
  var GIORNI = IS_EN ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                     : ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var list = document.getElementById("events");
  var KEEP_DAYS = 3; // le date passate restano visibili per 3 giorni, poi spariscono
  EVENTS.forEach(function (e) {
    var d = new Date(e[0], e[1] - 1, e[2]);
    var past = d < today;
    if (past && (today - d) / 86400000 > KEEP_DAYS) return;
    var li = document.createElement("li");
    li.className = "event" + (past ? " is-past" : "");
    li.innerHTML =
      '<div class="event__when"><span class="event__month">' + MESI[e[1] - 1] + '</span>' +
      '<span class="event__day">' + String(e[2]).padStart(2, "0") + '</span></div>' +
      '<div><p class="event__name"></p><p class="event__where"></p></div>' +
      '<span class="event__tag">' + (past ? (IS_EN ? "Past" : "Passata") : (IS_EN ? "Info soon" : "Info a breve")) + '</span>';
    li.querySelector(".event__name").textContent = e[3];
    li.querySelector(".event__where").textContent = e[4] + " · " + GIORNI[d.getDay()];
    list.appendChild(li);
  });

  // dati strutturati per Google: le date future come eventi (schema.org/Event)
  var ldEvents = EVENTS.filter(function (e) { return new Date(e[0], e[1] - 1, e[2]) >= today; }).map(function (e) {
    var iso = e[0] + "-" + String(e[1]).padStart(2, "0") + "-" + String(e[2]).padStart(2, "0");
    return {
      "@type": "MusicEvent",
      "name": "Dj Reks live · " + e[3],
      "startDate": iso,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": { "@type": "Place", "name": e[4], "address": { "@type": "PostalAddress", "addressLocality": e[4], "addressCountry": "IT" } },
      "performer": { "@type": "MusicGroup", "@id": "https://www.djreks.com/#dj-reks", "name": "Dj Reks" },
      "image": "https://www.djreks.com/assets/img/og-dj-reks.jpg",
      "description": "DJ set di Dj Reks, l'unico DJ che suona con un joystick."
    };
  });
  if (ldEvents.length) {
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": ldEvents });
    document.head.appendChild(ld);
  }

  // su desktop la lista parte dalla prossima data
  var box = document.querySelector(".events__box");
  var next = list.querySelector(".event:not(.is-past)");
  if (box && next && box.scrollHeight > box.clientHeight) {
    box.scrollTop = Math.max(0, next.offsetTop - 8);
  }

  /* ---------- COOKIE ---------- */
  var cookie = document.getElementById("cookie");
  var seen = false;
  try { seen = localStorage.getItem("cookie-ok") === "1"; } catch (e) {}
  if (cookie && !seen) {
    cookie.hidden = false;
    document.getElementById("cookie-ok").addEventListener("click", function () {
      cookie.hidden = true;
      try { localStorage.setItem("cookie-ok", "1"); } catch (e) {}
    });
  }

  /* ---------- ZOOM: dal joystick a mezzo busto ---------- */
  var zoom = document.querySelector(".zoom");
  var stage = zoom.querySelector(".zoom__stage");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function range(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function set(k, v) { stage.style.setProperty(k, v); }
  var ticking = false, cur = -1;
  function updateZoom() {
    ticking = false;
    var r = zoom.getBoundingClientRect();
    var total = zoom.offsetHeight - window.innerHeight;
    var target = reduce ? 1 : clamp(-r.top / total, 0, 1);
    // movimento morbido: si avvicina al punto di scroll a ogni fotogramma
    cur = cur < 0 ? target : cur + (target - cur) * 0.2;
    if (Math.abs(target - cur) < 0.0005) cur = target; else requestZoom();
    var prog = cur;
    var z = ease(range(prog, 0, 0.75));
    // all'inizio il joystick e' al centro dello schermo, alla fine mezzo busto intero
    var photo = stage.querySelector(".zoom__photo");
    var ctrlY = photo.offsetTop + photo.offsetHeight * (window.innerWidth > 960 ? 0.27 : 0.30);
    var startPy = window.innerHeight * 0.5 - ctrlY;
    var ps = 1.12 - 0.34 * z, py = startPy * (1 - z);
    set("--ps", ps.toFixed(4));
    set("--py", py.toFixed(1) + "px");
    // scritta DJ REKS grande sopra il cappello, dietro la foto
    var H = photo.offsetHeight, y0 = H * 0.356;
    var hatTop = photo.offsetTop + py + y0 + (H * 0.012 - y0) * ps;
    var navH = nav.offsetHeight, room = Math.max(40, hatTop - navH);
    set("--wy", (navH + room / 2).toFixed(1) + "px");
    set("--wf", Math.min(window.innerWidth * (window.innerWidth > 760 ? 0.15 : 0.165), room * 0.82).toFixed(1) + "px");
    set("--rs", (1 + 1.6 * range(prog, 0, 0.3)).toFixed(3));
    set("--ro", (1 - range(prog, 0.05, 0.3)).toFixed(3));
    set("--ws", (0.75 + 0.25 * ease(range(prog, 0.45, 0.9))).toFixed(3));
    set("--wo", range(prog, 0.45, 0.8).toFixed(3));
    set("--bgo", (0.6 * range(prog, 0.3, 0.8)).toFixed(3));
    set("--to", range(prog, 0.65, 0.9).toFixed(3));
    set("--ho", (1 - range(prog, 0, 0.12)).toFixed(3));
  }
  function requestZoom() { if (!ticking) { ticking = true; requestAnimationFrame(updateZoom); } }
  window.addEventListener("scroll", requestZoom, { passive: true });
  window.addEventListener("resize", requestZoom);
  updateZoom();

  /* ---------- COMPARSA AL PASSAGGIO ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- BOOKING ---------- */
  // Matrimoni -> WhatsApp; tutto il resto -> email diretta (FormSubmit, senza aprire l'app di posta)
  var WHATSAPP = "393460871640"; // numero con prefisso, solo cifre
  var EMAIL = "2024eventi@gmail.com";
  var EN = document.documentElement.lang === "en";
  var T = EN ? {
    sending: "Sending…", ok: "Thanks! Your request has been sent: I'll get back to you soon.",
    err: "Something went wrong. Write to me at " + EMAIL + ".", wa: "Opening WhatsApp…",
    subject: "New booking request from the website", name: "Name", date: "Event date", type: "Event type", tbd: "to be defined"
  } : {
    sending: "Invio in corso…", ok: "Grazie! La richiesta è arrivata: ti rispondo al più presto.",
    err: "Qualcosa non ha funzionato. Scrivimi a " + EMAIL + ".", wa: "Si apre WhatsApp…",
    subject: "Nuova richiesta di booking dal sito", name: "Nome", date: "Data evento", type: "Tipo di evento", tbd: "da definire"
  };
  var form = document.getElementById("booking-form");
  var note = document.getElementById("form-note");
  var btn = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = new FormData(form);
    var tipo = f.get("tipo") || "";
    var body =
      T.name + ": " + (f.get("nome") || "") + "\n" +
      "Email: " + (f.get("email") || "") + "\n" +
      T.date + ": " + (f.get("data") || T.tbd) + "\n" +
      T.type + ": " + tipo + "\n\n" +
      (f.get("messaggio") || "");
    var wedding = /matrimon|wedding/i.test(tipo);
    if (wedding && WHATSAPP) {
      note.textContent = T.wa;
      window.location.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(T.subject + "\n\n" + body);
      return;
    }
    btn.disabled = true; note.textContent = T.sending;
    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: T.subject + " · " + tipo, _template: "table", _captcha: "false",
        nome: f.get("nome"), email: f.get("email"), _replyto: f.get("email"),
        data: f.get("data") || T.tbd, tipo: tipo, messaggio: f.get("messaggio") || ""
      })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (!(d && (d.success === true || d.success === "true"))) throw new Error("invio");
      form.reset(); note.textContent = T.ok; btn.disabled = false;
    }).catch(function () {
      btn.disabled = false; note.textContent = T.err;
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(T.subject) + "&body=" + encodeURIComponent(body);
    });
  });
})();
