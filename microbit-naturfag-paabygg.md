# Micro:bit og naturfag – påbygg

**Elevhefte · 1 økt à 90 minutter**  
Dere programmerer i **Microsoft MakeCode** (blokk) og kan også se tilsvarende kode i **Python**.

---

## Læringsmål

Etter økten skal du kunne:

1. Finne fram i Microsoft MakeCode og laste ned program til micro:bit
2. Vise tekst og symboler på skjermen
3. Bruke knapp A og B til å styre programmet
4. Sende og motta meldinger med radio (giver og mottaker)
5. Undersøke hva som påvirker **signalstyrken** (naturfag: elektromagnetiske bølger)

---

## Utstyr (per gruppe, 2–3 elever)

| Utstyr | Antall |
|--------|--------|
| micro:bit (v1 eller v2) | minst 2 |
| USB-kabel / batteripakke | 1 per micro:bit |
| PC med nettleser | 1 |

**Verktøy:** [makecode.microbit.org](https://makecode.microbit.org) (blokk) · [python.microbit.org](https://python.microbit.org) (Python)

---

## Tidsplan (90 min)

| Tid | Hva | Min |
|-----|-----|-----|
| 0–15 | Del 1: Bli kjent med MakeCode | 15 |
| 15–30 | Del 2: Tekst og symbol | 15 |
| 30–45 | Del 3: Utforsk knapp A og B | 15 |
| 45–70 | Del 4: Giver og mottaker – send beskjed | 25 |
| 70–90 | Del 5: Signalstyrke – hva påvirker? | 20 |

---

## Del 1 – Bli kjent med Microsoft MakeCode (15 min)

### Slik kommer du i gang

1. Gå til [makecode.microbit.org](https://makecode.microbit.org)
2. Velg **Nytt prosjekt** og gi det et navn (f.eks. `Oekt1`)
3. Se på arbeidsområdet:
   - **Blokker** til venstre (Grunnleggende, Inndata, Radio, …)
   - **Simulator** i midten (virtuell micro:bit)
   - **Kodeflate** til høyre (der du bygger programmet)
4. Prøv noe i simulatoren først – deretter **Last ned** og dra `.hex`-fila over til micro:bit (som en USB-minnepinne)

### Sjekkliste

- [ ] Jeg har åpnet et nytt prosjekt
- [ ] Jeg ser simulatoren reagere når jeg tester
- [ ] Jeg har lastet ned minst ett program til den fysiske micro:biten

**Tips:** Bytt mellom **Blokker** og **Python** øverst i MakeCode for å se samme program på to måter.

---

## Del 2 – Lag en tekst og et symbol (15 min)

### Oppgave 2a – Vis en tekst

Få micro:bit til å vise en tekst når den starter, f.eks. navnet ditt eller «Hei».

#### Blokk

```
ved start
    → vis streng "Hei"
```

#### Python

```python
from microbit import *

display.scroll("Hei")
```

### Oppgave 2b – Lag et symbol

Vis et innebygd ikon (hjerte, smilefjes, …) eller tegn ditt eget mønster på 5×5-skjermen.

#### Blokk

```
ved start
    → vis streng "Hei"
    → pause (ms) 1000
    → vis ikon (hjerte)
```

**Eget symbol (blokk):** Bruk `vis lysdioder` og tenn de lampene du vil.

#### Python

```python
from microbit import *

display.scroll("Hei")
sleep(1000)
display.show(Image.HEART)

# Eller eget mønster (9 = full lysstyrke):
# mitt_symbol = Image("09090:99999:99999:09990:00900")
# display.show(mitt_symbol)
```

### Naturfag-kobling (kort)

LED-skjermen lyser fordi elektrisk energi blir til **lysenergi**. Hvert «punkt» er en liten diode.

---

## Del 3 – Utforsk knapp A og B (15 min)

### Oppgave

Programmer slik at:

| Handling | Resultat |
|----------|----------|
| Trykk **A** | Viser en tekst (f.eks. «A») eller et tall |
| Trykk **B** | Viser et symbol (f.eks. smilefjes) |
| Trykk **A+B** (valgfritt) | Nullstiller skjermen / viser noe tredje |

#### Blokk

```
når knapp A trykkes
    → vis streng "A"

når knapp B trykkes
    → vis ikon (glad)

når knapper A+B trykkes
    → tøm skjerm
```

#### Python

```python
from microbit import *

while True:
    if button_a.was_pressed():
        display.scroll("A")
    if button_b.was_pressed():
        display.show(Image.HAPPY)
    if button_a.is_pressed() and button_b.is_pressed():
        display.clear()
```

### Utforsk videre

- Kan du få A til å vise et tall som øker hver gang du trykker?
- Hva skjer om du bruker `når knappen A er trykket` (kontinuerlig) i stedet for `når knapp A trykkes` (én gang)?

---

## Del 4 – Giver og mottaker: send beskjed (25 min)

Nå lager dere to roller. En micro:bit er **giver** (sender), den andre er **mottaker**.

**Viktig:** Begge må bruke **samme radiogruppe** (f.eks. gruppenummeret deres: 1, 2, 3 …). Ellers snakker dere med feil gruppe.

### Oppgave 4a – Send en kort beskjed

- **Giver:** Trykk A for å sende teksten `HEI` (eller et tall).
- **Mottaker:** Vis det som mottas på skjermen.

#### Blokk – giver (sender)

```
ved start
    → radio sett gruppe 3          ← bytt til deres gruppenummer

når knapp A trykkes
    → radio send streng "HEI"
    → vis ikon (ja)
```

#### Blokk – mottaker

```
ved start
    → radio sett gruppe 3

på radio mottatt streng
    → vis streng (mottatt streng)
```

#### Python – giver

```python
from microbit import *
import radio

radio.on()
radio.config(group=3)  # bytt til deres gruppenummer

while True:
    if button_a.was_pressed():
        radio.send("HEI")
        display.show(Image.YES)
        sleep(400)
        display.clear()
```

#### Python – mottaker

```python
from microbit import *
import radio

radio.on()
radio.config(group=3)

while True:
    msg = radio.receive()
    if msg:
        display.scroll(msg)
```

### Oppgave 4b – Toveis prat

Bytt roller, eller programmer **begge** micro:bitene slik at:

- A sender «HEI»
- B sender «OK»

Da kan dere sende beskjed fram og tilbake.

#### Blokk (samme program på begge)

```
ved start
    → radio sett gruppe 3

når knapp A trykkes
    → radio send streng "HEI"

når knapp B trykkes
    → radio send streng "OK"

på radio mottatt streng
    → vis streng (mottatt streng)
```

#### Python (samme program på begge)

```python
from microbit import *
import radio

radio.on()
radio.config(group=3)

while True:
    if button_a.was_pressed():
        radio.send("HEI")
    if button_b.was_pressed():
        radio.send("OK")

    msg = radio.receive()
    if msg:
        display.scroll(msg)
```

### Naturfag-kobling

Radioen bruker **elektromagnetiske bølger** (2,4 GHz). Det er samme type bølger som Wi‑Fi og Bluetooth – usynlige, men de bærer informasjon.

---

## Del 5 – Signalstyrke: hva påvirker? (20 min)

Til slutt tester dere systematisk hva som påvirker hvor godt signalet kommer fram.

### Oppsett

1. Én **giver** og én **mottaker** (bruk programmene under).
2. Giver sender jevnlig (eller når du trykker A).
3. Mottaker viser **signalstyrke** (RSS / «received signal strength»).
4. Noter resultatene i tabellen.

### Kode – giver (blokk)

```
ved start
    → radio sett gruppe 3
    → radio sett sendeeffekt 6     ← maks er ofte 7 (prøv også lavere!)

når knapp A trykkes
    → radio send streng "PING"
    → vis ikon (diamant)
```

### Kode – mottaker (blokk)

```
ved start
    → radio sett gruppe 3

på radio mottatt streng
    → vis tall (radio signalstyrke)
```

> I MakeCode: blokken **«radio signalstyrke»** / **«received packet signal strength»** finnes under Radio (avansert). Tallene er typisk negative (f.eks. −42). **Nærmere null = sterkere signal** (−30 er sterkere enn −80).

### Kode – Python

**Giver:**

```python
from microbit import *
import radio

radio.on()
radio.config(group=3, power=6)  # power 0–7

while True:
    if button_a.was_pressed():
        radio.send("PING")
        display.show(Image.DIAMOND)
        sleep(300)
        display.clear()
```

**Mottaker:**

```python
from microbit import *
import radio

radio.on()
radio.config(group=3)

while True:
    msg = radio.receive()
    if msg:
        # signalstyrke for siste mottatte pakke
        styrke = radio.receive_full()
        # Alternativ i noen firmware: bruk MakeCode for RSSI
        display.scroll(msg)
```

> **Merk:** Signalstyrke (RSSI) er enklest å lese i **MakeCode-blokker**. Bruk blokk-mottakeren over til forsøket hvis Python-versjonen mangler RSSI i editoren deres.

### Forsøk – fyll inn

Hold giveren i ro. Endre **én ting om gangen**.

| Test | Hva gjør dere? | Signalstyrke | Kom melding fram? (ja/nei) |
|------|----------------|--------------|----------------------------|
| 1 | 1 meter fra hverandre, fri sikt | | |
| 2 | 5 meter fra hverandre | | |
| 3 | Bak en vegg / dør | | |
| 4 | Med kroppen mellom (person står imellom) | | |
| 5 | Lavere sendeeffekt (f.eks. 1 i stedet for 6) | | |
| 6 | (valgfritt) Metallskap / vannflaske mellom | | |

### Spørsmål til naturfag

1. Hva skjedde med signalstyrken når avstanden økte? Hvorfor?
2. Hvilket hinder reduserte signalet mest?
3. Elektromagnetiske bølger dempes av materialer og avstand. Nevn én likhet med **lys** eller **lyd**.

### Kort forklaring (til diskusjon)

- **Avstand:** Energien fordeles over større område → svakere signal.
- **Hindre:** Vegger, kropp og metall kan **absorbere** eller **reflektere** bølger.
- **Sendeeffekt:** Lavere effekt = mindre energi i bølgen = kortere rekkevidde.

---

## Innlevering (siste 5 min av del 5)

Per gruppe:

1. Skjermbilde eller kort beskrivelse av **giver**- og **mottaker**-programmet  
2. Ferdig tabell fra signalstyrke-forsøket  
3. Svar på de tre naturfagspørsmålene  

### Refleksjon (individuelt, 2–3 setninger)

> Hva lærte du om hvordan usynlige bølger oppfører seg – og hvordan ligner det på noe annet dere har hatt i naturfag?

---

## Hurtighjelp

| Problem | Løsning |
|---------|---------|
| Finner ikke MakeCode | [makecode.microbit.org](https://makecode.microbit.org) |
| Program lastes ikke | USB-kabel, last ned `.hex` på nytt, annen port |
| Radio virker ikke | Samme gruppenummer? Begge har «radio sett gruppe»? |
| Mange grupper forstyrrer | Bruk unikt gruppenummer (1–255) |
| Ser ikke signalstyrke | MakeCode → Radio → avansert → «signalstyrke» |
| Simulator vs. ekte | Radio og signalstyrke må testes på **fysiske** micro:bitter |

---

*Materiell til naturfag påbygg · Micro:bit · Microsoft MakeCode · 90 minutter*
