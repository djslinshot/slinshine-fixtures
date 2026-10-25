# SLINSHINE Fixtures

Die eigene Geräte-Library (Fixtures) für die SLINSHINE-Lichtsoftware. Jedes Gerät liegt als eigene JSON-Datei hier, damit Änderungen an Kanalbelegungen versioniert sind und nichts verloren geht.

## Inhalt

| Ordner | Was drin ist |
|---|---|
| `geraete/` | Echte Geräte mit Kanalbelegung laut Anleitung, sortiert nach Hersteller |
| `vorlagen/` | Allgemeine Startpunkte (PAR, Tube, Moving Head), die man an ein Gerät anpasst |
| `kanaltypen.json` | Alle Kanaltypen, die SLINSHINE kennt (z. B. `red`, `pan`, `strobe`) |
| `scripts/pruefen.js` | Prüft alle Dateien auf Fehler |

Aktuell in `geraete/`:

- **Slinshot 19x15 MH** (Moving Head, 25 oder 17 Kanäle)
- **U'King 19x15W Moving Head Zoom** (16 Kanäle)
- **Both Lighting 360 Tube** (5/6/7/12/40/80/160 Kanäle)

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
- `kind`: `movinghead`, `tube` oder `generic` (Scheinwerfer, PAR usw.)
- `modes`: ein Eintrag pro Kanal-Modus, der am Gerät einstellbar ist. Die Reihenfolge der Kanäle ist die DMX-Reihenfolge ab der Startadresse.
- `default`: Wert (0–255), den der Kanal beim Start hat

## Neues Gerät hinzufügen

1. Eine vorhandene Datei kopieren, z. B. nach `geraete/<hersteller>/<geraet>.json`.
2. Kanäle laut Anleitung eintragen. Als `type` nur Werte aus `kanaltypen.json` nehmen; unbekannte Kanäle als `other`.
3. Prüfen: `node scripts/pruefen.js` (läuft auch automatisch bei jedem Push auf GitHub).

Die Dateien haben genau das Format der Vorlagen in SLINSHINE (`public/templates.js`), nur als JSON.
