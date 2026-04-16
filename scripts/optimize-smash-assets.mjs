import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function processImage() {
    const url = 'https://i.ibb.co/TMktHWyz/Gemini-Generated-Image-z9blrcz9blrcz9bl.png';
    const blogDest = path.resolve('./public/blog-images/how-to-play-smash-karts.webp');
    const gameDest = path.resolve('./public/hosted-games/smash-karts-thumb.webp');

    // Ensure directories exist
    if (!fs.existsSync(path.dirname(blogDest))) fs.mkdirSync(path.dirname(blogDest), { recursive: true });
    if (!fs.existsSync(path.dirname(gameDest))) fs.mkdirSync(path.dirname(gameDest), { recursive: true });

    try {
        console.log(`Downloading Smash Karts thumbnail...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`Optimizing for blog (1200x675)...`);
        await sharp(buffer)
            .resize(1200, 675, { fit: 'cover' })
            .webp({ quality: 85, effort: 6 })
            .toFile(blogDest);

        console.log(`Optimizing for game card (800x450)...`);
        await sharp(buffer)
            .resize(800, 450, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(gameDest);
        
        console.log(`✅ Smash Karts images updated.`);
    } catch (err) {
        console.error(`❌ Failed: ${err.message}`);
    }
}

processImage();
