import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const tasks = [
    {
        src: 'C:/Users/REHAN/.gemini/antigravity/brain/22c904d6-fd45-4cc5-bde3-9a161c0c3d7d/sea_dragons_guide_thumb_new_1776441987779.png',
        dest: 'how-to-play-sea-dragons.webp'
    },
    {
        src: 'C:/Users/REHAN/.gemini/antigravity/brain/22c904d6-fd45-4cc5-bde3-9a161c0c3d7d/wormszone_guide_thumb_new_1776442023787.png',
        dest: 'how-to-play-wormszone-io.webp'
    }
];

const destDir = path.resolve('./public/blog-images');

async function run() {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    
    for (const task of tasks) {
        console.log(`Optimizing ${task.dest}...`);
        await sharp(task.src)
            .resize(1200, 630, { fit: 'cover' })
            .webp({ quality: 85 })
            .toFile(path.join(destDir, task.dest));
    }
    
    console.log('✅ All done.');
}

run();
