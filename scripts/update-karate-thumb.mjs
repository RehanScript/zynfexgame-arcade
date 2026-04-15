import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function updateThumb() {
    const url = 'https://i.ibb.co/zT53SLL2/Screenshot-2026-04-15-201642.png';
    const destDir = path.resolve('./public/hosted-games');
    const dest = path.join(destDir, 'karatebros-io-thumb.webp');

    try {
        console.log(`Downloading new Karate Bros thumbnail...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`Optimizing to WebP...`);
        await sharp(buffer)
            .resize(800, 450, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(dest);
        
        console.log(`✅ Karate Bros thumbnail updated.`);
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
    }
}

updateThumb();
