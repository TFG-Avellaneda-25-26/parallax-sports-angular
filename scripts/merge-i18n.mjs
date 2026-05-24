import { readFileSync, writeFileSync } from 'fs';

const source = readFileSync('src/locale/messages.xlf', 'utf8');
const target = readFileSync('src/locale/messages.es.xlf', 'utf8');

// extrae IDs ya existentes en el archivo de traducción
const existingIds = [...target.matchAll(/<unit id="([^"]+)"/g)].map(m => m[1]);

// extrae unidades nuevas del source que no están en el target
const newUnits = [...source.matchAll(/<unit id="([^"]+)"[\s\S]*?<\/unit>/g)]
  .filter(m => !existingIds.includes(m[1]))
  .map(m => m[0].replace(/<source>([\s\S]*?)<\/source>/,
    '<source>$1</source>\n        <target>$1</target>'));

if (newUnits.length === 0) {
  console.log('No new units to merge.');
  process.exit(0);
}

// inserta antes del </file>
const merged = target.replace('</file>', `${newUnits.join('\n    ')}\n  </file>`);
writeFileSync('src/locale/messages.es.xlf', merged);
console.log(`Merged ${newUnits.length} new units into messages.es.xlf`);
