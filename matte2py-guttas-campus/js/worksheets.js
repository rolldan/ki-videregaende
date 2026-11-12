(function () {
  "use strict";

  const EMNE_TITLER = {
    blandet: "Blandet 2P-Y eksamens- og mengdetrening",
    prosent: "Kap. 1.2 · Prosent, prosentpoeng og vekstfaktor",
    algebra: "Kap. 1.1 & 1.3 · Proporsjonalitet, potenser og standardform",
    funksjoner: "Kap. 2.2 · Lineære funksjoner, topunktsformel og break-even",
    statistikk: "Kap. 3.2 · Statistikk, sentralmål, kvartilbredde og histogram",
    python: "Kap. 4 & 5 · Datasett, premisser og Python-kodeforståelse"
  };

  const NIVA_TITLER = {
    komplett: "Komplett Guttas Campus-øktark (Oppvarming + Trinn 1–3 + Loggbok)",
    niva1: "Nivå 1 · Grunnleggende mengdetrening",
    niva2: "Nivå 2 · Påbygg-standard",
    niva3: "Nivå 3 · Eksamensrettet utfordring"
  };

  const STANDARD_MAAL = {
    blandet: "Føre ryddige mellomregninger med benevning på tvers av hovedemnene i 2P-Y.",
    prosent: "Bruke vekstfaktor sikkert ved rabatt, mva., gjentatt endring og førpris.",
    algebra: "Avgjøre proporsjonalitet/omvendt proporsjonalitet og skrive tall på standardform.",
    funksjoner: "Stille opp og tolke lineære modeller f(x) = ax + b og finne skjæringspunkt.",
    statistikk: "Beregne og vurdere median, gjennomsnitt, kvartilbredde og histogramhøyde.",
    python: "Spore løkker for hånd og vurdere premisser i matematiske modeller."
  };

  let gjeldendeFro = 4820;

  function lesUrlParametre() {
    const params = new URLSearchParams(window.location.search);
    const emneEl = document.getElementById("velg-emne");
    const nivaEl = document.getElementById("velg-niva");
    if (params.get("emne") && emneEl && EMNE_TITLER[params.get("emne")]) {
      emneEl.value = params.get("emne");
    }
    if (params.get("niva") && nivaEl && NIVA_TITLER[params.get("niva")]) {
      nivaEl.value = params.get("niva");
    }
  }

  function fyllKarakterstyrkeVelger() {
    const sel = document.getElementById("velg-styrke");
    if (!sel || !window.GC2PY_DATA) return;
    const aktivId = window.GC2PY ? window.GC2PY.lesState().valgtStyrke : "viljestyrke";
    sel.innerHTML = window.GC2PY_DATA.KARAKTERSTYRKER.map(
      (st) => `<option value="${st.id}" ${st.id === aktivId ? "selected" : ""}>${st.navn} – ${st.viSier}</option>`
    ).join("");
  }

  function nivaEtikett(nivaTall) {
    if (nivaTall === 1) return "Trinn 1 · Mengdetrening";
    if (nivaTall === 2) return "Trinn 2 · Påbygg-nivå";
    return "Trinn 3 · Eksamensrettet";
  }

  function byggArk(nyttFro) {
    if (!window.GC2PY_WORKSHEET_BANK) return;
    if (nyttFro) {
      gjeldendeFro = Math.floor(1000 + Math.random() * 8999);
    }

    const emne = document.getElementById("velg-emne").value;
    const niva = document.getElementById("velg-niva").value;
    const antall = Number(document.getElementById("velg-antall").value);
    const styrkeId = document.getElementById("velg-styrke").value;
    const ruteStil = document.getElementById("velg-rutestil").value;
    const maalInput = document.getElementById("felt-oktmaal");
    const datoInput = document.getElementById("felt-dato");

    const styrkeObj = window.GC2PY ? window.GC2PY.hentStyrkeObjekt(styrkeId) : { navn: "Viljestyrke", viSier: "«Gi aldri opp»" };
    const oktmaal = maalInput.value.trim() || STANDARD_MAAL[emne] || STANDARD_MAAL.blandet;

    const arkData = window.GC2PY_WORKSHEET_BANK.genererOppgaveark({
      fro: gjeldendeFro,
      emne,
      niva,
      antall
    });

    // Oppdater hode på A4-arket
    document.getElementById("ark-tittel").textContent = EMNE_TITLER[emne] || EMNE_TITLER.blandet;
    document.getElementById("ark-undertittel").textContent = NIVA_TITLER[niva] || NIVA_TITLER.komplett;
    document.getElementById("ark-kode").textContent = arkData.arkKode;
    document.getElementById("ark-vis-dato").textContent = datoInput.value || "____ / ____ - 2026";
    document.getElementById("ark-vis-styrke").textContent = `${styrkeObj.navn} (${styrkeObj.viSier})`;
    document.getElementById("ark-vis-maal").textContent = oktmaal;

    // Oppvarmingsboks (kun i komplett øktark)
    const oppvBoks = document.getElementById("ark-oppvarming-seksjon");
    if (arkData.oppvarming.length > 0) {
      oppvBoks.hidden = false;
      document.getElementById("ark-oppvarming-grid").innerHTML = arkData.oppvarming
        .map(
          (p, i) => `
          <div class="ark-oppv-post">
            <div><strong>${String.fromCharCode(97 + i)})</strong> ${p.spm}</div>
            <div style="margin-top:0.35rem;border-bottom:1px dotted #94a3b8;color:#64748b;font-size:8.5pt">Svar: </div>
          </div>`
        )
        .join("");
    } else {
      oppvBoks.hidden = true;
    }

    // Oppgaveposter med utregningsruter
    const oppgListeEl = document.getElementById("ark-oppgaveliste");
    oppgListeEl.innerHTML = arkData.oppgaver
      .map(
        (oppg) => `
        <article class="ark-oppgave">
          <div class="ark-oppgave-topp">
            <span class="ark-oppgave-nr">Oppgave ${oppg.nr} · ${oppg.tittel}</span>
            <span class="ark-oppgave-meta">${nivaEtikett(oppg.niva)} · ${oppg.del}</span>
          </div>
          <div class="ark-oppgave-tekst">${oppg.tekst}</div>
          <div class="utregningsrute stil-${ruteStil} hoyde-${oppg.hoyde}" aria-label="Rutenett for utregning for hånd"></div>
          <div class="svar-linje-bunn">Svar med benevning: _____________________________________</div>
        </article>`
      )
      .join("");

    // Loggbok nederst på komplett øktark
    const loggEl = document.getElementById("ark-loggbok-bunn");
    loggEl.hidden = niva !== "komplett";

    // Fasit og utregningssteg
    let oppvFasitHtml = "";
    if (arkData.oppvarming.length > 0) {
      oppvFasitHtml = `
        <div class="fasit-post">
          <div class="fasit-kort-svar">Oppvarming (hoderegning):</div>
          <div>${arkData.oppvarming.map((p, i) => `<strong>${String.fromCharCode(97 + i)})</strong> ${p.svar}`).join(" &emsp;·&emsp; ")}</div>
        </div>`;
    }

    document.getElementById("fasit-kode-merke").textContent = `Tilhører ark ${arkData.arkKode}`;
    document.getElementById("fasit-liste").innerHTML =
      oppvFasitHtml +
      arkData.oppgaver
        .map(
          (oppg) => `
          <div class="fasit-post">
            <div class="fasit-kort-svar">Oppgave ${oppg.nr} (${oppg.tittel}): ${oppg.fasit}</div>
            <ol class="fasit-steg">
              ${oppg.steg.map((s) => `<li>${s}</li>`).join("")}
            </ol>
          </div>`
        )
        .join("");

    oppdaterFasitSynlighet();

    if (window.GC2PY && typeof window.GC2PY.renderMatte === "function") {
      window.GC2PY.renderMatte(document.getElementById("a4-ark"));
    }
  }

  function oppdaterFasitSynlighet() {
    const visFasit = document.getElementById("bryter-fasit").checked;
    const nySide = document.getElementById("bryter-nyside").checked;
    const fasitSeksjon = document.getElementById("fasit-seksjon");
    fasitSeksjon.hidden = !visFasit;
    fasitSeksjon.classList.toggle("ny-side", visFasit && nySide);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const datoInput = document.getElementById("felt-dato");
    if (datoInput && !datoInput.value) {
      datoInput.value = new Date().toISOString().slice(0, 10);
    }

    fyllKarakterstyrkeVelger();
    lesUrlParametre();

    const emneEl = document.getElementById("velg-emne");
    const maalInput = document.getElementById("felt-oktmaal");
    maalInput.placeholder = STANDARD_MAAL[emneEl.value] || STANDARD_MAAL.blandet;

    emneEl.addEventListener("change", () => {
      maalInput.placeholder = STANDARD_MAAL[emneEl.value] || STANDARD_MAAL.blandet;
      byggArk(false);
    });

    ["velg-niva", "velg-antall", "velg-rutestil", "felt-dato"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => byggArk(false));
    });

    const styrkeSel = document.getElementById("velg-styrke");
    if (styrkeSel) {
      styrkeSel.addEventListener("change", () => {
        if (window.GC2PY) window.GC2PY.velgKarakterstyrke(styrkeSel.value);
        byggArk(false);
      });
    }

    maalInput.addEventListener("input", () => byggArk(false));
    document.getElementById("bryter-fasit").addEventListener("change", oppdaterFasitSynlighet);
    document.getElementById("bryter-nyside").addEventListener("change", oppdaterFasitSynlighet);

    document.getElementById("knapp-nye-tall").addEventListener("click", () => {
      byggArk(true);
    });

    document.getElementById("knapp-skriv-ut").addEventListener("click", () => {
      if (window.GC2PY) window.GC2PY.settMaaltrappTrinn("m8", true);
      window.print();
    });

    // Sørg for at KaTeX også kjøres hvis auto-render lastet rett etter
    byggArk(false);
    window.addEventListener("load", () => {
      if (window.GC2PY) window.GC2PY.renderMatte(document.getElementById("a4-ark"));
    });
  });
})();
