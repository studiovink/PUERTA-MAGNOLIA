// Genera variantes intermedias (solo reducción, nunca ampliación) a partir de los 4K del kit.
// Horizontales: 1920 px. Verticales: 1290 px. Uso: npm run variantes
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = new URL('../public/images/', import.meta.url);
for (const name of await readdir(dir)) {
  const m = name.match(/^(.*)-(3840|2160)\.webp$/);
  if (!m) continue;
  const width = m[2] === '3840' ? 1920 : 1290;
  const out = new URL(`${m[1]}-${width}.webp`, dir);
  if (existsSync(out)) continue;
  await sharp(fileURLToPath(new URL(name, dir))).resize({ width }).webp({ quality: 82, effort: 6 }).toFile(fileURLToPath(out));
  console.log('creada', `${m[1]}-${width}.webp`);
}
