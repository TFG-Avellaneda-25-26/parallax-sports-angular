import { readFileSync, writeFileSync } from 'fs';

const source = readFileSync('src/locale/messages.xlf', 'utf8');
const target = readFileSync('src/locale/messages.es.xlf', 'utf8');

const existingIds = [...target.matchAll(/<unit id="([^"]+)"/g)].map(m => m[1]);

const newUnits = [...source.matchAll(/<unit id="([^"]+)"[\s\S]*?<\/unit>/g)]
  .filter(m => !existingIds.includes(m[1]))
  .map(m => {
    let unit = m[0].replace(/<notes>[\s\S]*?<\/notes>\n?\s*/g, '');
    unit = unit.replace(/<source>([\s\S]*?)<\/source>/,
      '<source>$1</source>\n        <target>$1</target>');
    return unit;
  });

if (newUnits.length === 0) {
  console.log('No new units to merge.');
  process.exit(0);
}

const merged = target.replace('</file>', `${newUnits.join('\n    ')}\n  </file>`);
writeFileSync('src/locale/messages.es.xlf', merged);
console.log(`Merged ${newUnits.length} new units into messages.es.xlf`);
