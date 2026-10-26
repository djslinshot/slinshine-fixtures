# SLINSHINE Fixtures

Die eigene Geräte-Library (Fixtures) für die SLINSHINE-Lichtsoftware. Jedes Gerät liegt als eigene JSON-Datei hier, damit Änderungen an Kanalbelegungen versioniert sind und nichts verloren geht.

## Inhalt

| Ordner | Was drin ist |
|---|---|
| `fixtures/` | Ein Gerät pro Datei, genau wie im SLINSHINE-Ordner `fixtures/`. Allgemeine Startpunkte heißen `generisch-…` |
| `index.json` | Liste aller Geräte, die SLINSHINE beim Suchen lädt (wird erzeugt) |
| `kanaltypen.json` | Alle Kanaltypen, die SLINSHINE kennt (z. B. `red`, `pan`, `strobe`) |
| `scripts/pruefen.js` | Prüft alle Dateien auf Fehler |

Aktuell an echten Geräten:

- **Slinshot 19x15 MH** (Moving Head, 25 oder 17 Kanäle)
- **U'King 19x15W Moving Head Zoom** (16 Kanäle)
- **Both Lighting 360 Tube** (5/6/7/12/40/80/160 Kanäle)
- **Eurolite LED B-40 HCL Beam Effect MK2** (3/12/23 Kanäle)
- **Eurolite LED BAR-6 QCL RGB+UV** (2/4/5/6/9 Kanäle)
- **Fun Generation LED BARbara 16** (2/3/5/24 Kanäle)
- **Varytec Giga Bar Pix 8 RGB** (2/24 Kanäle)
- **ADJ Mega TRIPAR Profile Plus** (4/5/6/9/10 Kanäle)
- **Stairville AFH-600 Hazer** (1 Kanal)

## Aufbau einer Datei

```json
{
  "format": "slinshine-fixture-1",
  "manufacturer": "Slinshot",
  "model": "19x15 MH",
  "name": "19x15 MH Slinshot",
  "kind": "movinghead",
  "note": "19x15 MH Slinshot (Moving Head, 25 oder 17 Kanäle)",
  "modes": [
    {
      "name": "17 Kanäle (alle Ringe gemeinsam)",
      "channels": [
        { "name": "Pan", "type": "pan", "default": 128 },
        { "name": "Reset (250-255 für 3 s)", "type": "reset", "default": 0, "info": "250-255 für 3 Sekunden halten = Reset" }
      ]
    }
  ]
}
```

- `format`: immer `slinshine-fixture-1`
- `manufacturer`, `model`: Hersteller und Modell, so steht das Gerät in der Auswahlliste (bis 60 bzw. 80 Zeichen)
- `name`: Standardname, wenn man das Gerät anlegt (bis 60 Zeichen)
- `note`: optionaler Hinweis (bis 200 Zeichen)
- `kind`: `movinghead`, `tube`, `bar`, `generic` (Scheinwerfer, PAR usw.) oder `auto` (SLINSHINE erkennt es an den Kanälen)
- `modes`: ein Eintrag pro Kanal-Modus, der am Gerät einstellbar ist. Die Reihenfolge der Kanäle ist die DMX-Reihenfolge ab der Startadresse.
- `default`: Wert (0–255), den der Kanal beim Start hat
- `info`: optional, z. B. welche Werte was bewirken (bis 400 Zeichen). Kanalnamen selbst kürzt SLINSHINE auf 40 Zeichen.

## Neues Gerät hinzufügen

1. Eine vorhandene Datei in `fixtures/` kopieren und als `<hersteller>-<modell>.json` benennen.
2. Kanäle laut Anleitung eintragen. Als `type` nur Werte aus `kanaltypen.json` nehmen; unbekannte Kanäle als `other`.
3. Liste neu erzeugen: `node scripts/index.js`
4. Prüfen: `node scripts/pruefen.js` (läuft auch automatisch bei jedem Push auf GitHub).

## In SLINSHINE

Im Tab **Geräte** gibt es neben der Online-Library die **SLINSHINE-Library**. Sie lädt die Geräteliste nur, wenn du dort suchst, nie im Hintergrund. Beim Hinzufügen wird das eine Gerät mit allen Modi gespeichert und funktioniert danach auch offline.

Eine Datei aus diesem Repo kann man auch direkt in den SLINSHINE-Ordner `fixtures/` legen oder über **Gerät aus Datei importieren …** im Tab Geräte hinzufügen. Sie erscheint, sobald man den Tab Geräte öffnet.
