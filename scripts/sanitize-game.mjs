import fs from 'fs';
import path from 'path';

const gameJsonPath = path.resolve('./src/data/games.json');
const gamesDir = path.resolve('./public/games');
const testGameDir = path.resolve('./public/games/test-game/space-invaders');
const finalGameDir = path.resolve('./public/games/space-invaders');
const htmlPath = path.join(finalGameDir, 'index.html');

console.log("🚀 Initializing Game Sanitization...");

try {
  // 1. Move folder
  if (fs.existsSync(testGameDir)) {
    fs.renameSync(testGameDir, finalGameDir);
    console.log("✅ Moved game to final directory.");
  }

  // 2. Read and Sanitize HTML
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Nuke the SEO head tags from lines 11-32
    html = html.replace(/<meta name="description"[\s\S]*?<title>.*?<\/title>/, '<title>Space Invaders 3D</title>');

    // Nuke the RSK World comment header
    html = html.replace(/<!--[\s\S]*?RSK World[\s\S]*?-->/, '');

    // Nuke the RSK World Author tag
    html = html.replace(/<meta name="author".*?>/, '');

    // Fix the home link
    html = html.replace(/<a href="https:\/\/rskworld\.in".*?>/, '<a href="/" class="home-link" target="_parent" title="Home">');

    // Nuke the entire footer
    html = html.replace(/<footer>[\s\S]*?<\/footer>/, '');

    fs.writeFileSync(htmlPath, html);
    console.log("✅ Sanitized index.html safely.");
  }

  // 3. Add to games.json
  const rawData = fs.readFileSync(gameJsonPath, 'utf8');
  let games = JSON.parse(rawData);

  // Check if it already exists
  const exists = games.find(g => g.slug === 'space-invaders');
  
  if (!exists) {
    const newGame = {
      slug: "space-invaders",
      title: "Space Invaders 3D",
      category: "Action",
      thumbnail: "/games/space-invaders/assets/images/gameplay.png",
      iframe: "/games/space-invaders/index.html",
      developer: "ZynfexGame Arcade (Self-Hosted)",
      featured: true
    };
    
    // Set all others to not featured
    games.forEach(g => g.featured = false);
    
    games.unshift(newGame);
    fs.writeFileSync(gameJsonPath, JSON.stringify(games, null, 2));
    console.log("✅ Registered 'space-invaders' into local games database.");
  }

} catch (err) {
  console.error("❌ Error during sanitization:", err);
}
