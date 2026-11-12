(function () {
  "use strict";

  const KARAKTERSTYRKER = [
    {
      id: "selvkontroll",
      navn: "Selvkontroll",
      viSier: "«Tell til 10»",
      beskrivelse: "Lese oppgaveteksten rolig to ganger, rydde vekk distraksjoner og føre mellomregning ryddig steg for steg.",
      matteTips: "Skriv alltid opp opplysningene med benevning før du begynner å regne."
    },
    {
      id: "viljestyrke",
      navn: "Viljestyrke",
      viSier: "«Gi aldri opp»",
      beskrivelse: "Bli stående i tekstoppgaven når det butter imot – prøv en skisse, lag tabell eller åpne ett hint i stedet for å gi deg.",
      matteTips: "Når en oppgave ser lang ut: del den i del A (hva vet jeg?) og del B (hva spør de om?)."
    },
    {
      id: "engasjement",
      navn: "Engasjement",
      viSier: "«Brenn for dine mål»",
      beskrivelse: "Koble påbygg-matematikken til ditt eget fagbrev, egen økonomi og studiene du sikter mot.",
      matteTips: "Tenk på hvert regnestykke som et ekte pristilbud, lønnsoppgjør eller budsjett i arbeidslivet."
    },
    {
      id: "nysgjerrighet",
      navn: "Nysgjerrighet",
      viSier: "«Prøv, se og lær»",
      beskrivelse: "Teste verdier i grafer og Python-kode: «Hva skjer hvis renta dobles eller fastprisen øker?»",
      matteTips: "Endre ett tall om gangen i grafen eller Python-koden og observer mønsteret."
    },
    {
      id: "optimisme",
      navn: "Optimisme",
      viSier: "«Tro på det»",
      beskrivelse: "Bruke kraften i ordet «ennå»: Jeg mestrer ikke dette helt ennå – men øving flytter meg opp Måltrappa.",
      matteTips: "Feil svar er informasjon om hvilket steg som må justeres, ikke en dom over evnene dine."
    },
    {
      id: "sosial",
      navn: "Sosial kompetanse",
      viSier: "«Best sammen»",
      beskrivelse: "Forklare løsningssteg høyt til sidemannen og tørre å spørre mentor eller lærer tidlig.",
      matteTips: "Hvis du kan forklare hvorfor vekstfaktoren blir 0,85 til en medelev, kan du det på eksamen også."
    },
    {
      id: "takknemlighet",
      navn: "Takknemlighet",
      viSier: "«Si takk»",
      beskrivelse: "Legge merke til egen fremgang på Måltrappa og verdsette konkret tilbakemelding i læringsfellesskapet.",
      matteTips: "Kryss av målene du har nådd før du avslutter økta – synlig fremgang bygger mestringstro."
    }
  ];

  const MAALTRAPPA = [
    { id: "m1", trinn: 1, tekst: "Jeg kan gjøre om mellom prosent og vekstfaktor ved økning og nedgang.", lenke: "okt-prosent-vekst.html#teori" },
    { id: "m2", trinn: 1, tekst: "Jeg kan forklare forskjellen på prosent og prosentpoeng i økonomi og media.", lenke: "okt-prosent-vekst.html#teori" },
    { id: "m3", trinn: 2, tekst: "Jeg kan bruke formelen V = V₀ · vⁿ på lån, sparing og verditap over flere år.", lenke: "okt-prosent-vekst.html#mestringsloype" },
    { id: "m4", trinn: 2, tekst: "Jeg kan tolke stigningstall (a) og konstantledd (b) i praktiske yrkesmodeller f(x) = ax + b.", lenke: "okt-funksjoner-statistikk.html#teori" },
    { id: "m5", trinn: 2, tekst: "Jeg kan regne ut og velge mellom gjennomsnitt og median ved skjevfordelte tall (f.eks. lønn).", lenke: "okt-funksjoner-statistikk.html#statistikk-del" },
    { id: "m6", trinn: 3, tekst: "Jeg kan finne skjæringspunkt (break-even) mellom to tilbud og vurdere modellens gyldighet.", lenke: "okt-funksjoner-statistikk.html#mestringsloype" },
    { id: "m7", trinn: 3, tekst: "Jeg kan kjøre og tilpasse en Python-løkke (while/for) for sparing, lån eller datasett.", lenke: "python-lab.html" },
    { id: "m8", trinn: 3, tekst: "Jeg har gjennomført et utskrevet mengdetreningsark for hånd (Del 1-trening).", lenke: "oppgaveark.html" }
  ];

  const SOK_INDEKS = [
    { tittel: "1.1 Proporsjonalitet og omvendt proporsjonalitet", emne: "Kap. 1 · Tall og algebra (KM463)", stikkord: "proporsjonal koordinatsystem forholdstall y/x=k timearbeid materialpris", url: "index.html#pensum-oversikt" },
    { tittel: "1.2 Prosent, prosentpoeng og vekstfaktor (Full Guttas Campus-økt)", emne: "Kap. 1 · Tall og algebra (KM457)", stikkord: "prosent vekstfaktor prosentpoeng rabatt mva rente verditap sparing bsu eksponentiell", url: "okt-prosent-vekst.html" },
    { tittel: "1.3 Potenser, rotuttrykk og tall på standardform", emne: "Kap. 1 · Tall og algebra (KM458)", stikkord: "potens tierpotens standardform kvadratrot n-terot store små tall", url: "oppgaveark.html?emne=algebra" },
    { tittel: "2.1 Funksjonsbegrepet, definisjonsmengde og verdimengde", emne: "Kap. 2 · Funksjoner og modellering (KM459, KM460)", stikkord: "funksjon intervall definisjonsmengde verdimengde Df Vf graf", url: "index.html#pensum-oversikt" },
    { tittel: "2.2 Lineære funksjoner, topunktsformel og break-even (Full Guttas Campus-økt)", emne: "Kap. 2 · Funksjoner og modellering (KM460, KM462)", stikkord: "lineær funksjon stigningstall konstantledd fastpris timepris skjæringspunkt nullpunkt regresjon", url: "okt-funksjoner-statistikk.html" },
    { tittel: "2.3 Eksponential-, potens- og andregradsmodeller + gyldighet", emne: "Kap. 2 · Funksjoner og modellering (KM460, KM461)", stikkord: "eksponentialfunksjon potensfunksjon andregrad vekstfart halveringsmetoden gyldighetsområde", url: "python-lab.html#mal-halvering" },
    { tittel: "3.1–3.2 Statistikk: Sentralmål og spredningsmål (Full Guttas Campus-økt)", emne: "Kap. 3 · Statistikk (KM455)", stikkord: "gjennomsnitt median typetall variasjonsbredde kvartilbredde standardavvik frekvens lønn", url: "okt-funksjoner-statistikk.html#statistikk-del" },
    { tittel: "3.3 Gruppert datamateriale og histogram", emne: "Kap. 3 · Statistikk (KM455)", stikkord: "gruppert klasser klassebredde histogram søylehøyde relativ frekvens", url: "oppgaveark.html?emne=statistikk" },
    { tittel: "4. Arbeid med datasett og kritisk lesing av tall i media", emne: "Kap. 4 · Datasett & samfunn (KM454, KM456, KM461)", stikkord: "datasett ssb media premisser kildekritikk regneark grafer manipulerte akser", url: "python-lab.html" },
    { tittel: "5. Algoritmer og programmering i Python (Pyodide-verksted)", emne: "Kap. 5 · Python i 2P-Y (KM457, KM460)", stikkord: "python variabler while for løkke liste if else kode halveringsmetoden pyodide", url: "python-lab.html" },
    { tittel: "6. Eksamenstrening og utskriftsklare A4-oppgaveark", emne: "Kap. 6 · Eksamen Del 1 & Del 2 + Oppgaveark", stikkord: "oppgaveark utskrift pdf fasit mengdetrening del 1 uten hjelpemidler eksamen", url: "oppgaveark.html" }
  ];

  const OPPVARMING_SETT = {
    prosent: [
      () => {
        const p = [10, 15, 20, 25, 30, 40][Math.floor(Math.random() * 6)];
        return { spm: `Vekstfaktor ved ${p} % økning?`, fasit: +(1 + p / 100).toFixed(2), hint: `1 + ${p}/100` };
      },
      () => {
        const p = [5, 12, 15, 20, 25, 35][Math.floor(Math.random() * 6)];
        return { spm: `Vekstfaktor ved ${p} % rabatt?`, fasit: +(1 - p / 100).toFixed(2), hint: `1 − ${p}/100` };
      },
      () => {
        const belop = [400, 600, 800, 1200, 1500][Math.floor(Math.random() * 5)];
        const pst = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
        return { spm: `Hva er ${pst} % av ${belop} kr?`, fasit: (belop * pst) / 100, hint: `Finn 10 % eller del på ${100 / pst}` };
      },
      () => {
        const r1 = [2, 3, 4][Math.floor(Math.random() * 3)];
        const hopp = [1.5, 2, 2.5][Math.floor(Math.random() * 3)];
        return { spm: `Rente fra ${r1} % til ${String(r1 + hopp).replace(".", ",")} %: hvor mange prosentpoeng?`, fasit: hopp, hint: `Trekk gammel prosent fra ny prosent` };
      },
      () => {
        const vf = [1.08, 1.12, 1.18, 1.25][Math.floor(Math.random() * 4)];
        const pst = Math.round((vf - 1) * 100);
        return { spm: `Vekstfaktor ${String(vf).replace(".", ",")} betyr hvor mange % økning?`, fasit: pst, hint: `(vekstfaktor − 1) · 100` };
      }
    ],
    funksjoner: [
      () => {
        const a = [650, 750, 850, 950][Math.floor(Math.random() * 4)];
        const b = [500, 900, 1200][Math.floor(Math.random() * 3)];
        return { spm: `I K(x) = ${a}x + ${b}: hva er stigningstallet a?`, fasit: a, hint: `Tallet foran x` };
      },
      () => {
        const a = [400, 500, 600][Math.floor(Math.random() * 3)];
        const b = [300, 800, 1000][Math.floor(Math.random() * 3)];
        return { spm: `Hvis f(x) = ${a}x + ${b}, hva er f(2)?`, fasit: a * 2 + b, hint: `Regn ut ${a} · 2 + ${b}` };
      },
      () => {
        const base = [12, 15, 18, 20][Math.floor(Math.random() * 4)];
        const liste = [base - 3, base - 1, base, base + 4, base + 9];
        return { spm: `Finn medianen i: ${liste.join(", ")}`, fasit: base, hint: `Det midterste tallet når tallene er sortert` };
      },
      () => {
        const min = [14, 18, 22][Math.floor(Math.random() * 3)];
        const bredde = [15, 19, 24, 30][Math.floor(Math.random() * 4)];
        return { spm: `Laveste verdi ${min}, høyeste ${min + bredde}. Variasjonsbredde?`, fasit: bredde, hint: `Største verdi minus minste verdi` };
      },
      () => {
        const t1 = [10, 20, 30][Math.floor(Math.random() * 3)];
        const snitt = t1 + 10;
        const t3 = snitt + 10;
        return { spm: `Gjennomsnitt av ${t1}, ${snitt} og ${t3}?`, fasit: snitt, hint: `Summen delt på 3` };
      }
    ]
  };

  window.GC2PY_DATA = {
    KARAKTERSTYRKER,
    MAALTRAPPA,
    SOK_INDEKS,
    OPPVARMING_SETT
  };
})();
