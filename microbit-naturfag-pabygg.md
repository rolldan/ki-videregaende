# Sensorer, signaler og undersøkelser

**Elevhefte · Micro:bit + naturfag (påbygg)**  
To økter à 90 minutter · MakeCode: blokker + Python · Pararbeid anbefales

Dere har allerede programmert trådløs kommunikasjon. Nå måler dere naturfaglige størrelser, sender data og gjennomfører en egen undersøkelse.

Åpne [makecode.microbit.org](https://makecode.microbit.org) – bytt mellom **Blokker** og **Python**.

---

## Hva skal du lære?

Koblet til naturfag vg3 påbygging (NAT01‑05):

- **vurdere og lage programmer** som modellerer naturfaglige fenomener
- **forklare hovedprinsippene for trådløs kommunikasjon** og gi eksempler på bruk
- **utforske og beskrive** elektromagnetisk stråling og sentrale bølgefenomener
- bruke naturvitenskapelig metode: hypotese, måling, feilkilder og konklusjon

## Utstyr per gruppe

- 2 micro:bit (helst V2) + batteripakker
- 2 USB-kabler og 1 PC/Chromebook
- Valgfritt: papir, tape, aluminiumsfolie, stoff, plastboks

---

# Økt 1 · Temperatur, isolasjon og trådløs sensor (90 min)

**Naturfaglig tema:** varme, energi og miljø.

| Tid | Aktivitet |
|-----|-----------|
| 0–10 min | Oppstart: repetisjon radio. Hvorfor er isolasjon viktig for energibruk og klima? |
| 10–30 min | Oppgave A: temperatursensor |
| 30–55 min | Oppgave B: trådløs temperaturstasjon |
| 55–85 min | Oppgave C: isolasjonsforsøk |
| 85–90 min | Oppsummering og lagring av kode |

## Oppgave A – Les temperatur

Micro:bit måler chip-temperatur (omtrent romtemperatur, men kan bli litt høyere når kortet blir varmt).

**Mål:** Vis temperatur hvert sekund. Trykk A for å «fryse» verdien.

### Blokker

1. Fra **Grunnleggende**: sett inn `vis tall`.
2. Fra **Inndata**: dra `temperatur (°C)` inn i `vis tall`.
3. Pakk inn i `gjenta for alltid` + `pause (ms) 1000`.
4. `ved knapp A trykket` → `vis tall (temperatur)` + `pause 2000`.

### Python

```python
from microbit import *

while True:
    temp = temperature()
    if button_a.was_pressed():
        display.show(str(temp))
        sleep(2000)
    else:
        display.scroll(str(temp))
        sleep(500)
```

**Sjekk:** Er målingen nær romtemperatur? Hvorfor kan verdien stige etter en stund?

---

## Oppgave B – Trådløs temperaturstasjon

Én micro:bit er **sensor**, den andre er **display**. Samme radiogruppe (f.eks. 7). Sensor sender temperatur hvert 2. sekund.

### Sensor – blokker

1. `ved start` → `radio sett gruppe 7`
2. `gjenta for alltid`: `radio send tall (temperatur)` → kort `vis ikon (ja)` → `pause 2000`

### Sensor – Python

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    t = temperature()
    radio.send(str(t))
    display.show(Image.YES)
    sleep(200)
    display.clear()
    sleep(1800)
```

### Mottaker – blokker

1. `ved start` → `radio sett gruppe 7`
2. `ved radio mottatt tall` → `vis tall (mottatt tall)`

### Mottaker – Python

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    melding = radio.receive()
    if melding:
        display.scroll(melding)
```

**Naturfagkobling:** Radio bruker elektromagnetiske bølger (2,4 GHz). Signalet dempes av avstand og materialer – det bruker dere i økt 2.

---

## Oppgave C – Isolasjonsforsøk

**Problemstilling:** Hvilket materiale holder best på varmen?

1. Lag en hypotese.
2. Bruk varme hender / varmt vann nær sensor-micro:bit.
3. Pakk sensoren i ulike materialer (folie, stoff, papir, ingen pakking).
4. Mål hvert 30. sekund i 3–4 minutter per materiale.
5. Diskuter feilkilder (starttemperatur, pakking, egenvarme fra chip, tid).

| Materiale | 0:00 | 0:30 | 1:00 | 2:00 | 3:00 | Endring |
|-----------|------|------|------|------|------|---------|
| Uten pakking | | | | | | |
| Papir | | | | | | |
| Stoff | | | | | | |
| Aluminiumsfolie | | | | | | |
| Eget valg: | | | | | | |

**Utfordring:** La A/B bytte «materialnummer» som sendes sammen med temperaturen.

---

# Økt 2 · Radiobølger, demping og egen undersøkelse (90 min)

**Naturfaglig tema:** bølger, elektromagnetisk stråling og trådløs teknologi.

| Tid | Aktivitet |
|-----|-----------|
| 0–15 min | Teori + Oppgave D (signalstyrke) |
| 15–35 min | Oppgave E (demping) |
| 35–75 min | Oppgave F (egen undersøkelse) |
| 75–90 min | Presentasjon (ca. 2 min per gruppe) |

## Kort teori

- **Radiobølger:** Micro:bit bruker 2,4 GHz (samme område som Wi‑Fi/Bluetooth). Lavenergi, **ikke ioniserende** stråling.
- **Demping:** Signalet svekkes med avstand og gjennom materialer (særlig metall og vann).

## Oppgave D – Signalstyrke (RSS)

Verdier er negative: **−40 er sterkere enn −80**.

### Sender – blokker

1. `ved start` → `radio sett gruppe 7`
2. `gjenta for alltid`: `radio send streng "ping"` + `pause 500`

### Sender – Python

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    radio.send("ping")
    display.show(".")
    sleep(500)
```

### Mottaker – blokker

1. `ved start` → `radio sett gruppe 7`
2. `ved radio mottatt pakke` → `vis tall (radio signalstyrke)`  
   (Radio → mer … i MakeCode)

### Mottaker – Python

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    detaljer = radio.receive_full()
    if detaljer:
        melding, signalstyrke, tidspunkt = detaljer
        display.scroll(str(signalstyrke))
```

## Oppgave E – Undersøk demping

Hold avstanden lik. Test minst: luft, kropp imellom, metall, og ett eget valg.

| Forhold | Avstand | Signalstyrke (ca.) | Melding mottatt? |
|---------|---------|--------------------|------------------|
| Luft | | | |
| Kropp imellom | | | |
| Metall | | | |
| Eget: | | | |

**Diskuter:** Hvorfor bør ikke Wi‑Fi-ruter stå i et metallskap? Er 2,4 GHz det samme som røntgen? (Nei – ulik energi.)

## Oppgave F – Egen undersøkelse (velg én)

1. **Klima i klasserommet** – temperatur og lys over tid  
2. **Isolasjon 2.0** – hvilken «vegg» holder best på varmen?  
3. **Radiodekning** – hvor langt når signalet i bygget?  
4. **Lys og skygge** – lyssensor ved vindu vs. inne i rommet  

### Ekstra: temperatur + lys i én melding (Python)

```python
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    data = "T:{} L:{}".format(temperature(), light_level())
    radio.send(data)
    display.scroll(data, delay=80)
    sleep(2000)
```

**Mottaker (blokker):** `ved radio mottatt streng` → `vis streng (mottatt streng)`.

---

# Kodebibliotek

## Lysnivå

```python
from microbit import *

while True:
    lys = light_level()
    display.scroll(str(lys))
    sleep(1000)
```

**Blokker:** `gjenta for alltid` → `vis tall (lysnivå)` → `pause 1000`.

## Alarm når det blir for varmt

```python
from microbit import *

GRENSE = 28  # juster selv

while True:
    t = temperature()
    if t >= GRENSE:
        display.show(Image.ANGRY)
        try:
            import music
            music.pitch(880, 200)
        except ImportError:
            pass
    else:
        display.show(Image.HAPPY)
    sleep(500)
```

## Enkel modell – «følt temperatur»

Diskuter: Er dette en god modell? Hva mangler?

```python
from microbit import *

while True:
    t = temperature()
    lys = light_level()
    folt = t - (255 - lys) / 50
    display.scroll("{:.1f}".format(folt))
    sleep(1500)
```

---

# Rapportmal (etter økt 2)

- [ ] Problemstilling  
- [ ] Hypotese med begrunnelse  
- [ ] Metode (utstyr, program, målinger)  
- [ ] Resultater (tabell/graf)  
- [ ] Feilkilder og forbedringer  
- [ ] Konklusjon med naturfagbegreper  
- [ ] Kode (Python eller skjermbilde av blokker)

## Veiledende vurderingskriterier

| Nivå | Programmering | Naturfag |
|------|---------------|----------|
| Lavt | Kjører ferdig kode med lite endring | Beskriver hva som skjedde |
| Middels | Tilpasser kode, bruker radio + sensor | Hypotese, data og enkel forklaring |
| Høyt | Egen løsning, robust og kommentert | Drøfter feilkilder, modeller og fagbegreper |

---

## Til læreren (kort)

- Gi gruppene ulike radiogrupper (1–10) for å unngå støy.
- Temperatursensoren måler chip-temperatur – snakk åpent om begrensninger.
- Signalstyrke (`receive_full`) fungerer i MicroPython/MakeCode med radio.
- Verktøy: [makecode.microbit.org](https://makecode.microbit.org)
