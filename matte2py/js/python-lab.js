(function () {
  "use strict";

  let pyodideInstans = null;
  let lasterPyodide = null;

  async function hentPyodide(statusEl) {
    if (pyodideInstans) return pyodideInstans;
    if (lasterPyodide) return lasterPyodide;

    if (statusEl) statusEl.textContent = "Laster Python-motor (Pyodide WebAssembly)…";

    lasterPyodide = (async () => {
      if (typeof window.loadPyodide !== "function") {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js";
          s.onload = resolve;
          s.onerror = () => reject(new Error("Kunne ikke laste Pyodide fra CDN."));
          document.head.appendChild(s);
        });
      }
      pyodideInstans = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/"
      });
      if (statusEl) statusEl.textContent = "Python 3.12 klar i nettleseren";
      return pyodideInstans;
    })();

    return lasterPyodide;
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

      let originalKode = editor.value;

      malKnapper.forEach((knapp) => {
        knapp.addEventListener("click", () => {
          const malId = knapp.dataset.malKode;
          const malScript = document.getElementById(malId);
          if (!malScript) return;
          malKnapper.forEach((b) => b.classList.toggle("aktiv", b === knapp));
          editor.value = malScript.textContent.trim();
          originalKode = editor.value;
          utskrift.classList.remove("feil");
          utskrift.textContent = "Mal lastet inn. Klikk «Kjør Python-kode» (eller Ctrl+Enter) for å se utskriften.";
        });
      });

      async function kjorKode() {
        kjorKnapp.disabled = true;
        utskrift.classList.remove("feil");
        utskrift.textContent = "Kjører kode…";
        const linjer = [];

        try {
          const py = await hentPyodide(statusEl);
          py.setStdout({ batched: (msg) => linjer.push(msg) });
          py.setStderr({ batched: (msg) => linjer.push(msg) });
          await py.runPythonAsync(editor.value);
          utskrift.textContent = linjer.length ? linjer.join("\n") : "(Koden kjørte uten feil, men brukte ikke print().)";
          if (lab.dataset.oppgaveId && window.M2PY) {
            window.M2PY.registrerOppgaveLost(lab.dataset.oppgaveId, false);
          }
        } catch (err) {
          utskrift.classList.add("feil");
          utskrift.textContent = "Feilmelding fra Python:\n" + (err && err.message ? err.message : String(err));
        } finally {
          kjorKnapp.disabled = false;
        }
      }

      kjorKnapp.addEventListener("click", kjorKode);

      if (nullstillKnapp) {
        nullstillKnapp.addEventListener("click", () => {
          editor.value = originalKode;
          utskrift.classList.remove("feil");
          utskrift.textContent = "Koden er tilbakestilt til utgangspunktet.";
        });
      }

      editor.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          kjorKode();
        } else if (e.key === "Tab") {
          e.preventDefault();
          const start = editor.selectionStart;
          const slutt = editor.selectionEnd;
          editor.value = editor.value.slice(0, start) + "    " + editor.value.slice(slutt);
          editor.selectionStart = editor.selectionEnd = start + 4;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initPythonBokser);
})();
