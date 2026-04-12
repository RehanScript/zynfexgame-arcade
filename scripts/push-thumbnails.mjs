import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeThumbnails() {
    const doodleSrc = String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\doodle_jump_thumb_1776025573202.png`;
    const witchcatSrc = String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\witchcat_thumb_1776025588346.png`;

    const doodleDest = path.resolve('./public/hosted-games/doodle-jump/thumbnail.webp');
    const witchcatDest = path.resolve('./public/hosted-games/witchcat/thumbnail.webp');

    console.log('Optimizing thumbnails via sharp to strict webp dimensions...');
    
    // Convert Doodle Jump
    if (fs.existsSync(doodleSrc)) {
        await sharp(doodleSrc)
            .resize(800, 450, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(doodleDest);
        console.log('✅ Doodle Jump thumbnail compressed and saved.');
    } else {
        console.error('Missing source for doodle jump');
    }

    // Convert Witchcat
    if (fs.existsSync(witchcatSrc)) {
        await sharp(witchcatSrc)
            .resize(800, 450, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(witchcatDest);
        console.log('✅ Witchcat thumbnail compressed and saved.');
    } else {
        console.error('Missing source for witchcat');
    }
}

optimizeThumbnails();
