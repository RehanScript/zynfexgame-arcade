import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const jobs = [
    { name: 'paper-io', url: 'https://prod.iogames.space/sites/default/files/Paper.io-4.png' },
    { name: 'starblast-io', url: 'https://prod.iogames.space/sites/default/files/starblast.png' },
    { name: 'wormszone-io', url: 'https://prod.iogames.space/sites/default/files/27521.png' },
    { name: 'sea-dragons', url: 'https://prod.iogames.space/sites/default/files/Thumbnail_IOG_Snake_v1.png' },
    { name: 'stabfish-io', url: 'https://prod.iogames.space/sites/default/files/cover_2.png' }
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
