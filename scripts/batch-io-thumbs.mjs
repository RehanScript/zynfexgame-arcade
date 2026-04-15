import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const jobs = [
    { name: 'deadshot-io', url: 'https://prod.iogames.space/sites/default/files/smallthumbnail.png' },
    { name: 'splix-io', url: 'https://prod.iogames.space/sites/default/files/Splix-io.png' },
    { name: 'lordz-io', url: 'https://prod.iogames.space/sites/default/files/LRZ_IOGS_Thumb_22062018.png' },
    { name: 'karatebros-io', url: 'https://prod.iogames.space/sites/default/files/field_name/karate.jpg' },
    { name: 'starblast-io', url: 'https://prod.iogames.space/sites/default/files/starblast.png' }
];

async function run() {
    const destDir = path.resolve('./public/hosted-games');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    for (const job of jobs) {
        try {
            console.log(`Downloading ${job.name} thumbnail from ${job.url}...`);
            const response = await fetch(job.url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            console.log(`Optimizing ${job.name} to WebP...`);
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
