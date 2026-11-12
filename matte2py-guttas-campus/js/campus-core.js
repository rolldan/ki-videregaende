(function () {
  "use strict";

  const STATE_KEY = "gc2py:state:v1";
  const THEME_KEY = "gc2py:theme:v1";
  const TOTALT_OPPGAVER = 14;

  function standardState() {
    return {
      valgtStyrke: "viljestyrke",
      mentorModus: false,
      oppgaver: {},
      maaltrapp: {},
      oppvarmingRunder: 0,
      loggbok: []
    };
  }

  function lesState() {
    try {
      const raa = localStorage.getItem(STATE_KEY);
      if (!raa) return standardState();
      return Object.assign(standardState(), JSON.parse(raa));
    } catch {
      return standardState();
    }
  }

  function lagreState(state) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {}
  }

  function hentStyrkeObjekt(id) {
    const liste = (window.GC2PY_DATA && window.GC2PY_DATA.KARAKTERSTYRKER) || [];
    return liste.find((s) => s.id === id) || liste[1] || { id: "viljestyrke", navn: "Viljestyrke", viSier: "«Gi aldri opp»" };
  }

  /* ================= Lys / Mørk visning ================= */
  function initTema() {
    const rot = document.documentElement;
    const lagret = localStorage.getItem(THEME_KEY);
    const startTema = lagret === "dark" ? "dark" : "light";
    rot.setAttribute("data-theme", startTema);

    const knapp = document.getElementById("tema-knapp");
    function oppdaterKnapp() {
      if (!knapp) return;
      const mork = rot.getAttribute("data-theme") === "dark";
      knapp.textContent = mork ? "☀ Lys" : "☾ Mørk";
      knapp.setAttribute("aria-pressed", String(mork));
    }
    oppdaterKnapp();

    if (knapp) {
      knapp.addEventListener("click", () => {
        const neste = rot.getAttribute("data-theme") === "dark" ? "light" : "dark";
        rot.setAttribute("data-theme", neste);
        try { localStorage.setItem(THEME_KEY, neste); } catch {}
        oppdaterKnapp();
      });
    }
  }

  /* ================= Mentor- / lærermodus ================= */
  function oppdaterMentorUI() {
    const state = lesState();
    document.documentElement.setAttribute("data-mentor-mode", state.mentorModus ? "true" : "false");
    document.querySelectorAll("[data-mentor-knapp]").forEach((knapp) => {
      knapp.setAttribute("aria-pressed", String(Boolean(state.mentorModus)));
      knapp.textContent = state.mentorModus ? "★ Mentormodus: PÅ" : "Mentormodus";
    });
  }

  function initMentorModus() {
    oppdaterMentorUI();
    document.querySelectorAll("[data-mentor-knapp]").forEach((knapp) => {
      knapp.addEventListener("click", () => {
        const s = lesState();
        s.mentorModus = !s.mentorModus;
        lagreState(s);
        oppdaterMentorUI();
      });
    });
  }

  /* ================= Karakterstyrker ================= */
  function velgKarakterstyrke(id) {
    const s = lesState();
    s.valgtStyrke = id;
    lagreState(s);
    oppdaterStyrkeUI();
    window.dispatchEvent(new CustomEvent("gc2py:styrke-endret", { detail: hentStyrkeObjekt(id) }));
  }

  function oppdaterStyrkeUI() {
    const s = lesState();
    const aktiv = hentStyrkeObjekt(s.valgtStyrke);

    document.querySelectorAll("[data-aktiv-styrke]").forEach((el) => {
      el.textContent = `${aktiv.navn} · ${aktiv.viSier}`;
    });

    document.querySelectorAll("[data-aktiv-styrke-tips]").forEach((el) => {
      el.textContent = `${aktiv.navn} (${aktiv.viSier}): ${aktiv.matteTips || aktiv.beskrivelse}`;
    });

    document.querySelectorAll(".styrke-kort[data-styrke-id]").forEach((kort) => {
      const erValgt = kort.dataset.styrkeId === aktiv.id;
      kort.classList.toggle("valgt", erValgt);
      kort.setAttribute("aria-pressed", String(erValgt));
    });
  }

  function byggStyrkeVelger() {
    const beholder = document.getElementById("styrke-velger");
    if (!beholder || !window.GC2PY_DATA) return;
    beholder.innerHTML = window.GC2PY_DATA.KARAKTERSTYRKER.map(
      (st) => `
      <button type="button" class="styrke-kort" data-styrke-id="${st.id}" aria-pressed="false">
        <div class="styrke-navn"><span>${st.navn}</span></div>
        <span class="vi-sier">Vi sier: ${st.viSier}</span>
        <p>${st.beskrivelse}</p>
      </button>`
    ).join("");

    beholder.querySelectorAll(".styrke-kort").forEach((kort) => {
      kort.addEventListener("click", () => velgKarakterstyrke(kort.dataset.styrkeId));
    });
    oppdaterStyrkeUI();
  }

  /* ================= Måltrappa & Progresjon ================= */
  function registrerOppgaveLost(oppgaveId, bruktHint, maalId) {
    const s = lesState();
    const forrige = s.oppgaver[oppgaveId] || {};
    s.oppgaver[oppgaveId] = {
      lost: true,
      bruktHint: Boolean(forrige.bruktHint || bruktHint),
      tid: Date.now()
    };
    if (maalId) {
      s.maaltrapp[maalId] = true;
    }
    lagreState(s);
    oppdaterProgresjonUI();
  }

  function settMaaltrappTrinn(maalId, ferdig) {
    const s = lesState();
    s.maaltrapp[maalId] = Boolean(ferdig);
    lagreState(s);
    oppdaterProgresjonUI();
  }

  function byggMaaltrapp() {
    const listeEl = document.getElementById("maaltrapp-liste");
    if (!listeEl || !window.GC2PY_DATA) return;
    const s = lesState();

    listeEl.innerHTML = window.GC2PY_DATA.MAALTRAPPA.map((m) => {
      const avkrysset = Boolean(s.maaltrapp[m.id]);
      return `
        <li class="maaltrapp-trinn ${avkrysset ? "fullfort" : ""}" data-maal-rad="${m.id}">
          <input type="checkbox" id="maal-${m.id}" data-maal-sjekk="${m.id}" ${avkrysset ? "checked" : ""}>
          <div>
            <label for="maal-${m.id}"><strong>Trinn ${m.trinn}:</strong> ${m.tekst}</label>
            <div style="font-size:0.8rem;margin-top:0.12rem"><a href="${m.lenke}">Gå til trening →</a></div>
          </div>
        </li>`;
    }).join("");

    listeEl.querySelectorAll("[data-maal-sjekk]").forEach((cb) => {
      cb.addEventListener("change", () => settMaaltrappTrinn(cb.dataset.maalSjekk, cb.checked));
    });
  }

  function oppdaterProgresjonUI() {
    const s = lesState();
    const loste = Object.keys(s.oppgaver).filter((k) => s.oppgaver[k]?.lost);
    const antallOppg = loste.length;
    const utenHint = loste.filter((k) => !s.oppgaver[k]?.bruktHint).length;
    const antallMaal = Object.keys(s.maaltrapp).filter((k) => s.maaltrapp[k]).length;
    const totaltMaal = (window.GC2PY_DATA && window.GC2PY_DATA.MAALTRAPPA.length) || 8;

    document.querySelectorAll("[data-topp-progresjon]").forEach((el) => {
      el.textContent = `Måltrapp: ${antallMaal}/${totaltMaal} · Oppgaver: ${antallOppg}/${TOTALT_OPPGAVER}`;
    });

    const fyll = document.getElementById("framdrift-fyll");
    if (fyll) {
      const pst = Math.min(100, Math.round(((antallOppg + antallMaal) / (TOTALT_OPPGAVER + totaltMaal)) * 100));
      fyll.style.width = `${pst}%`;
    }

    const oppsumEl = document.getElementById("framdrift-oppsummering");
    if (oppsumEl) {
      if (antallOppg === 0 && antallMaal === 0) {
        oppsumEl.textContent = "Du er klar ved foten av Måltrappa. Velg dagens karakterstyrke og start første økt!";
      } else {
        oppsumEl.textContent = `${antallOppg} av ${TOTALT_OPPGAVER} mestringsoppgaver løst (${utenHint} uten hint) · ${antallMaal} av ${totaltMaal} trinn krysset av i Måltrappa.`;
      }
    }

    document.querySelectorAll("[data-maal-rad]").forEach((rad) => {
      const id = rad.dataset.maalRad;
      const ferdig = Boolean(s.maaltrapp[id]);
      rad.classList.toggle("fullfort", ferdig);
      const cb = rad.querySelector("input[type='checkbox']");
      if (cb) cb.checked = ferdig;
    });

    document.querySelectorAll(".oppgave-kort[data-oppgave-id]").forEach((kort) => {
      const info = s.oppgaver[kort.dataset.oppgaveId];
      const statusEl = kort.querySelector(".oppgave-status");
      if (info && info.lost) {
        kort.classList.add("lost");
        if (statusEl) {
          statusEl.textContent = info.bruktHint ? "✓ Mestret (med hint)" : "✓ Mestret på egen hånd";
        }
      } else {
        kort.classList.remove("lost");
        if (statusEl) statusEl.textContent = "Ikke løst ennå";
      }
    });
  }

  /* ================= Oppvarming / Hoderegning ================= */
  function tolkTall(verdi) {
    if (verdi === null || verdi === undefined) return NaN;
    const ren = String(verdi).trim().replace(/\s+/g, "").replace(",", ".").replace(/%$/, "").replace(/kr$/i, "");
    return ren === "" ? NaN : Number(ren);
  }

  function initOppvarming() {
    document.querySelectorAll("[data-oppvarming]").forEach((boks) => {
      const kategori = boks.dataset.oppvarming;
      const grid = boks.querySelector(".oppvarming-grid");
      const nyKnapp = boks.querySelector("[data-oppv-ny]");
      const tellerEl = boks.querySelector("[data-oppv-teller]");
      const generatorer = window.GC2PY_DATA?.OPPVARMING_SETT?.[kategori];
      if (!grid || !generatorer) return;

      function tegnRunde() {
        const poster = generatorer.map((fn) => fn());
        let antallRett = 0;
        if (tellerEl) tellerEl.textContent = `0 / ${poster.length} klare`;

        grid.innerHTML = poster
          .map(
            (p, idx) => `
          <div class="oppv-kort" data-idx="${idx}">
            <div class="oppv-sporsmal">${idx + 1}. ${p.spm}</div>
            <div class="oppv-rad">
              <input type="text" inputmode="decimal" aria-label="${p.spm}" placeholder="Svar…">
              <button type="button" class="knapp knapp-liten">Sjekk</button>
            </div>
            <div class="oppv-status" aria-live="polite"></div>
          </div>`
          )
          .join("");

        grid.querySelectorAll(".oppv-kort").forEach((kort, idx) => {
          const post = poster[idx];
          const input = kort.querySelector("input");
          const knapp = kort.querySelector("button");
          const status = kort.querySelector(".oppv-status");
          let alleredeRett = false;

          function sjekk() {
            const tall = tolkTall(input.value);
            if (Number.isNaN(tall)) {
              status.textContent = "Skriv inn et tall først.";
              return;
            }
            if (Math.abs(tall - post.fasit) <= 0.015) {
              kort.classList.add("rett");
              status.textContent = "✓ Riktig! God hoderegning.";
              if (!alleredeRett) {
                alleredeRett = true;
                antallRett += 1;
                if (tellerEl) tellerEl.textContent = `${antallRett} / ${poster.length} klare`;
                if (antallRett === poster.length) {
                  const s = lesState();
                  s.oppvarmingRunder = (s.oppvarmingRunder || 0) + 1;
                  lagreState(s);
                }
              }
            } else {
              status.textContent = `Ikke helt ennå – tips: ${post.hint}`;
            }
          }

          knapp.addEventListener("click", sjekk);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sjekk();
            }
          });
        });
      }

      tegnRunde();
      if (nyKnapp) nyKnapp.addEventListener("click", tegnRunde);
    });
  }

  /* ================= Steg-for-steg eksempler ================= */
  function initStegEksempler() {
    document.querySelectorAll("[data-eksempel]").forEach((boks) => {
      const rader = [...boks.querySelectorAll(".steg-rad")];
      const neste = boks.querySelector("[data-steg-neste]");
      const alle = boks.querySelector("[data-steg-alle]");
      const nullstill = boks.querySelector("[data-steg-nullstill]");
      if (!rader.length || !neste) return;

      function oppdater() {
        const skjulte = rader.filter((r) => !r.classList.contains("vist")).length;
        neste.disabled = skjulte === 0;
        neste.textContent = skjulte === 0 ? "Alle steg vist" : `Neste steg (${rader.length - skjulte + 1}/${rader.length})`;
      }

      neste.addEventListener("click", () => {
        const rad = rader.find((r) => !r.classList.contains("vist"));
        if (rad) rad.classList.add("vist");
        oppdater();
      });
      if (alle) {
        alle.addEventListener("click", () => {
          rader.forEach((r) => r.classList.add("vist"));
          oppdater();
        });
      }
      if (nullstill) {
        nullstill.addEventListener("click", () => {
          rader.forEach((r, i) => r.classList.toggle("vist", i === 0));
          oppdater();
        });
      }
      oppdater();
    });
  }

  /* ================= Mestringsløype-oppgaver («Ennå»-tilbakemelding) ================= */
  function initOppgaver() {
    document.querySelectorAll(".oppgave-kort[data-oppgave-id]").forEach((kort) => {
      const id = kort.dataset.oppgaveId;
      const maalId = kort.dataset.maalId || "";
      const type = kort.dataset.type || "tall";
      const sjekkKnapp = kort.querySelector("[data-sjekk]");
      const hintKnapp = kort.querySelector("[data-vis-hint]");
      const losningKnapp = kort.querySelector("[data-vis-losning]");
      const hintPanel = kort.querySelector(".hint-panel");
      const losningPanel = kort.querySelector(".losning-panel");
      const tilbakemelding = kort.querySelector(".tilbakemelding");
      let bruktHint = false;

      if (hintKnapp && hintPanel) {
        hintKnapp.addEventListener("click", () => {
          bruktHint = true;
          const v = hintPanel.classList.toggle("vist");
          hintKnapp.textContent = v ? "Skjul hint" : "Vis hint";
        });
      }
      if (losningKnapp && losningPanel) {
        losningKnapp.addEventListener("click", () => {
          bruktHint = true;
          const v = losningPanel.classList.toggle("vist");
          losningKnapp.textContent = v ? "Skjul utregning" : "Vis utregningssteg";
        });
      }

      if (!sjekkKnapp || !tilbakemelding) return;

      function kontroller() {
        if (type === "tall") {
          const input = kort.querySelector(".svar-input");
          const fasit = Number(kort.dataset.fasit);
          const tol = Number(kort.dataset.toleranse || "0.05");
          const verdi = tolkTall(input ? input.value : "");
          if (Number.isNaN(verdi)) {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = "Skriv inn et tallsvar først (både komma og punktum fungerer).";
            return;
          }
          if (Math.abs(verdi - fasit) <= tol) {
            tilbakemelding.className = "tilbakemelding rett";
            tilbakemelding.textContent = kort.dataset.rettMelding || "✓ Riktig! Du klatrer på Måltrappa.";
            registrerOppgaveLost(id, bruktHint, maalId);
          } else {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent =
              kort.dataset.feilMelding ||
              "Ikke helt på plass ennå. Tell til 10, sjekk benevningen eller åpne hintet for neste steg!";
          }
        } else if (type === "flervalg") {
          const valgt = kort.querySelector("input[type='radio']:checked");
          if (!valgt) {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = "Velg ett svaralternativ først.";
            return;
          }
          if (valgt.value === kort.dataset.fasit) {
            tilbakemelding.className = "tilbakemelding rett";
            tilbakemelding.textContent = kort.dataset.rettMelding || "✓ Riktig resonnement!";
            registrerOppgaveLost(id, bruktHint, maalId);
          } else {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent =
              valgt.dataset.forklaring || kort.dataset.feilMelding || "Ikke riktig ennå – les alternativet på nytt og prøv igjen.";
          }
        }
      }

      sjekkKnapp.addEventListener("click", kontroller);
      const input = kort.querySelector(".svar-input");
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            kontroller();
          }
        });
      }
    });
  }

  /* ================= Pensumsøk & Loggbok ================= */
  function initSok() {
    const felt = document.getElementById("pensum-sok");
    const resultat = document.getElementById("sok-resultat");
    if (!felt || !resultat || !window.GC2PY_DATA) return;

    felt.addEventListener("input", () => {
      const q = felt.value.trim().toLowerCase();
      if (!q) {
        resultat.innerHTML = "";
        return;
      }
      const treff = window.GC2PY_DATA.SOK_INDEKS.filter(
        (post) =>
          post.tittel.toLowerCase().includes(q) ||
          post.emne.toLowerCase().includes(q) ||
          post.stikkord.toLowerCase().includes(q)
      );
      resultat.innerHTML = treff.length
        ? treff
            .map(
              (t) => `<a class="sok-treff-kort" href="${t.url}">
                <div><strong>${t.tittel}</strong><div style="font-size:0.82rem;color:var(--demp)">${t.emne}</div></div>
                <span style="font-weight:700;color:var(--gull)">Åpne →</span>
              </a>`
            )
            .join("")
        : `<p style="font-size:0.9rem;color:var(--demp);margin:0.4rem 0 0">Ingen direkte treff på «${felt.value}» – prøv f.eks. vekstfaktor, median, break-even eller oppgaveark.</p>`;
    });
  }

  function initLoggbok() {
    const skjema = document.querySelector("[data-loggbok-skjema]");
    if (!skjema) return;
    const status = skjema.querySelector("[data-loggbok-status]");
    const styrkeSelect = skjema.querySelector("select[name='styrke']");
    if (styrkeSelect && window.GC2PY_DATA) {
      const aktiv = lesState().valgtStyrke;
      styrkeSelect.innerHTML = window.GC2PY_DATA.KARAKTERSTYRKER.map(
        (st) => `<option value="${st.id}" ${st.id === aktiv ? "selected" : ""}>${st.navn} (${st.viSier})</option>`
      ).join("");
    }

    skjema.addEventListener("submit", (e) => {
      e.preventDefault();
      const s = lesState();
      const styrke = skjema.querySelector("select[name='styrke']")?.value || s.valgtStyrke;
      const mestring = skjema.querySelector("select[name='mestring']")?.value || "paa-vei";
      const notat = skjema.querySelector("textarea[name='notat']")?.value.trim() || "";
      s.loggbok.unshift({
        okt: skjema.dataset.loggbokSkjema,
        styrke,
        mestring,
        notat,
        dato: new Date().toISOString().slice(0, 10)
      });
      s.loggbok = s.loggbok.slice(0, 20);
      lagreState(s);
      if (status) {
        status.className = "tilbakemelding rett";
        status.textContent = "✓ Øktrefleksjon lagret i loggboka di! Bra jobba med dagens økt.";
      }
    });
  }

  function initNullstill() {
    const knapp = document.getElementById("nullstill-progresjon");
    if (!knapp) return;
    knapp.addEventListener("click", () => {
      lagreState(standardState());
      oppdaterStyrkeUI();
      oppdaterMentorUI();
      oppdaterProgresjonUI();
    });
  }

  /* ================= KaTeX rendering ================= */
  function renderMatte(rotElement) {
    if (typeof window.renderMathInElement === "function") {
      window.renderMathInElement(rotElement || document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false,
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTema();
    initMentorModus();
    byggStyrkeVelger();
    oppdaterStyrkeUI();
    byggMaaltrapp();
    initOppvarming();
    initStegEksempler();
    initOppgaver();
    initSok();
    initLoggbok();
    initNullstill();
    oppdaterProgresjonUI();
    renderMatte();
  });

  window.GC2PY = {
    lesState,
    hentStyrkeObjekt,
    velgKarakterstyrke,
    registrerOppgaveLost,
    settMaaltrappTrinn,
    oppdaterProgresjonUI,
    renderMatte
  };
})();
