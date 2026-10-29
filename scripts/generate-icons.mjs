// Gera os ícones PNG do PWA sem dependências externas (rasterização + encoder PNG com zlib).
// Uso: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

function encodePNG(size, rgba) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Estrela de 5 pontas centrada em (0.5, 0.52), raio externo r.
function starPolygon(r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push([0.5 + rad * Math.cos(a), 0.53 + rad * Math.sin(a)]);
  }
  return pts;
}
function inside(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function render(size, starR) {
  const star = starPolygon(starR);
  const buf = Buffer.alloc(size * size * 4);
  const SS = 4;
  const top = [20, 184, 166]; // teal-500
  const bottom = [15, 118, 110]; // teal-700
  const gold = [251, 191, 36]; // amber-400
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cover = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++)
          if (inside(star, (x + (sx + 0.5) / SS) / size, (y + (sy + 0.5) / SS) / size)) cover++;
      const t = y / size;
      const a = cover / (SS * SS);
      const i = (y * size + x) * 4;
      for (let k = 0; k < 3; k++) {
        const bg = top[k] + (bottom[k] - top[k]) * t;
        buf[i + k] = Math.round(bg * (1 - a) + gold[k] * a);
      }
      buf[i + 3] = 255;
    }
  }
  return encodePNG(size, buf);
}

const targets = [
  ['icon-192.png', 192, 0.34],
  ['icon-512.png', 512, 0.34],
  ['icon-maskable-512.png', 512, 0.28], // dentro da zona segura de 80%
  ['icon-180.png', 180, 0.34], // apple-touch-icon
];
for (const [name, size, r] of targets) {
  writeFileSync(join(outDir, name), render(size, r));
  console.log('✔', name);
}

