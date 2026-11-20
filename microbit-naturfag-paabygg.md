# Micro:bit og naturfag – påbygg

**Elevhefte · 1 økt à 90 minutter**  
Dere har allerede programmert trådløs kommunikasjon. I denne økten bruker dere **sensorer** til å samle data og forklare dem med naturfag.

---

## Læringsmål

Etter økten skal du kunne:

1. Bruke micro:bitens sensorer til å måle temperatur, lys og bevegelse
2. Programmere i **blokk** eller **Python** (MicroPython)
3. Koble målingene til naturfagbegreper (energi, klima, kraft/bevegelse)
4. Bruke radio (det dere kan fra før) til å sende måledata mellom micro:bitter

---

## Utstyr (per gruppe, 2–3 elever)

| Utstyr | Antall |
|--------|--------|
| micro:bit (v1 eller v2) | minst 2 |
| USB-kabel / batteripakke | 1 per micro:bit |
| PC med [MakeCode](https://makecode.microbit.org) eller [Python Editor](https://python.microbit.org) | 1 |
| Notatark / denne fila | 1 |

**Tips:** Velg enten blokk *eller* Python for oppgavene. Begge variantene ligger under hver aktivitet.

---

## Tidsplan (90 min)

| Tid | Hva | Min |
|-----|-----|-----|
| 0–10 | Oppstart: sensorer + naturfag | 10 |
| 10–35 | Aktivitet A: Temperatur og mikroklima | 25 |
| 35–60 | Aktivitet B: Lys og energi | 25 |
| 60–80 | Aktivitet C: Bevegelsesalarm med radio | 20 |
| 80–90 | Oppsummering og innlevering | 10 |

---

## Oppstart (10 min)

Micro:bit har innebygde sensorer. I naturfag bruker vi dem som **måleinstrumenter**.

| Sensor | Hva måles? | Naturfagkobling |
|--------|------------|-----------------|
| Temperatur | °C (omtrentlig) | Energi, varme, klima |
| Lys | 0–255 (relativ) | Stråling, energi, fotosyntese |
| Akselerometer | Bevegelse/helling | Kraft, bevegelse, tyngde |
| Radio | Trådløs sending | Dere kan dette fra før |

**Diskuter i gruppa (2 min):** Hvorfor er det smart å måle med sensorer i stedet for bare «å føle» at det er varmt eller lyst?

---

## Aktivitet A – Temperatur og mikroklima (25 min)

### Naturfag

Temperatur er et mål på den gjennomsnittlige kinetiske energien til partikler. Ute og inne, i sol og skygge, blir det ulike **mikroklima**. Små forskjeller (1–3 °C) kan bety mye for planter, dyr og energibruk i bygg.

### Oppgave

1. Programmer micro:bit til å vise temperatur når du trykker **A**.
2. Mål på **tre steder** (f.eks. ved vindu, midt i rommet, under bord/i skygge).
3. Noter resultatene i tabellen under.
4. **Utfordring:** Vis et ansikt som er glad hvis temperaturen er mellom 18 og 22 °C, ellers et trist ansikt (komfortsone).

### Resultattabell

| Sted | Temperatur (°C) | Forklaring (hvorfor?) |
|------|-----------------|------------------------|
| 1. | | |
| 2. | | |
| 3. | | |

### Kode – blokk (MakeCode)

```
ved start
    → (ingenting nødvendig)

når knapp A trykkes
    → vis tall (temperatur (°C))
```

**Utfordring (blokk):**

```
når knapp A trykkes
    → sett temp til temperatur (°C)
    → vis tall (temp)
    → hvis temp ≥ 18 og temp ≤ 22 da
          vis ikon (glad)
       ellers
          vis ikon (trist)
```

### Kode – Python (MicroPython)

```python
from microbit import *

while True:
    if button_a.was_pressed():
        temp = temperature()
        display.scroll(str(temp))

        # Utfordring: komfortsone 18–22 °C
        if 18 <= temp <= 22:
            display.show(Image.HAPPY)
        else:
            display.show(Image.SAD)
```

### Spørsmål til naturfag

1. Hvilket sted var varmest, og hvorfor?
2. Er micro:bit-temperaturen nøyaktig nok til vitenskapelige forsøk? Hva kan påvirke målingen?

---

## Aktivitet B – Lys og energi (25 min)

### Naturfag

Lys er elektromagnetisk stråling. Planter bruker synlig lys til fotosyntese. Lysstyrken påvirker også hvor mye energi vi bruker til belysning. Micro:bit måler ikke lux direkte, men en **relativ lysverdi** (0–255) som er nyttig til å sammenligne.

### Oppgave

1. Programmer micro:bit til å vise lysnivå kontinuerlig (eller når du trykker **B**).
2. Mål lys ved **vindu**, **midt i rommet** og **under bord**.
3. Lag en enkel «energi-indikator»:
   - lavt lys → prikk / «L»
   - middels → kvadrat / «M»
   - sterkt → fylt skjerm / «H»
4. **Utfordring:** Send lysverdien med **radio** til en annen micro:bit i gruppa (bruk det dere kan fra før).

### Resultattabell

| Sted | Lysverdi (0–255) | Energi-nivå (L/M/H) |
|------|------------------|---------------------|
| Vindu | | |
| Midt i rommet | | |
| Under bord | | |

### Kode – blokk (MakeCode)

```
ved start
    → radio sett gruppe 7          ← samme gruppe i hele klassen/gruppa

når knapp B trykkes
    → sett lys til lysnivå
    → vis tall (lys)
    → hvis lys < 50 da
          vis streng "L"
       ellers hvis lys < 150 da
          vis streng "M"
       ellers
          vis streng "H"
    → radio send tall (lys)        ← utfordring
```

**Mottaker (blokk):**

```
ved start
    → radio sett gruppe 7

på radio mottatt tall
    → vis tall (mottatt tall)
```

### Kode – Python (MicroPython)

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    if button_b.was_pressed():
        lys = display.read_light_level()
        display.scroll(str(lys))

        if lys < 50:
            display.show("L")
        elif lys < 150:
            display.show("M")
        else:
            display.show("H")

        # Utfordring: send til partner
        radio.send(str(lys))

    # Mottaker: vis tall som kommer inn
    mottatt = radio.receive()
    if mottatt:
        display.scroll(mottatt)
```

### Spørsmål til naturfag

1. Hvorfor er det lyst ved vinduet, men mørkere lenger inn?
2. Hvordan henger lys og **energi** sammen i et klasserom (vindu vs. elektrisk lys)?

---

## Aktivitet C – Bevegelsesalarm med radio (20 min)

### Naturfag

Akselerometeret registrerer endring i fart (akselerasjon). Når micro:bit ristes eller tippes, endres akselerasjonen. I naturfag kobler vi dette til **kraft og bevegelse** (Newtons lover): en kraft gir akselerasjon.

### Oppgave – «Vibrasjons-/bevegelsesalarm»

Dere lager et enkelt overvåkingssystem:

- **Micro:bit 1 (sensor):** Oppdager rist/bevegelse og sender radio-melding.
- **Micro:bit 2 (mottaker):** Viser alarm når melding mottas.

Bruk samme radiogruppe som i aktivitet B (eller avtale en ny).

### Kode – blokk (MakeCode)

**Sensor (sender):**

```
ved start
    → radio sett gruppe 7

når ristet
    → radio send streng "ALARM"
    → vis ikon (kryss)
```

**Mottaker:**

```
ved start
    → radio sett gruppe 7

på radio mottatt streng
    → hvis mottatt streng = "ALARM" da
          vis ikon (ja)
          spill melodi (ba ding)     ← v2 / hvis tilgjengelig
```

### Kode – Python (MicroPython)

**Sensor (sender):**

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    # gesture "shake" eller stor akselerasjon
    if accelerometer.was_gesture("shake"):
        radio.send("ALARM")
        display.show(Image.NO)
        sleep(500)
        display.clear()
```

**Mottaker:**

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    msg = radio.receive()
    if msg == "ALARM":
        display.show(Image.YES)
        # micro:bit v2 har høyttaler:
        try:
            import music
            music.play(music.BA_DING)
        except ImportError:
            pass
        sleep(1000)
        display.clear()
```

### Alternativ (hvis dere vil bruke tall)

Send akselerasjonsverdien i stedet for tekst:

```python
# Sender
styrke = accelerometer.get_x()  # eller get_z()
radio.send(str(abs(styrke)))

# Mottaker
msg = radio.receive()
if msg and int(msg) > 500:
    display.show(Image.ANGRY)
```

### Spørsmål til naturfag

1. Hva må til for at akselerometeret skal «reagere»? (Hint: endring i fart/retning)
2. Nevn én reell situasjon der bevegelsessensor + trådløs varsling er nyttig (f.eks. sikkerhet, miljø, helse).

---

## Oppsummering og innlevering (10 min)

### Lever dette (én fil / ett notat per gruppe)

1. Ferdig utfylte tabeller fra A og B  
2. Kort svar på spørsmålene under hver aktivitet  
3. Skjermbilde eller kopi av koden (blokk *eller* Python) til **én** av aktivitetene  
4. Svar på refleksjonen under  

### Refleksjon (individuelt, 3–5 setninger)

> Hvordan kan sensorer og programmering hjelpe oss å forstå naturfag bedre enn bare å lese i læreboka? Bruk minst ett eksempel fra dagens økt (temperatur, lys eller bevegelse).

---

## Hurtighjelp

| Problem | Løsning |
|---------|---------|
| Koden lastes ikke ned | Sjekk USB-kabel, last ned `.hex` på nytt, prøv annen port |
| Radio virker ikke | Samme `group`-nummer? Begge har `radio.on()` / «radio sett gruppe»? |
| Temperatur virker «feil» | Sensoren sitter i chipen – fingre/USB-varme påvirker. Vent litt. |
| Lys er alltid lav | Ikke dekk LED-skjermen; lyssensoren bruker LED-ene |
| Python: `ImportError: radio` | Last firmware/MicroPython for micro:bit, eller bruk MakeCode Python |

### Verktøy

- Blokk / JavaScript: [makecode.microbit.org](https://makecode.microbit.org)
- Python: [python.microbit.org](https://python.microbit.org)

---

## Fasitidéer til læreren (valgfritt å dele)

- **Komfortsone 18–22 °C** er et pedagogisk valg, ikke en absolutt sannhet – fint å diskutere.
- Lysverdier er relative; sammenlign *innenfor samme* micro:bit og rom.
- Radio-gruppen bør være unik per gruppe hvis mange jobber samtidig (f.eks. gruppenummer).

---

*Materiell til naturfag påbygg · Micro:bit · 90 minutter*
