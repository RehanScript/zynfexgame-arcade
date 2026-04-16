import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const jobs = [
    { name: 'zombs-royale', url: 'https://prod.iogames.space/sites/default/files/iogames-01.png' },
    { name: 'little-big-snake', url: 'https://prod.iogames.space/sites/default/files/2022-01/LBS_promo.jpg' },
    { name: 'world-guessr', url: 'https://prod.iogames.space/sites/default/files/field_name/WorldGuessr_%281%29.png' },
    { name: 'hexanaut-io', url: 'https://prod.iogames.space/sites/default/files/field_name/banner-v3-275x157.png' },
    { name: 'basket-bros', url: 'https://prod.iogames.space/sites/default/files/basketbros_iogames275.png' },
    { name: 'moomoo-io', url: 'https://prod.iogames.space/sites/default/files/moomoo-io.png' }
];

async function run() {
    const destDir = path.resolve('./public/hosted-games');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    for (const job of jobs) {
        try {
            console.log(`Downloading ${job.name} thumbnail...`);
            const response = await fetch(job.url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            console.log(`Optimizing ${job.name}...`);
            await sharp(buffer)
                .resize(800, 450, { fit: 'cover' })
                .webp({ quality: 80, effort: 6 })
                .toFile(path.join(destDir, `${job.name}-thumb.webp`));
            
            console.log(`✅ ${job.name} done.`);
        } catch (err) {
            console.error(`❌ Failed ${job.name}: ${err.message}`);
        }
    }
}

run();
