// Erzeugt index.json: eine kleine Liste aller Geräte, damit SLINSHINE beim Suchen nur eine Datei laden muss.
// Aufruf: node scripts/index.js (nach jeder Änderung in fixtures/)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith('.json') ? [p] : [];
  });
}

const fixtures = files(path.join(root, 'fixtures')).sort().map((file) => {
  const fx = JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    path: path.relative(root, file).split(path.sep).join('/'),
    model: fx.model,
    name: fx.name,
    manufacturer: fx.manufacturer || '',
    kind: fx.kind,
    modes: fx.modes.map((m) => `${m.name}`),
  };
});

const out = JSON.stringify({ version: 1, fixtures }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const current = fs.existsSync(path.join(root, 'index.json')) ? fs.readFileSync(path.join(root, 'index.json'), 'utf8') : '';
  if (current !== out) { console.error('index.json ist nicht aktuell: node scripts/index.js ausführen'); process.exit(1); }
  console.log('index.json ist aktuell.');
} else {
  fs.writeFileSync(path.join(root, 'index.json'), out);
  console.log(`index.json mit ${fixtures.length} Geräten geschrieben.`);
}
