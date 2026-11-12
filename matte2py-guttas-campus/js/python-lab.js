(function () {
  "use strict";

  let pyodideInstans = null;
  let lasterPromise = null;

  async function hentPyodide(statusEl) {
    if (pyodideInstans) return pyodideInstans;
    if (lasterPromise) return lasterPromise;

    if (statusEl) statusEl.textContent = "Laster Python 3.12 (Pyodide WebAssembly)…";

    lasterPromise = (async () => {
      if (typeof window.loadPyodide !== "function") {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Kunne ikke laste Pyodide fra CDN."));
          document.head.appendChild(script);
        });
      }
      pyodideInstans = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/"
      });
      if (statusEl) statusEl.textContent = "Python 3.12 klar i nettleseren";
      return pyodideInstans;
    })();

    return lasterPromise;
  }

  function initPythonBokser() {
    document.querySelectorAll("[data-python-lab]").forEach((lab) => {
      const editor = lab.querySelector(".python-editor");
      const utskrift = lab.querySelector(".python-utskrift");
      const kjorKnapp = lab.querySelector("[data-python-kjor]");
      const nullstillKnapp = lab.querySelector("[data-python-nullstill]");
      const statusEl = lab.querySelector(".python-status");
      const malKnapper = [...lab.querySelectorAll("[data-mal-kode]")];
      if (!editor || !utskrift || !kjorKnapp) return;

      let startKode = editor.value;

      malKnapper.forEach((knapp) => {
        knapp.addEventListener("click", () => {
          const malEl = document.getElementById(knapp.dataset.malKode);
          if (!malEl) return;
          malKnapper.forEach((b) => b.classList.toggle("aktiv", b === knapp));
          editor.value = malEl.textContent.trim();
          startKode = editor.value;
          utskrift.classList.remove("feil");
          utskrift.textContent = "Ny 2P-Y-mal lastet inn. Klikk «▶ Kjør Python-kode» (eller Ctrl+Enter).";
        });
      });

      async function kjor() {
        kjorKnapp.disabled = true;
        utskrift.classList.remove("feil");
        utskrift.textContent = "Kjører Python-kode…";
        const linjer = [];

        try {
          const py = await hentPyodide(statusEl);
          py.setStdout({ batched: (m) => linjer.push(m) });
          py.setStderr({ batched: (m) => linjer.push(m) });
          await py.runPythonAsync(editor.value);
          utskrift.textContent = linjer.length
            ? linjer.join("\n")
            : "(Koden kjørte uten feil, men hadde ingen print()-utskrift.)";

          if (window.GC2PY) {
            if (lab.dataset.oppgaveId) {
              window.GC2PY.registrerOppgaveLost(lab.dataset.oppgaveId, false, "m7");
            } else {
              window.GC2PY.settMaaltrappTrinn("m7", true);
            }
          }
        } catch (err) {
          utskrift.classList.add("feil");
          utskrift.textContent =
            "Feilmelding fra Python (bruk Nysgjerrighet – sjekk linjenummeret nederst):\n" +
            (err && err.message ? err.message : String(err));
        } finally {
          kjorKnapp.disabled = false;
        }
      }

      kjorKnapp.addEventListener("click", kjor);

      if (nullstillKnapp) {
        nullstillKnapp.addEventListener("click", () => {
          editor.value = startKode;
          utskrift.classList.remove("feil");
          utskrift.textContent = "Koden er tilbakestilt til opprinnelig mal.";
        });
      }

      editor.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          kjor();
        } else if (e.key === "Tab") {
          e.preventDefault();
          const s = editor.selectionStart;
          const slutt = editor.selectionEnd;
          editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(slutt);
          editor.selectionStart = editor.selectionEnd = s + 4;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initPythonBokser);
})();
