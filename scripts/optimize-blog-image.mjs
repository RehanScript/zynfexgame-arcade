import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function optimize() {
    const src = String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\ps4_ps5_free_games_april_2026_thumb_1776109564531.png`;
    const destDir = path.resolve('./public/blog-images');
    const dest = path.join(destDir, 'ps4-ps5-free-games-april-2026.webp');

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    console.log('Optimizing blog image...');
    await sharp(src)
        .resize(1200, 675, { fit: 'cover' })
        .webp({ quality: 85, effort: 6 })
        .toFile(dest);

    console.log('✅ Blog image optimized: /blog-images/ps4-ps5-free-games-april-2026.webp');
}

await optimize();
