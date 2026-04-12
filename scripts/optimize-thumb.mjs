import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/hosted-games/space-invaders/assets/images/gameplay.png');
const outputPath = path.join(__dirname, '../public/hosted-games/space-invaders/assets/images/gameplay-opt.webp');

async function optimize() {
    try {
        console.log('Optimizing...', inputPath);
        await sharp(inputPath)
            .resize(300, 300, { fit: 'cover' })
            .webp({ quality: 60 })
            .toFile(outputPath);
        console.log('Optimization complete!');
    } catch (err) {
        console.error('Sharp failed:', err.message);
    }
}

optimize();
