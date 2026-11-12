(function () {
  "use strict";

  function lagRng(fro) {
    let tilstand = fro >>> 0;
    return function () {
      tilstand = (1664525 * tilstand + 1013904223) >>> 0;
      return tilstand / 4294967296;
    };
  }

  function velg(rng, liste) {
    return liste[Math.floor(rng() * liste.length)];
  }

  function heltall(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function noko(tall, desimaler) {
    const d = desimaler === undefined ? 2 : desimaler;
    const avrundet = Number(tall.toFixed(d));
    return avrundet.toLocaleString("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: d
    });
  }

  function texTall(tall, desimaler) {
    const d = desimaler === undefined ? 2 : desimaler;
    return Number(tall.toFixed(d)).toString().replace(".", "{,}");
  }

  /* ================= Oppvarmingsgenerator for komplett øktark ================= */
  function genererOppvarmingPoster(rng, emne) {
    const p1 = velg(rng, [10, 15, 20, 25, 30]);
    const p2 = velg(rng, [5, 12, 18, 20, 35]);
    const a = velg(rng, [400, 600, 750, 900]);
    const b = velg(rng, [300, 500, 1000, 1200]);
    const m = velg(rng, [14, 18, 22, 26]);

    if (emne === "funksjoner" || emne === "statistikk") {
      return [
        { spm: `Finn $f(3)$ når $f(x)=${a}x+${b}$`, svar: `${noko(a * 3 + b, 0)} kr` },
        { spm: `Stigningstall i $y=${b}-${a}x$?`, svar: `$-${a}$` },
        { spm: `Median av $${m - 4}, ${m - 1}, ${m}, ${m + 3}, ${m + 8}$`, svar: `$${m}$` },
        { spm: `Variasjonsbredde i rekka over?`, svar: `$${m + 8 - (m - 4)}$` }
      ];
    }
    return [
      { spm: `Vekstfaktor ved $${p1}\\,\\%$ økning?`, svar: `$${texTall(1 + p1 / 100, 2)}$` },
      { spm: `Vekstfaktor ved $${p2}\\,\\%$ rabatt?`, svar: `$${texTall(1 - p2 / 100, 2)}$` },
      { spm: `$25\\,\\%$ av $${noko(a * 4, 0)}\\text{ kr}$?`, svar: `$${noko(a, 0)}\\text{ kr}$` },
      { spm: `Fra $3\\,\\%$ til $5{,}5\\,\\%$ i prosentpoeng?`, svar: `$2{,}5$ prosentpoeng` }
    ];
  }

  /* ================= Parameteriserte 2P-Y oppgavemaler ================= */
  const MALER = [
    // --- PROSENT OG VEKSTFAKTOR ---
    {
      emne: "prosent",
      niva: 1,
      del: "Del 1 · Uten hjelpemidler",
      tittel: "Fagforbundsrabatt på arbeidsklær",
      hoyde: "smal",
      bygg(rng) {
        const pris = velg(rng, [1200, 1500, 1800, 2000, 2400, 2500]);
        const rabatt = velg(rng, [10, 15, 20, 25, 30]);
        const vf = 1 - rabatt / 100;
        const nyPris = pris * vf;
        return {
          tekst: `En varseljakke for anleggsarbeid koster ordinært $${noko(pris, 0)}\\text{ kr}$. Du får $${rabatt}\\,\\%$ lærlingrabatt. Skriv opp vekstfaktoren og regn ut hva du skal betale.`,
          fasit: `Vekstfaktor $v = ${texTall(vf, 2)}$ og ny pris $= ${noko(nyPris, 0)}\\text{ kr}$.`,
          steg: [
            `Vekstfaktor ved $${rabatt}\\,\\%$ avslag: $v = 1 - \\frac{${rabatt}}{100} = ${texTall(vf, 2)}$`,
            `Ny pris: $${pris} \\cdot ${texTall(vf, 2)} = ${noko(nyPris, 0)}\\text{ kr}$`
          ]
        };
      }
    },
    {
      emne: "prosent",
      niva: 1,
      del: "Del 1 · Uten hjelpemidler",
      tittel: "Lønnsøkning etter fagprøve",
      hoyde: "smal",
      bygg(rng) {
        const lonn = velg(rng, [240, 250, 260, 280, 300]);
        const pst = velg(rng, [5, 10, 15]);
        const vf = 1 + pst / 100;
        const ny = lonn * vf;
        return {
          tekst: `En fagarbeider har $${lonn}\\text{ kr}$ i timelønn og får et lønnsløft på $${pst}\\,\\%$. Finn ny timelønn ved hjelp av vekstfaktor.`,
          fasit: `Ny timelønn er $${noko(ny, 1)}\\text{ kr/t}$ ($v = ${texTall(vf, 2)}$).`,
          steg: [
            `Vekstfaktor: $v = 1 + \\frac{${pst}}{100} = ${texTall(vf, 2)}$`,
            `Ny timelønn: $${lonn} \\cdot ${texTall(vf, 2)} = ${texTall(ny, 1)}\\text{ kr/t}$`
          ]
        };
      }
    },
    {
      emne: "prosent",
      niva: 2,
      del: "Del 1 · Kildekritikk",
      tittel: "Prosent vs. prosentpoeng på lån",
      hoyde: "middels",
      bygg(rng) {
        const startRente = velg(rng, [2, 2.5, 4, 5]);
        const okningPst = velg(rng, [20, 25, 40, 50]);
        const sluttRente = startRente * (1 + okningPst / 100);
        const pp = sluttRente - startRente;
        return {
          tekst: `Renta på et billån øker fra $${texTall(startRente, 2)}\\,\\%$ til $${texTall(sluttRente, 2)}\\,\\%$. a) Hvor mange <strong>prosentpoeng</strong> har renta økt? b) Hvor mange <strong>prosent</strong> har selve rentesatsen økt?`,
          fasit: `a) $${texTall(pp, 2)}$ prosentpoeng · b) $${okningPst}\\,\\%$`,
          steg: [
            `a) Differanse i prosentpoeng: $${texTall(sluttRente, 2)} - ${texTall(startRente, 2)} = ${texTall(pp, 2)}\\text{ prosentpoeng}$`,
            `b) Relativ endring fra startverdien: $\\frac{${texTall(pp, 2)}}{${texTall(startRente, 2)}} = ${texTall(okningPst / 100, 2)} = ${okningPst}\\,\\%$`
          ]
        };
      }
    },
    {
      emne: "prosent",
      niva: 2,
      del: "Del 2 · Yrkeskalkyle",
      tittel: "Gjentatt verditap på arbeidsbil",
      hoyde: "middels",
      bygg(rng) {
        const nypris = velg(rng, [380000, 420000, 480000, 550000, 600000]);
        const tap = velg(rng, [12, 14, 15, 18]);
        const aar = velg(rng, [3, 4, 5]);
        const vf = 1 - tap / 100;
        const verdi = nypris * Math.pow(vf, aar);
        const samletTapPst = (1 - Math.pow(vf, aar)) * 100;
        return {
          tekst: `En bedrift kjøper en servicebil til $${noko(nypris, 0)}\\text{ kr}$. Verdien faller med $${tap}\\,\\%$ per år. Finn bilens verdi etter $${aar}$ år og det samlede prosentvise verditapet.`,
          fasit: `Verdi etter $${aar}$ år: ca. $${noko(verdi, 0)}\\text{ kr}$ · Samlet verditap: $${noko(samletTapPst, 1)}\\,\\%$.`,
          steg: [
            `Årlig vekstfaktor: $v = 1 - \\frac{${tap}}{100} = ${texTall(vf, 2)}$`,
            `Verdi etter $${aar}$ år: $V_{${aar}} = ${nypris} \\cdot ${texTall(vf, 2)}^{${aar}} \\approx ${noko(verdi, 0)}\\text{ kr}$`,
            `Samlet vekstfaktor: $${texTall(vf, 2)}^{${aar}} \\approx ${texTall(Math.pow(vf, aar), 3)} \\implies \\text{nedgang } ${texTall(samletTapPst, 1)}\\,\\%$`
          ]
        };
      }
    },
    {
      emne: "prosent",
      niva: 3,
      del: "Del 1 · Eksamensoppgave",
      tittel: "Baklengsregning til førpris etter rabatt og mva.",
      hoyde: "stor",
      bygg(rng) {
        const forpris = velg(rng, [8000, 12000, 16000, 20000, 24000]);
        const rabatt = velg(rng, [10, 20, 25]);
        const vfRab = 1 - rabatt / 100;
        const sluttPris = forpris * vfRab * 1.25;
        return {
          tekst: `En sagbenk får først $${rabatt}\\,\\%$ kampanjerabatt på listeprisen ekskl. mva., og deretter legges det til $25\\,\\%$ mva. Kunden betaler til slutt $${noko(sluttPris, 0)}\\text{ kr}$ inkl. mva. Hva var den opprinnelige listeprisen ekskl. mva.?`,
          fasit: `Opprinnelig listepris ekskl. mva. var $${noko(forpris, 0)}\\text{ kr}$.`,
          steg: [
            `Samlet vekstfaktor: $v_{\\text{total}} = ${texTall(vfRab, 2)} \\cdot 1{,}25 = ${texTall(vfRab * 1.25, 4)}$`,
            `Sett opp likning for ukjent listepris $V_0$: $V_0 \\cdot ${texTall(vfRab * 1.25, 4)} = ${sluttPris}$`,
            `Løs baklengs ved divisjon: $V_0 = \\frac{${sluttPris}}{${texTall(vfRab * 1.25, 4)}} = ${noko(forpris, 0)}\\text{ kr}$`
          ]
        };
      }
    },

    // --- TALL, PROPORSJONALITET OG STANDARDFORM ---
    {
      emne: "algebra",
      niva: 1,
      del: "Del 1 · Uten hjelpemidler",
      tittel: "Direkte proporsjonalitet på byggeplass",
      hoyde: "smal",
      bygg(rng) {
        const meterPris = velg(rng, [45, 60, 75, 85, 120]);
        const m1 = velg(rng, [6, 8, 10]);
        const m2 = velg(rng, [15, 20, 25]);
        return {
          tekst: `$${m1}$ løpemeter trekkerør koster $${noko(meterPris * m1, 0)}\\text{ kr}$. Prisen er proporsjonal med lengden. Finn proporsjonalitetskonstanten $k$ (kr/m) og prisen for $${m2}\\text{ m}$.`,
          fasit: `$k = ${meterPris}\\text{ kr/m}$ og pris for $${m2}\\text{ m}$ er $${noko(meterPris * m2, 0)}\\text{ kr}$.`,
          steg: [
            `Forholdstall: $k = \\frac{y}{x} = \\frac{${meterPris * m1}}{${m1}} = ${meterPris}\\text{ kr/m}$`,
            `Pris for $${m2}\\text{ m}$: $y = ${meterPris} \\cdot ${m2} = ${noko(meterPris * m2, 0)}\\text{ kr}$`
          ]
        };
      }
    },
    {
      emne: "algebra",
      niva: 2,
      del: "Del 1 · Uten hjelpemidler",
      tittel: "Omvendt proporsjonalitet ved arbeidslag",
      hoyde: "middels",
      bygg(rng) {
        const totalTimer = velg(rng, [36, 48, 60, 72]);
        const folk1 = velg(rng, [2, 3]);
        const folk2 = velg(rng, [4, 6]);
        const t1 = totalTimer / folk1;
        const t2 = totalTimer / folk2;
        return {
          tekst: `$${folk1}$ malere bruker $${t1}$ timer på å sprøytemale en lagerhall. Arbeidstiden er omvendt proporsjonal med antall malere. Sett opp et uttrykk $T(x)$ for tiden med $x$ malere, og regn ut tiden hvis $${folk2}$ malere deler jobben.`,
          fasit: `$T(x) = \\frac{${totalTimer}}{x}$ timer, og med $${folk2}$ malere tar oppdraget $${t2}$ timer.`,
          steg: [
            `Samlet timeverk (konstant produkt): $k = x \\cdot y = ${folk1} \\cdot ${t1} = ${totalTimer}\\text{ arbeidstimer}$`,
            `Modell: $T(x) = \\frac{${totalTimer}}{x} \\implies T(${folk2}) = \\frac{${totalTimer}}{${folk2}} = ${t2}\\text{ timer}$`
          ]
        };
      }
    },
    {
      emne: "algebra",
      niva: 3,
      del: "Del 1 · Potenser & standardform",
      tittel: "Regning med tall på standardform",
      hoyde: "middels",
      bygg(rng) {
        const par = velg(rng, [
          { a: 3, e1: 7, b: 4, e2: 3 },
          { a: 6, e1: 8, b: 2, e2: 4 },
          { a: 8, e1: 9, b: 5, e2: 3 },
          { a: 9, e1: 6, b: 3, e2: 2 }
        ]);
        const prod = par.a * par.b;
        const prodNorm = prod >= 10 ? prod / 10 : prod;
        const prodEks = prod >= 10 ? par.e1 + par.e2 + 1 : par.e1 + par.e2;
        return {
          tekst: `Et solkraftverk produserer $${par.a} \\cdot 10^{${par.e1}}\\text{ Wh}$ per dag. Hvor mye energi produseres på $${par.b} \\cdot 10^{${par.e2}}$ slike anlegg? Skriv svaret på <strong>standardform</strong> ($a \\cdot 10^n$ der $1 \\le a < 10$).`,
          fasit: `$${texTall(prodNorm, 1)} \\cdot 10^{${prodEks}}\\text{ Wh}$`,
          steg: [
            `Gang tallfaktorene og legg sammen eksponentene: $(${par.a} \\cdot ${par.b}) \\cdot 10^{${par.e1}+${par.e2}} = ${prod} \\cdot 10^{${par.e1 + par.e2}}$`,
            prod >= 10
              ? `Juster slik at tallet foran er mellom $1$ og $10$: $${prod} \\cdot 10^{${par.e1 + par.e2}} = ${texTall(prodNorm, 1)} \\cdot 10^{${prodEks}}\\text{ Wh}$`
              : `Tallet $${prod}$ ligger allerede mellom $1$ og $10$: $${prod} \\cdot 10^{${prodEks}}\\text{ Wh}$`
          ]
        };
      }
    },

    // --- LINEÆRE FUNKSJONER OG MODELLERING ---
    {
      emne: "funksjoner",
      niva: 1,
      del: "Del 1 · Funksjonsuttrykk",
      tittel: "Sett opp og bruk lineær kostnadsmodell",
      hoyde: "smal",
      bygg(rng) {
        const a = velg(rng, [750, 850, 900, 950, 1050]);
        const b = velg(rng, [800, 1100, 1400, 1600]);
        const timer = velg(rng, [3, 4, 5, 6]);
        const kost = a * timer + b;
        return {
          tekst: `En kuldemontør tar $${noko(b, 0)}\\text{ kr}$ i fast utrykning og $${noko(a, 0)}\\text{ kr}$ per arbeidstime. a) Sett opp funksjonen $K(x)$ for $x$ timer. b) Regn ut prisen for $${timer}$ timers arbeid.`,
          fasit: `a) $K(x) = ${a}x + ${b}$ · b) $K(${timer}) = ${noko(kost, 0)}\\text{ kr}$.`,
          steg: [
            `a) Timeprisen er stigningstallet $a=${a}$ og oppmøtet er konstantleddet $b=${b}$: $K(x) = ${a}x + ${b}$`,
            `b) Sett inn $x = ${timer}$: $K(${timer}) = ${a} \\cdot ${timer} + ${b} = ${a * timer} + ${b} = ${noko(kost, 0)}\\text{ kr}$`
          ]
        };
      }
    },
    {
      emne: "funksjoner",
      niva: 2,
      del: "Del 1 · Topunktsformel",
      tittel: "Finn likningen for ei rett linje ut fra to målinger",
      hoyde: "middels",
      bygg(rng) {
        const b = velg(rng, [320000, 400000, 450000]);
        const tap = velg(rng, [25000, 30000, 35000, 40000]);
        const x1 = 2;
        const x2 = velg(rng, [5, 6]);
        const y1 = b - tap * x1;
        const y2 = b - tap * x2;
        return {
          tekst: `En anleggsmaskin er verdt $${noko(y1, 0)}\\text{ kr}$ etter $${x1}$ år og $${noko(y2, 0)}\\text{ kr}$ etter $${x2}$ år. Vi antar lineært verditap $V(x) = ax + b$. Finn stigningstallet $a$, nyprisen $b$ og tolk begge tallene praktisk.`,
          fasit: `$V(x) = -${tap}x + ${b}$. Maskinen synker med $${noko(tap, 0)}\\text{ kr/år}$ fra nypris $${noko(b, 0)}\\text{ kr}$.`,
          steg: [
            `Stigningstall: $a = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{-${tap * (x2 - x1)}}{${x2 - x1}} = -${tap}\\text{ kr/år}$`,
            `Finn nypris $b$ ved $V(${x1}) = ${y1}$: $-${tap} \\cdot ${x1} + b = ${y1} \\implies b = ${y1} + ${tap * x1} = ${b}\\text{ kr}$`,
            `Funksjonsuttrykk: $V(x) = -${tap}x + ${b}$`
          ]
        };
      }
    },
    {
      emne: "funksjoner",
      niva: 3,
      del: "Del 1/2 · Break-even og gyldighet",
      tittel: "Skjæringspunkt mellom to leverandører",
      hoyde: "stor",
      bygg(rng) {
        const diff = velg(rng, [250, 300, 400]);
        const timerLik = velg(rng, [4, 5, 6, 7, 8]);
        const fastA = diff * timerLik;
        const aA = velg(rng, [700, 800, 850]);
        const aB = aA + diff;
        const prisLik = aB * timerLik;
        return {
          tekst: `Leverandør A tar $${noko(fastA, 0)}\\text{ kr}$ i fast oppstart og $${aA}\\text{ kr/time}$. Leverandør B har $0\\text{ kr}$ i oppstart og tar $${aB}\\text{ kr/time}$. a) Finn ved regning når prisen er lik. b) Hvilken leverandør lønner seg for et oppdrag på $${timerLik + 3}$ timer?`,
          fasit: `a) Lik pris ved $x = ${timerLik}$ timer ($${noko(prisLik, 0)}\\text{ kr}$) · b) Leverandør A lønner seg over $${timerLik}$ timer.`,
          steg: [
            `Sett opp $A(x) = ${aA}x + ${fastA}$ og $B(x) = ${aB}x$`,
            `Lik pris $A(x)=B(x)$: $${aA}x + ${fastA} = ${aB}x \\implies ${diff}x = ${fastA} \\implies x = ${timerLik}\\text{ timer}$`,
            `Ved $${timerLik + 3}$ timer: $A(${timerLik + 3}) = ${noko(aA * (timerLik + 3) + fastA, 0)}\\text{ kr} < B(${timerLik + 3}) = ${noko(aB * (timerLik + 3), 0)}\\text{ kr}$`
          ]
        };
      }
    },

    // --- STATISTIKK, SENTRALMÅL OG SPREDNINGSMÅL ---
    {
      emne: "statistikk",
      niva: 1,
      del: "Del 1 · Uten hjelpemidler",
      tittel: "Typetall, median og variasjonsbredde",
      hoyde: "smal",
      bygg(rng) {
        const m = velg(rng, [15, 18, 20, 24]);
        const tall = [m - 3, m - 1, m - 1, m, m + 2, m + 5, m + 9];
        const usortert = [tall[3], tall[6], tall[1], tall[0], tall[4], tall[2], tall[5]];
        return {
          tekst: `Antall solgte serviceavtaler per dag gjennom én uke var: $${usortert.join(",\\; ")}$. Sorter tallene og finn <strong>typetall</strong>, <strong>median</strong> og <strong>variasjonsbredde</strong>.`,
          fasit: `Typetall $= ${m - 1}$, median $= ${m}$ og variasjonsbredde $= ${tall[6] - tall[0]}$.`,
          steg: [
            `Sortert rekke ($n = 7$): $${tall.join(",\\; ")}$`,
            `Typetall (flest forekomster): $${m - 1}$ · Median (4. tall): $${m}$`,
            `Variasjonsbredde: $${tall[6]} - ${tall[0]} = ${tall[6] - tall[0]}$`
          ]
        };
      }
    },
    {
      emne: "statistikk",
      niva: 2,
      del: "Del 1 · Spredningsmål",
      tittel: "Kvartilbredde ($Q_3 - Q_1$) for måledata",
      hoyde: "middels",
      bygg(rng) {
        const base = velg(rng, [10, 20, 30]);
        const d = [base + 2, base + 4, base + 6, base + 9, base + 11, base + 14, base + 18, base + 25];
        const q1 = (d[1] + d[2]) / 2;
        const q3 = (d[5] + d[6]) / 2;
        const med = (d[3] + d[4]) / 2;
        return {
          tekst: `Ventetid i minutter ved en teknisk kundetelefon for 8 samtaler (sortert): $${d.join(",\\; ")}$. Finn medianen, nedre kvartil $Q_1$, øvre kvartil $Q_3$ og kvartilbredden.`,
          fasit: `Median $= ${noko(med, 1)}$, $Q_1 = ${noko(q1, 1)}$, $Q_3 = ${noko(q3, 1)}$ og kvartilbredde $= ${noko(q3 - q1, 1)}\\text{ min}$.`,
          steg: [
            `Median av alle 8: $\\frac{${d[3]} + ${d[4]}}{2} = ${texTall(med, 1)}$`,
            `Nedre halvdel ($${d.slice(0, 4).join(", ")}$): $Q_1 = \\frac{${d[1]} + ${d[2]}}{2} = ${texTall(q1, 1)}$`,
            `Øvre halvdel ($${d.slice(4).join(", ")}$): $Q_3 = \\frac{${d[5]} + ${d[6]}}{2} = ${texTall(q3, 1)} \\implies Q_3 - Q_1 = ${texTall(q3 - q1, 1)}$`
          ]
        };
      }
    },
    {
      emne: "statistikk",
      niva: 3,
      del: "Del 1/2 · Kritisk statistikk & gruppert data",
      tittel: "Histogram og søylehøyde ved ulik klassebredde",
      hoyde: "stor",
      bygg(rng) {
        const f1 = velg(rng, [12, 16, 20]);
        const f2 = velg(rng, [15, 20, 25]);
        const h1 = f1 / 10;
        const h2 = f2 / 25;
        return {
          tekst: `Alderen til ansatte på en arbeidsplass er gruppert i klassene $[20, 30\\rangle$ med frekvens $${f1}$ og $[30, 55\\rangle$ med frekvens $${f2}$. Regn ut <strong>histogramhøyden</strong> ($\\text{frekvens} / \\text{klassebredde}$) for begge klasser, og forklar hvorfor vi ikke kan bruke rå frekvens som høyde i histogrammet.`,
          fasit: `Høyde for $[20, 30\\rangle$: $${noko(h1, 2)}$ · Høyde for $[30, 55\\rangle$: $${noko(h2, 2)}$.`,
          steg: [
            `Klasse $[20, 30\\rangle$ har bredde $10$: $\\text{høyde} = \\frac{${f1}}{10} = ${texTall(h1, 2)}$`,
            `Klasse $[30, 55\\rangle$ har bredde $25$: $\\text{høyde} = \\frac{${f2}}{25} = ${texTall(h2, 2)}$`,
            `Forklaring: I et histogram er det <em>arealet</em> av søylen som skal tilsvare frekvensen når klassebreddene er ulike.`
          ]
        };
      }
    },

    // --- PYTHON OG DATASETT (DEL 1 KODEFORSTÅELSE) ---
    {
      emne: "python",
      niva: 1,
      del: "Del 1 · Kodeforståelse",
      tittel: "Spor variabler i en for-løkke",
      hoyde: "smal",
      bygg(rng) {
        const start = velg(rng, [2, 5, 10]);
        const tillegg = velg(rng, [3, 4, 6]);
        const ant = velg(rng, [3, 4]);
        const slutt = start + tillegg * ant;
        return {
          tekst: `Hva skriver Python-koden <code>total = ${start}; for i in range(${ant}): total = total + ${tillegg}; print(total)</code> ut på skjermen? Vis mellomregning for hver runde i løkka.`,
          fasit: `Programmet skriver ut $${slutt}$.`,
          steg: [
            `<code>range(${ant})</code> kjører løkka $${ant}$ ganger og legger til $${tillegg}$ hver gang.`,
            `Sluttverdi: $${start} + ${ant} \\cdot ${tillegg} = ${slutt}$.`
          ]
        };
      }
    },
    {
      emne: "python",
      niva: 2,
      del: "Del 1 · Algoritmer & vekstfaktor",
      tittel: "Tolke og fullføre while-løkke for sparing",
      hoyde: "middels",
      bygg(rng) {
        const belop = velg(rng, [1000, 2000]);
        const vf = 1.5;
        const grense = belop * 3;
        return {
          tekst: `Vi starter med <code>saldo = ${belop}</code> og <code>aar = 0</code>. I ei løkke kjøres <code>while saldo &lt; ${grense}: saldo = saldo * 1.5; aar = aar + 1</code>. Hvilke verdier har <code>aar</code> og <code>saldo</code> når løkka stopper?`,
          fasit: `<code>aar = 3</code> og <code>saldo = ${noko(belop * 3.375, 1)}</code>.`,
          steg: [
            `Etter 1. runde: $\\text{saldo} = ${belop * 1.5}$, $\\text{aar} = 1$`,
            `Etter 2. runde: $\\text{saldo} = ${belop * 2.25}$, $\\text{aar} = 2$ (fortsatt $< ${grense}$)`,
            `Etter 3. runde: $\\text{saldo} = ${texTall(belop * 3.375, 1)} \\ge ${grense}$, løkka stopper med $\\text{aar} = 3$.`
          ]
        };
      }
    },
    {
      emne: "python",
      niva: 3,
      del: "Del 1/2 · Premisser i samfunnsmodeller",
      tittel: "Vurdere premisser i en Python-prognose",
      hoyde: "stor",
      bygg(rng) {
        const innbyggere = velg(rng, [15000, 22000, 30000]);
        const pst = velg(rng, [3, 4]);
        const vf = 1 + pst / 100;
        const aar = 10;
        const slutt = Math.round(innbyggere * Math.pow(vf, aar));
        return {
          tekst: `En kommune med $${noko(innbyggere, 0)}$ innbyggere bruker Python-formelen <code>innbyggere = ${innbyggere} * (${vf} ** x)</code> for å spå folketallet om $x$ år. a) Forklar hvilket premiss kommunen bygger modellen på, og regn ut svaret for $x = ${aar}$. b) Nevn to realistiske forhold som kan gjøre modellen usikker langt fram i tid.`,
          fasit: `a) Premiss: fast årlig vekst på $${pst}\\,\\%$; etter $${aar}$ år ca. $${noko(slutt, 0)}$ innbyggere · b) Endret boligbygging, arbeidsmarked eller fødsels-/flyttetall.`,
          steg: [
            `a) Vekstfaktor $${texTall(vf, 2)}$ betyr fast årlig vekst på $${pst}\\,\\%$: $${innbyggere} \\cdot ${texTall(vf, 2)}^{${aar}} \\approx ${noko(slutt, 0)}$`,
            `b) Eksponentielle modeller med fast prosent gjelder sjelden uendret over mange tiår (begrenset tomteareal, konjunkturer og politiske vedtak endrer premissene).`
          ]
        };
      }
    }
  ];

  function genererOppgaveark(valg) {
    const fro = valg.fro || Math.floor(1000 + Math.random() * 9000);
    const rng = lagRng(fro);
    const emne = valg.emne || "blandet";
    const niva = valg.niva || "komplett";
    const antall = Number(valg.antall || 6);

    const aktuelleEmner = emne === "blandet"
      ? MALER
      : MALER.filter((m) => m.emne === emne);

    let kandidater = aktuelleEmner;
    if (niva === "niva1") kandidater = aktuelleEmner.filter((m) => m.niva === 1);
    if (niva === "niva2") kandidater = aktuelleEmner.filter((m) => m.niva === 2);
    if (niva === "niva3") kandidater = aktuelleEmner.filter((m) => m.niva === 3);
    if (kandidater.length === 0) kandidater = aktuelleEmner;

    const oppgaver = [];
    if (niva === "komplett") {
      const n1 = aktuelleEmner.filter((m) => m.niva === 1);
      const n2 = aktuelleEmner.filter((m) => m.niva === 2);
      const n3 = aktuelleEmner.filter((m) => m.niva === 3);
      const rekkefolge = [];
      const antN1 = Math.max(1, Math.round(antall * 0.35));
      const antN2 = Math.max(1, Math.round(antall * 0.4));
      const antN3 = Math.max(1, antall - antN1 - antN2);

      for (let i = 0; i < antN1; i++) rekkefolge.push((n1.length ? n1 : aktuelleEmner)[i % (n1.length || aktuelleEmner.length)]);
      for (let i = 0; i < antN2; i++) rekkefolge.push((n2.length ? n2 : aktuelleEmner)[i % (n2.length || aktuelleEmner.length)]);
      for (let i = 0; i < antN3; i++) rekkefolge.push((n3.length ? n3 : aktuelleEmner)[i % (n3.length || aktuelleEmner.length)]);

      rekkefolge.slice(0, antall).forEach((mal, idx) => {
        const data = mal.bygg(rng);
        oppgaver.push(Object.assign({ nr: idx + 1, niva: mal.niva, del: mal.del, tittel: mal.tittel, hoyde: mal.hoyde }, data));
      });
    } else {
      for (let i = 0; i < antall; i++) {
        const mal = kandidater[i % kandidater.length];
        const data = mal.bygg(rng);
        oppgaver.push(Object.assign({ nr: i + 1, niva: mal.niva, del: mal.del, tittel: mal.tittel, hoyde: mal.hoyde }, data));
      }
    }

    return {
      arkKode: `GC-2PY-${fro}`,
      fro,
      oppvarming: niva === "komplett" ? genererOppvarmingPoster(rng, emne) : [],
      oppgaver
    };
  }

  window.GC2PY_WORKSHEET_BANK = {
    genererOppgaveark
  };
})();
