import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function processImage() {
    const url = 'https://geometrydash-lite2.io/data/image/options/geometrydashlite-banner.jpg';
    const dest = path.resolve('./public/blog-images/how-to-play-geometry-dash-lite.webp');

    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });

    try {
        console.log(`Downloading Geometry Dash Lite thumbnail...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`Optimizing for blog...`);
        await sharp(buffer)
            .resize(1200, 675, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(dest);
        
        console.log(`✅ Geometry Dash Lite image optimized.`);
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
    }
}

processImage();
