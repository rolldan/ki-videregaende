# Oppgaveark: Micro:bit i naturfag (påbygg)

**Fag:** Naturfag · **Varighet:** 90 min · **Gruppe:** 2–3 elever  
**Verktøy:** [Microsoft MakeCode](https://makecode.microbit.org) (blokk) og/eller [Python Editor](https://python.microbit.org)

**Navn:** ________________________ **Gruppe nr.:** ______ **Radiogruppe:** ______

---

## Dette skal du ha

- Minst 2 micro:bitter
- USB-kabel eller batteripakke til hver
- PC med nettleser

---

## Slik laster du ned program til micro:bit

1. Åpne [makecode.microbit.org](https://makecode.microbit.org)
2. Velg **Nytt prosjekt**
3. Bygg programmet med blokker (eller bytt til Python øverst)
4. Trykk **Last ned**
5. Dra `.hex`-fila over til micro:bit-stasjonen på PC-en
6. Test på den fysiske micro:biten (radio må testes på ekte enheter, ikke bare i simulator)

---

# Oppgave 1 – Bli kjent med MakeCode (ca. 15 min)

### Oppgavetekst
Bli kjent med Microsoft MakeCode. Finn fram i editoren, test simulatoren og last ned et program til micro:bit.

### Instruks
1. Gå til MakeCode og lag et nytt prosjekt. Kall det f.eks. `Oppgave1`.
2. Finn menyene **Grunnleggende**, **Inndata** og **Radio**.
3. Se på **simulatoren** i midten – den viser hva programmet gjør.
4. Last ned et enkelt program til micro:biten.

### Kryss av
- [ ] Jeg har åpnet et nytt prosjekt
- [ ] Jeg har testet noe i simulatoren
- [ ] Jeg har lastet ned program til micro:bit

---

# Oppgave 2 – Tekst og symbol (ca. 15 min)

### Oppgavetekst
Få micro:bit til å vise en **tekst** og deretter et **symbol** når den starter.

### Instruks
1. Bruk blokken `ved start`.
2. Legg inn `vis streng` med en tekst du velger (f.eks. navnet ditt).
3. Legg inn en kort `pause`.
4. Legg inn `vis ikon` (f.eks. hjerte) – eller tegn eget symbol med `vis lysdioder`.
5. Last ned og test.

### Kode – blokk

```
ved start
    → vis streng "Hei"
    → pause (ms) 1000
    → vis ikon (hjerte)
```

### Kode – Python

```python
from microbit import *

display.scroll("Hei")
sleep(1000)
display.show(Image.HEART)
```

### Naturfag
LED-skjermen gjør elektrisk energi om til **lysenergi**.

---

# Oppgave 3 – Utforsk knapp A og B (ca. 15 min)

### Oppgavetekst
Programmer knappene slik at A og B gjør ulike ting.

| Handling | Skal skje |
|----------|-----------|
| Trykk **A** | Vis tekst «A» (eller et tall) |
| Trykk **B** | Vis et symbol (f.eks. smilefjes) |
| Trykk **A+B** (valgfritt) | Tøm skjermen |

### Instruks
1. Finn blokkene under **Inndata**: `når knapp A trykkes` og `når knapp B trykkes`.
2. Koble tekst til A og ikon til B.
3. (Valgfritt) Legg til `når knapper A+B trykkes` → `tøm skjerm`.
4. Last ned og test på micro:biten.

### Kode – blokk

```
når knapp A trykkes
    → vis streng "A"

når knapp B trykkes
    → vis ikon (glad)

når knapper A+B trykkes
    → tøm skjerm
```

### Kode – Python

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

### Ekstra (valgfritt)
- Få A til å øke et tall hver gang du trykker.
- Prøv forskjellen mellom «når knapp A trykkes» og «når knappen A er trykket».

---

# Oppgave 4 – Giver og mottaker: send beskjed (ca. 25 min)

### Oppgavetekst
Lag to roller: **giver** (sender) og **mottaker**. Send en beskjed mellom to micro:bitter. Deretter skal dere kunne sende meldinger begge veier.

**Viktig:** Begge micro:bitene må ha **samme radiogruppe** (skriv gruppenummeret øverst på arket).

### Instruks – del A (én vei)
1. Avtal radiogruppe i gruppa (f.eks. 3, 7 eller gruppenummeret deres).
2. Last **giver**-programmet på micro:bit 1.
3. Last **mottaker**-programmet på micro:bit 2.
4. Trykk A på giveren. Mottakeren skal vise «HEI».

### Kode – giver (blokk)

```
ved start
    → radio sett gruppe 3

når knapp A trykkes
    → radio send streng "HEI"
    → vis ikon (ja)
```

### Kode – mottaker (blokk)

```
ved start
    → radio sett gruppe 3

på radio mottatt streng
    → vis streng (mottatt streng)
```

### Kode – giver (Python)

```python
from microbit import *
import radio

radio.on()
radio.config(group=3)

while True:
    if button_a.was_pressed():
        radio.send("HEI")
        display.show(Image.YES)
        sleep(400)
        display.clear()
```

### Kode – mottaker (Python)

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

### Instruks – del B (begge veier)
1. Last **samme program** på begge micro:bitene (koden under).
2. A sender «HEI», B sender «OK».
3. Test at dere kan sende beskjed til hverandre.

### Kode – toveis (blokk, samme på begge)

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

### Kode – toveis (Python, samme på begge)

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

### Naturfag
Radioen bruker **elektromagnetiske bølger** (ca. 2,4 GHz) – samme type bølger som Wi‑Fi og Bluetooth.

---

# Oppgave 5 – Signalstyrke: hva påvirker? (ca. 20 min)

### Oppgavetekst
Undersøk hva som påvirker radio-signalet. Én micro:bit er **giver**, én er **mottaker**. Mottakeren viser **signalstyrke**. Endre én ting om gangen og noter resultatene.

**Slik leser du signalstyrke:** Tallene er ofte negative (f.eks. −42). **Nærmere null = sterkere signal** (−30 er sterkere enn −80).

### Instruks
1. Last giver- og mottaker-programmet under (bruk MakeCode-blokk for signalstyrke).
2. Sett sendeeffekt til 6 først.
3. Gjennomfør testene i tabellen. Endre bare **én ting** per test.
4. Svar på spørsmålene.

### Kode – giver (blokk)

```
ved start
    → radio sett gruppe 3
    → radio sett sendeeffekt 6

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

> Finn «radio signalstyrke» under **Radio → mer / avansert** i MakeCode.

### Kode – giver (Python)

```python
from microbit import *
import radio

radio.on()
radio.config(group=3, power=6)

while True:
    if button_a.was_pressed():
        radio.send("PING")
        display.show(Image.DIAMOND)
        sleep(300)
        display.clear()
```

### Resultattabell

| Test | Hva gjør dere? | Signalstyrke | Kom melding fram? (ja/nei) |
|------|----------------|--------------|----------------------------|
| 1 | 1 meter, fri sikt | | |
| 2 | 5 meter avstand | | |
| 3 | Bak vegg eller dør | | |
| 4 | Person står mellom | | |
| 5 | Lavere sendeeffekt (f.eks. 1) | | |
| 6 | Valgfritt: metall eller vann mellom | | |

### Spørsmål
1. Hva skjedde med signalstyrken når avstanden økte? Hvorfor?  
   _________________________________________________________________

2. Hvilket hinder reduserte signalet mest?  
   _________________________________________________________________

3. Nevn én likhet mellom radiobølger og **lys** eller **lyd**:  
   _________________________________________________________________

### Kort teori
- **Avstand:** Energien fordeles over større område → svakere signal.
- **Hindre:** Vegger, kropp og metall kan absorbere eller reflektere bølger.
- **Sendeeffekt:** Lavere effekt → mindre energi → kortere rekkevidde.

---

# Innlevering

Lever dette (per gruppe):

1. [ ] Kort bekreftelse / skjermbilde av giver- og mottaker-kode (oppgave 4 eller 5)
2. [ ] Ferdig resultattabell fra oppgave 5
3. [ ] Svar på de tre spørsmålene

### Refleksjon (individuelt)
Hva lærte du om usynlige bølger – og hvordan ligner det på noe annet fra naturfag?

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

---

## Hurtighjelp

| Problem | Løsning |
|---------|---------|
| Finner ikke MakeCode | [makecode.microbit.org](https://makecode.microbit.org) |
| Program lastes ikke | Prøv annen USB-kabel/port, last ned `.hex` på nytt |
| Radio virker ikke | Samme radiogruppe? Begge har «radio sett gruppe»? |
| Andre grupper forstyrrer | Bytt til et unikt gruppenummer (1–255) |
| Finner ikke signalstyrke | MakeCode → Radio → mer/avansert |
| Virker i simulator, ikke på radio | Radio må testes på **fysiske** micro:bitter |

---

*Naturfag påbygg · Micro:bit · Microsoft MakeCode · 90 min*
