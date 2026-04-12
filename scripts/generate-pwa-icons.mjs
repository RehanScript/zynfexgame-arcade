import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/favicon.svg');
const outDir = path.join(__dirname, '../public');

async function generate() {
    try {
        console.log('Generating PWA icons...');
        
        // Render 192x192
        await sharp(inputPath, { density: 300 })
            .resize(192, 192)
            .png()
            .toFile(path.join(outDir, 'icon-192x192.png'));
            
        // Render 512x512
        await sharp(inputPath, { density: 300 })
            .resize(512, 512)
            .png()
            .toFile(path.join(outDir, 'icon-512x512.png'));
            
        // Render Apple Touch Icon (180x180)
        await sharp(inputPath, { density: 300 })
            .resize(180, 180)
            .flatten({ background: { r: 28, g: 25, b: 56 } }) // Match theme background #1c1938
            .png()
            .toFile(path.join(outDir, 'apple-touch-icon.png'));

        // Render Maskable Icon (512x512 with safe area margin)
        await sharp({
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: { r: 28, g: 25, b: 56, alpha: 1 }
            }
        })
        .composite([{
            input: await sharp(inputPath, { density: 300 }).resize(360, 360).toBuffer(),
            gravity: 'center'
        }])
        .png()
        .toFile(path.join(outDir, 'maskable-icon.png'));

        console.log('PWA icons generated successfully!');
    } catch (err) {
        console.error('Failed:', err);
    }
}

generate();
