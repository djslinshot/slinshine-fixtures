// Prüft alle Fixture-Dateien: gültiges JSON, Pflichtfelder, bekannte Kanaltypen, Werte 0–255.
// Aufruf: node scripts/pruefen.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const types = JSON.parse(fs.readFileSync(path.join(root, 'kanaltypen.json'), 'utf8'));
const kinds = ['generic', 'movinghead', 'tube'];

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith('.json') ? [p] : [];
  });
}

let errors = 0;
const fail = (file, msg) => { errors++; console.error(`✗ ${path.relative(root, file)}: ${msg}`); };

for (const file of ['geraete', 'vorlagen'].flatMap((d) => files(path.join(root, d)))) {
  let fx;
  try { fx = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (err) { fail(file, 'kein gültiges JSON (' + err.message + ')'); continue; }
  if (!fx.name) fail(file, '"name" fehlt');
  if (!fx.label) fail(file, '"label" fehlt');
  if (!kinds.includes(fx.kind)) fail(file, `"kind" muss eins von ${kinds.join(', ')} sein`);
  if (!Array.isArray(fx.modes) || !fx.modes.length) { fail(file, '"modes" fehlt oder ist leer'); continue; }
  for (const m of fx.modes) {
    if (!m.name) fail(file, 'ein Modus hat keinen Namen');
    if (!Array.isArray(m.channels) || !m.channels.length) { fail(file, `Modus "${m.name}" hat keine Kanäle`); continue; }
    m.channels.forEach((c, i) => {
      const where = `Modus "${m.name}", Kanal ${i + 1}`;
      if (!c.name) fail(file, `${where}: Name fehlt`);
      if (!(c.type in types)) fail(file, `${where}: unbekannter Typ "${c.type}"`);
      if (!Number.isInteger(c.default) || c.default < 0 || c.default > 255) fail(file, `${where}: "default" muss 0–255 sein`);
    });
  }
  if (!errors) console.log(`✓ ${path.relative(root, file)}`);
}

if (errors) { console.error(`\n${errors} Fehler gefunden.`); process.exit(1); }
console.log('\nAlles in Ordnung.');
