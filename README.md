# SLINSHINE Fixtures

Die eigene Geräte-Library (Fixtures) für die SLINSHINE-Lichtsoftware. Jedes Gerät liegt als eigene JSON-Datei hier, damit Änderungen an Kanalbelegungen versioniert sind und nichts verloren geht.

## Inhalt

| Ordner | Was drin ist |
|---|---|
| `geraete/` | Echte Geräte mit Kanalbelegung laut Anleitung, sortiert nach Hersteller |
| `vorlagen/` | Allgemeine Startpunkte (PAR, Tube, Moving Head), die man an ein Gerät anpasst |
| `index.json` | Liste aller Geräte, die SLINSHINE beim Suchen lädt (wird erzeugt) |
| `kanaltypen.json` | Alle Kanaltypen, die SLINSHINE kennt (z. B. `red`, `pan`, `strobe`) |
| `scripts/pruefen.js` | Prüft alle Dateien auf Fehler |

Aktuell in `geraete/`:

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
  "label": "19x15 MH Slinshot (Moving Head, 25 oder 17 Kanäle)",
  "name": "19x15 MH Slinshot",
  "manufacturer": "Slinshot",
  "kind": "movinghead",
  "source": "Woher die Kanalbelegung stammt",
  "modes": [
    {
      "name": "17 Kanäle (alle Ringe gemeinsam)",
      "channels": [
        { "name": "Pan", "type": "pan", "default": 128 },
        { "name": "Dimmer", "type": "dimmer", "default": 255 }
      ]
    }
  ]
}
```

- `label`: so steht das Gerät in der Auswahlliste
- `name`: Standardname, wenn man das Gerät anlegt
- `kind`: `movinghead`, `tube`, `bar`, `generic` (Scheinwerfer, PAR usw.) oder `auto` (SLINSHINE erkennt es an den Kanälen)
- `modes`: ein Eintrag pro Kanal-Modus, der am Gerät einstellbar ist. Die Reihenfolge der Kanäle ist die DMX-Reihenfolge ab der Startadresse.
- `default`: Wert (0–255), den der Kanal beim Start hat

## Neues Gerät hinzufügen

1. Eine vorhandene Datei kopieren, z. B. nach `geraete/<hersteller>/<geraet>.json`.
2. Kanäle laut Anleitung eintragen. Als `type` nur Werte aus `kanaltypen.json` nehmen; unbekannte Kanäle als `other`.
3. Liste neu erzeugen: `node scripts/index.js`
4. Prüfen: `node scripts/pruefen.js` (läuft auch automatisch bei jedem Push auf GitHub).

## In SLINSHINE

Im Tab **Geräte** gibt es neben der Online-Library die **SLINSHINE-Library**. Sie lädt die Geräteliste nur, wenn du dort suchst, nie im Hintergrund. Beim Hinzufügen wird das eine Gerät mit allen Modi gespeichert und funktioniert danach auch offline.
