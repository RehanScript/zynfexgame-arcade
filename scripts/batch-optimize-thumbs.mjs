import sharp from 'sharp';
import path from 'path';

const jobs = [
    { src: String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\smash_karts_thumb_1776111494242.png`, dest: 'smash-karts-thumb.webp' },
    { src: String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\space_waves_io_thumb_1776111511121.png`, dest: 'space-waves-io-thumb.webp' },
    { src: String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\count_masters_thumb_1776111527772.png`, dest: 'count-masters-thumb.webp' },
    { src: String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\space_waves_arcade_thumb_1776111542238.png`, dest: 'space-waves-arcade-thumb.webp' },
    { src: String.raw`C:\Users\REHAN\.gemini\antigravity\brain\22c904d6-fd45-4cc5-bde3-9a161c0c3d7d\doodle_road_thumb_1776111555805.png`, dest: 'doodle-road-thumb.webp' }
];

async function run() {
    for (const job of jobs) {
        console.log(`Optimizing ${job.dest}...`);
        await sharp(job.src)
            .resize(800, 450, { fit: 'cover' })
            .webp({ quality: 80, effort: 6 })
            .toFile(path.resolve(`./public/hosted-games/${job.dest}`));
    }
    console.log('✅ All thumbnails optimized.');
}

run();
