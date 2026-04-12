import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gamesPath = path.join(__dirname, '../src/data/games.json');

const games = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
const defaultFallbackUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

async function verifyAndFix() {
    let replacedCount = 0;
    
    // We only need to fix the specific broken IDs listed by Lighthouse:
    const brokenIds = [
        '2ac2693b77ab',
        'b8c2d1b72e5a',
        '0056cb7636e7',
        'e52658b8ebf8'
    ];

    for (const game of games) {
        if (brokenIds.some(id => game.thumbnail.includes(id))) {
            console.log(`Fixing broken thumbnail for: ${game.title}`);
            game.thumbnail = defaultFallbackUrl;
            replacedCount++;
        }
    }

    if (replacedCount > 0) {
        fs.writeFileSync(gamesPath, JSON.stringify(games, null, 4));
        console.log(`Fixed ${replacedCount} broken image URLs.`);
    } else {
        console.log("No broken URLs found.");
    }
}

verifyAndFix();
