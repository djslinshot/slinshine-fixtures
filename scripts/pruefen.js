// Prüft alle Fixture-Dateien (Format slinshine-fixture-1, wie im SLINSHINE-Ordner fixtures/).
// Aufruf: node scripts/pruefen.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const types = JSON.parse(fs.readFileSync(path.join(root, 'kanaltypen.json'), 'utf8'));
const kinds = ['auto', 'generic', 'bar', 'movinghead', 'tube'];

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith('.json') ? [p] : [];
  });
}

let errors = 0;
const fail = (file, msg) => { errors++; console.error(`✗ ${path.relative(root, file)}: ${msg}`); };

for (const file of files(path.join(root, 'fixtures'))) {
  let fx;
  try { fx = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (err) { fail(file, 'kein gültiges JSON (' + err.message + ')'); continue; }
  if (fx.format !== 'slinshine-fixture-1') fail(file, '"format" muss "slinshine-fixture-1" sein');
  if (!fx.manufacturer) fail(file, '"manufacturer" fehlt');
  if (!fx.model || fx.model.length > 80) fail(file, '"model" fehlt oder ist länger als 80 Zeichen');
  if (!fx.name || fx.name.length > 60) fail(file, '"name" fehlt oder ist länger als 60 Zeichen');
  if (fx.note && fx.note.length > 200) fail(file, '"note" ist länger als 200 Zeichen');
  if (!kinds.includes(fx.kind)) fail(file, `"kind" muss eins von ${kinds.join(', ')} sein`);
  if (!Array.isArray(fx.modes) || !fx.modes.length) { fail(file, '"modes" fehlt oder ist leer'); continue; }
  for (const m of fx.modes) {
    if (!m.name) fail(file, 'ein Modus hat keinen Namen');
    if (!Array.isArray(m.channels) || !m.channels.length) { fail(file, `Modus "${m.name}" hat keine Kanäle`); continue; }
    m.channels.forEach((c, i) => {
      const where = `Modus "${m.name}", Kanal ${i + 1}`;
      if (!c.name) fail(file, `${where}: Name fehlt`);
      if (c.info && c.info.length > 400) fail(file, `${where}: "info" ist länger als 400 Zeichen`);
      if (!(c.type in types)) fail(file, `${where}: unbekannter Typ "${c.type}"`);
      if (!Number.isInteger(c.default) || c.default < 0 || c.default > 255) fail(file, `${where}: "default" muss 0–255 sein`);
    });
  }
  if (!errors) console.log(`✓ ${path.relative(root, file)}`);
}

if (errors) { console.error(`\n${errors} Fehler gefunden.`); process.exit(1); }
console.log('\nAlles in Ordnung.');
