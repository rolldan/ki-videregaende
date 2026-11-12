# MA2PY – Matematikk 2P-Y (Vg3 påbygging)

Interaktivt læreverk og A4-oppgavearkgenerator i **Matematikk 2P-Y** (`MAT06-04`, LK20) for elever på Vg3 påbygging til generell studiekompetanse etter yrkesfag.

Prosjektet er bygget som en ren statisk nettside uten byggesteg (HTML, CSS, vanilla JavaScript, KaTeX og kjørbar Python i nettleseren via Pyodide) og kan publiseres direkte med **GitHub Pages** fra rotmappen (`/`).

---

## Innhold og utgaver

| Sti | Beskrivelse |
|---|---|
| [`index.html`](index.html) | Felles startportal / utgavevelger for GitHub Pages |
| [`matte2py-guttas-campus/`](matte2py-guttas-campus/index.html) | **Guttas Campus-utgave:** Synlig læring (måltrapp), utviklende tankesett («ennå»), de 7 karakterstyrkene, fast øktramme, mentormodus, kjørbar Python-lab og **utskriftsklar A4-oppgavearkgenerator** med ruteark og separat fasit |
| [`matte2py/`](matte2py/index.html) | **Standard læreverk-utgave:** Kapitteloversikt etter NDLA 2P-Y, hurtigsøk, begrepsregister A–Å, trinnvise utregningseksempler, interaktive SVG-grafer, «Uklart for meg»-eksport og Python-lab |

---

## Faglig dekning (LK20 `MAT06-04` / NDLA 2P-Y)

1. **Tall og algebra** – Proporsjonalitet og omvendt proporsjonalitet, prosent, prosentpoeng, vekstfaktor ($V = V_0 \cdot v^n$), potenser, rotuttrykk og standardform.
2. **Funksjoner og modellering** – Funksjonsbegrepet ($D_f, V_f$), lineære modeller ($f(x) = ax + b$), topunktsformel, skjæringspunkt/break-even, ikke-lineære modeller og gyldighetsområde.
3. **Statistikk** – Frekvenstabeller, sentralmål (gjennomsnitt, median, typetall), spredningsmål (variasjonsbredde, kvartilbredde, standardavvik) og histogram.
4. **Arbeid med datasett og kritisk tallbruk** – Yrkesnære kalkyler og vurdering av statistikk/grafer i samfunns- og arbeidsliv.
5. **Algoritmer og programmering (Python)** – Variabler, løkker (`for`/`while`), vilkår, lister, simulering av sparing/lån og halveringsmetoden direkte i nettleseren med Pyodide.
6. **Del 1 & Del 2-trening** – Hoderegning og kodeforståelse uten hjelpemidler (Del 1) kombinert med digital problemløsing (Del 2).

---

## Kjøre lokalt

Ingen avhengigheter eller `npm install` kreves:

```bash
python3 -m http.server 8080
```

Åpne deretter <http://localhost:8080> i nettleseren.

---

## Publisering på GitHub Pages

1. Gå til **Settings → Pages** i GitHub-repoet.
2. Velg **Source:** `Deploy from a branch`.
3. Velg branch **`main`** og mappe **`/ (root)`**, og klikk **Save**.
4. Siden blir tilgjengelig på `https://<eier>.github.io/MA2PY/` (med direkte tilgang til `/matte2py-guttas-campus/` og `/matte2py/`).
