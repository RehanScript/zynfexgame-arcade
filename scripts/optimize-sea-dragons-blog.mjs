import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const sourceImg = 'C:/Users/REHAN/.gemini/antigravity/brain/22c904d6-fd45-4cc5-bde3-9a161c0c3d7d/sea_dragons_guide_thumb_new_1776441987779.png';
const destDir = path.resolve('./public/blog-images');
const destFile = path.join(destDir, 'how-to-play-sea-dragons.webp');

async function run() {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    console.log('Optimizing Sea Dragons blog thumbnail...');
    await sharp(sourceImg)
        .resize(1200, 630, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(destFile);
    
    console.log('✅ Done.');
}

run();
