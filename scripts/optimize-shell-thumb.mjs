import sharp from 'sharp';
import path from 'path';

const src = String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\shell_shockers_thumb_1776064061445.png`;
const dest = path.resolve('./public/hosted-games/shell-shockers-thumb.webp');

await sharp(src)
  .resize(800, 450, { fit: 'cover' })
  .webp({ quality: 80, effort: 6 })
  .toFile(dest);

console.log('✅ Shell Shockers thumbnail optimized.');
