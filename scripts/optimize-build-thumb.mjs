import sharp from 'sharp';
import path from 'path';

async function optimize() {
    const srcUrl = 'https://iogames.onl/upload/imgs/build-royale-io-game.jpg';
    const destPath = path.resolve('./public/hosted-games/build-royale-thumb.webp');
    
    console.log('Downloading thumbnail...');
    const response = await fetch(srcUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('Optimizing thumbnail...');
    await sharp(buffer)
        .resize(800, 450, { fit: 'cover' })
        .webp({ quality: 80, effort: 6 })
        .toFile(destPath);
        
    console.log('✅ BuildRoyale.io thumbnail optimized.');
}

await optimize();
