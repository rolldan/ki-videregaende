(function () {
  "use strict";

  const FRAMDRIFT_KEY = "m2py:framdrift:v1";
  const UKLART_KEY = "m2py:uklart:v1";
  const TEMA_KEY = "m2py:tema:v1";
  const TOTALT_OPPGAVER = 10;

  function lesJson(nokkel, standard) {
    try {
      const raa = localStorage.getItem(nokkel);
      return raa ? JSON.parse(raa) : standard;
    } catch {
      return standard;
    }
  }

  function skrivJson(nokkel, verdi) {
    try {
      localStorage.setItem(nokkel, JSON.stringify(verdi));
    } catch {}
  }

  /* ================= Lys / mørk modus ================= */
  function brukTema(tema) {
    const rot = document.documentElement;
    if (tema === "dark" || tema === "light") {
      rot.setAttribute("data-theme", tema);
    } else {
      const foretrekkerMork = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      rot.setAttribute("data-theme", foretrekkerMork ? "dark" : "light");
    }
    const knapp = document.getElementById("tema-knapp");
    if (knapp) {
      const aktivtMork = rot.getAttribute("data-theme") === "dark";
      knapp.textContent = aktivtMork ? "☀ Lys visning" : "☾ Mørk visning";
      knapp.setAttribute("aria-pressed", String(aktivtMork));
    }
  }

  function initTema() {
    const lagret = localStorage.getItem(TEMA_KEY);
    brukTema(lagret);
    const knapp = document.getElementById("tema-knapp");
    if (knapp) {
      knapp.addEventListener("click", () => {
        const naa = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(TEMA_KEY, naa);
        } catch {}
        brukTema(naa);
      });
    }
  }

  /* ================= Framdrift i localStorage ================= */
  function hentFramdrift() {
    return lesJson(FRAMDRIFT_KEY, { oppgaver: {} });
  }

  function registrerOppgaveLost(id, bruktHint) {
    const data = hentFramdrift();
    const eksisterende = data.oppgaver[id] || {};
    data.oppgaver[id] = {
      lost: true,
      bruktHint: Boolean(eksisterende.bruktHint || bruktHint),
      tidspunkt: Date.now()
    };
    skrivJson(FRAMDRIFT_KEY, data);
    oppdaterFramdriftUI();
  }

  function oppdaterFramdriftUI() {
    const data = hentFramdrift();
    const losteIds = Object.keys(data.oppgaver).filter((k) => data.oppgaver[k]?.lost);
    const antallLost = losteIds.length;
    const utenHint = losteIds.filter((k) => !data.oppgaver[k]?.bruktHint).length;

    const tellerPille = document.getElementById("topp-framdrift");
    if (tellerPille) {
      tellerPille.textContent = `${antallLost} / ${TOTALT_OPPGAVER} oppgaver løst`;
    }

    const barFyll = document.getElementById("framdrift-fyll");
    if (barFyll) {
      const pst = Math.min(100, Math.round((antallLost / TOTALT_OPPGAVER) * 100));
      barFyll.style.width = `${pst}%`;
    }

    const tekstEl = document.getElementById("framdrift-tekst");
    if (tekstEl) {
      if (antallLost === 0) {
        tekstEl.textContent = `Ingen oppgaver registrert ennå – start med Prosent og vekstfaktor eller Lineære modeller.`;
      } else {
        tekstEl.textContent = `${antallLost} av ${TOTALT_OPPGAVER} interaktive oppgaver løst (${utenHint} helt uten hint).`;
      }
    }

    document.querySelectorAll(".oppgave-kort[data-oppgave-id]").forEach((kort) => {
      const id = kort.dataset.oppgaveId;
      const status = kort.querySelector(".oppgave-status-merke");
      if (data.oppgaver[id]?.lost) {
        kort.classList.add("lost");
        if (status) {
          status.textContent = data.oppgaver[id].bruktHint ? "✓ Løst (med hint)" : "✓ Løst på egen hånd";
        }
      } else {
        kort.classList.remove("lost");
        if (status) status.textContent = "Ikke løst ennå";
      }
    });
  }

  function initNullstillFramdrift() {
    const knapp = document.getElementById("nullstill-framdrift");
    if (!knapp) return;
    knapp.addEventListener("click", () => {
      skrivJson(FRAMDRIFT_KEY, { oppgaver: {} });
      oppdaterFramdriftUI();
    });
  }

  /* ================= Steg-for-steg eksempler ================= */
  function initStegEksempler() {
    document.querySelectorAll("[data-eksempel]").forEach((boks) => {
      const steg = [...boks.querySelectorAll(".steg-rad")];
      const nesteKnapp = boks.querySelector("[data-steg-neste]");
      const visAlleKnapp = boks.querySelector("[data-steg-alle]");
      const nullstillKnapp = boks.querySelector("[data-steg-nullstill]");
      if (!nesteKnapp || !steg.length) return;

      function oppdaterKnapper() {
        const skjulte = steg.filter((s) => !s.classList.contains("vist")).length;
        nesteKnapp.disabled = skjulte === 0;
        nesteKnapp.textContent = skjulte === 0 ? "Alle steg vist" : `Neste steg (${steg.length - skjulte + 1}/${steg.length})`;
      }

      nesteKnapp.addEventListener("click", () => {
        const neste = steg.find((s) => !s.classList.contains("vist"));
        if (neste) neste.classList.add("vist");
        oppdaterKnapper();
      });

      if (visAlleKnapp) {
        visAlleKnapp.addEventListener("click", () => {
          steg.forEach((s) => s.classList.add("vist"));
          oppdaterKnapper();
        });
      }

      if (nullstillKnapp) {
        nullstillKnapp.addEventListener("click", () => {
          steg.forEach((s, idx) => s.classList.toggle("vist", idx === 0));
          oppdaterKnapper();
        });
      }

      oppdaterKnapper();
    });
  }

  /* ================= Egenvurderingsoppgaver ================= */
  function tolkTall(streng) {
    if (!streng) return NaN;
    const renset = streng
      .trim()
      .replace(/\s+/g, "")
      .replace(",", ".")
      .replace(/%$/, "")
      .replace(/kr$/i, "");
    return Number(renset);
  }

  function initOppgaver() {
    document.querySelectorAll(".oppgave-kort[data-oppgave-id]").forEach((kort) => {
      const id = kort.dataset.oppgaveId;
      const type = kort.dataset.type || "tall";
      const sjekkKnapp = kort.querySelector("[data-sjekk]");
      const hintKnapp = kort.querySelector("[data-vis-hint]");
      const losningKnapp = kort.querySelector("[data-vis-losning]");
      const hintPanel = kort.querySelector(".hint-panel");
      const losningPanel = kort.querySelector(".losning-panel");
      const tilbakemelding = kort.querySelector(".tilbakemelding");
      let harApnetHint = false;

      if (hintKnapp && hintPanel) {
        hintKnapp.addEventListener("click", () => {
          harApnetHint = true;
          const erVist = hintPanel.classList.toggle("vist");
          hintKnapp.textContent = erVist ? "Skjul hint" : "Vis hint";
        });
      }

      if (losningKnapp && losningPanel) {
        losningKnapp.addEventListener("click", () => {
          harApnetHint = true;
          const erVist = losningPanel.classList.toggle("vist");
          losningKnapp.textContent = erVist ? "Skjul løsningsforslag" : "Steg-for-steg løsning";
        });
      }

      if (!sjekkKnapp || !tilbakemelding) return;

      function kontrollerSvar() {
        if (type === "tall") {
          const input = kort.querySelector(".svar-input");
          const fasit = Number(kort.dataset.fasit);
          const toleranse = Number(kort.dataset.toleranse || "0.02");
          const verdi = tolkTall(input ? input.value : "");

          if (Number.isNaN(verdi)) {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = "Skriv inn et tall først (både komma og punktum fungerer).";
            return;
          }

          if (Math.abs(verdi - fasit) <= toleranse) {
            tilbakemelding.className = "tilbakemelding rett";
            tilbakemelding.textContent = kort.dataset.rettMelding || "Riktig! Godt jobbet.";
            registrerOppgaveLost(id, harApnetHint);
          } else {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = kort.dataset.feilMelding || "Ikke helt riktig ennå. Sjekk enhetene eller åpne hintet.";
          }
        } else if (type === "flervalg") {
          const valgt = kort.querySelector('input[type="radio"]:checked');
          if (!valgt) {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = "Velg ett av svaralternativene først.";
            return;
          }
          if (valgt.value === kort.dataset.fasit) {
            tilbakemelding.className = "tilbakemelding rett";
            tilbakemelding.textContent = kort.dataset.rettMelding || "Riktig svar!";
            registrerOppgaveLost(id, harApnetHint);
          } else {
            tilbakemelding.className = "tilbakemelding feil";
            tilbakemelding.textContent = valgt.dataset.forklaring || kort.dataset.feilMelding || "Ikke riktig alternativ – prøv igjen eller se hintet.";
          }
        }
      }

      sjekkKnapp.addEventListener("click", kontrollerSvar);
      const input = kort.querySelector(".svar-input");
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            kontrollerSvar();
          }
        });
      }
    });
  }

  /* ================= «Uklart for meg» (inspirert av 1T-artefakten) ================= */
  function hentUklart() {
    return lesJson(UKLART_KEY, []);
  }

  function lagreUklart(liste) {
    skrivJson(UKLART_KEY, liste);
    oppdaterUklartUI();
  }

  function oppdaterUklartUI() {
    const liste = hentUklart();
    const pille = document.getElementById("uklar-oversikt-knapp");
    if (pille) {
      pille.textContent = liste.length > 0 ? `? Uklart (${liste.length})` : "? Uklart (0)";
      pille.classList.toggle("uklar-aktiv", liste.length > 0);
    }

    document.querySelectorAll(".uklar-knapp[data-uklar-id]").forEach((knapp) => {
      const id = knapp.dataset.uklarId;
      const markert = liste.some((x) => x.id === id);
      knapp.setAttribute("aria-pressed", String(markert));
      knapp.textContent = markert ? "✓ Markert som uklart" : "? Uklart for meg";
    });

    const modalListe = document.getElementById("uklar-modal-liste");
    if (modalListe) {
      if (liste.length === 0) {
        modalListe.innerHTML = '<li><span>Ingen seksjoner markert som uklare ennå. Klikk «? Uklart for meg» ved et tema du vil ta opp i timen.</span></li>';
      } else {
        modalListe.innerHTML = liste
          .map(
            (pkt, idx) =>
              `<li><div><strong>${pkt.tittel}</strong><br><small>${pkt.side}</small></div><button type="button" class="knapp knapp-sek knapp-liten" data-fjern-uklar="${idx}">Fjern</button></li>`
          )
          .join("");
        modalListe.querySelectorAll("[data-fjern-uklar]").forEach((b) => {
          b.addEventListener("click", () => {
            const kopi = hentUklart();
            kopi.splice(Number(b.dataset.fjernUklar), 1);
            lagreUklart(kopi);
          });
        });
      }
    }
  }

  function initUklart() {
    document.querySelectorAll(".uklar-knapp[data-uklar-id]").forEach((knapp) => {
      knapp.addEventListener("click", () => {
        const id = knapp.dataset.uklarId;
        const tittel = knapp.dataset.uklarTittel || id;
        const side = document.title.replace(/\s*·.*$/, "");
        const liste = hentUklart();
        const indeks = liste.findIndex((x) => x.id === id);
        if (indeks >= 0) {
          liste.splice(indeks, 1);
        } else {
          liste.push({ id, tittel, side });
        }
        lagreUklart(liste);
      });
    });

    const modal = document.getElementById("uklar-modal");
    const aapne = document.getElementById("uklar-oversikt-knapp");
    const lukk = document.getElementById("lukk-uklar-modal");
    const kopier = document.getElementById("kopier-uklar-tekst");

    if (aapne && modal) {
      aapne.addEventListener("click", () => {
        oppdaterUklartUI();
        modal.hidden = false;
      });
    }
    if (lukk && modal) {
      lukk.addEventListener("click", () => {
        modal.hidden = true;
      });
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.hidden = true;
      });
    }
    if (kopier) {
      kopier.addEventListener("click", async () => {
        const liste = hentUklart();
        const tekst = liste.length
          ? "Spørsmål til matematikktimen (2P-Y):\n" + liste.map((x) => `- ${x.tittel} (${x.side})`).join("\n")
          : "Ingen punkter markert.";
        try {
          await navigator.clipboard.writeText(tekst);
          kopier.textContent = "✓ Kopiert til utklippstavle";
          setTimeout(() => {
            kopier.textContent = "Kopier liste til lærer";
          }, 2000);
        } catch {}
      });
    }

    oppdaterUklartUI();
  }

  /* ================= Aktiv seksjon i toppmeny ================= */
  function initSeksjonsObserver() {
    const lenker = [...document.querySelectorAll(".seksjonsmeny a")];
    const seksjoner = [...document.querySelectorAll("section.fag-seksjon[id]")];
    if (!lenker.length || !seksjoner.length || !("IntersectionObserver" in window)) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lenker.forEach((l) => {
            l.classList.toggle("aktiv", l.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    seksjoner.forEach((s) => obs.observe(s));
  }

  /* ================= KaTeX formelrendering ================= */
  function renderMatte() {
    if (typeof window.renderMathInElement === "function") {
      window.renderMathInElement(document.body, {
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
    initStegEksempler();
    initOppgaver();
    initNullstillFramdrift();
    initUklart();
    initSeksjonsObserver();
    oppdaterFramdriftUI();
    renderMatte();
  });

  window.M2PY = {
    registrerOppgaveLost,
    oppdaterFramdriftUI,
    renderMatte
  };
})();
