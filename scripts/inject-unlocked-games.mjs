import fs from 'fs';
import path from 'path';

// Curated array of guaranteed UNBLOCKED HTML5 games from GitHub / Playpager / Direct embed CDNs
const unlockedGames = [
  {
    title: "2048 Classic",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
    iframe: "https://play2048.co/",
    developer: "Gabriele Cirulli (GitHub)"
  },
  {
    title: "Flappy Bird Original",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    iframe: "https://flappybird.io/",
    developer: "Dong Nguyen (Web Port)"
  },
  {
    title: "Hextris Arcade",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=600&auto=format&fit=crop",
    iframe: "https://hextris.io/",
    developer: "Hextris Team (GitHub)"
  },
  {
    title: "Playpager Chess",
    category: "Strategy",
    thumbnail: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/chess/index.html",
    developer: "Playpager"
  },
  {
    title: "Playpager Sudoku",
    category: "Puzzle",
    thumbnail: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/sudoku/index.html",
    developer: "Playpager"
  },
  {
    title: "HTML5 Pacman",
    category: "Arcade",
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    iframe: "https://freepacman.org/",
    developer: "Web Port"
  },
  {
    title: "Playpager Bubble Shooter",
    category: "Casual",
    thumbnail: "https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/bubbleshooter/index.html",
    developer: "Playpager"
  },
  {
    title: "Playpager Tic Tac Toe",
    category: "Casual",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/tictactoe/index.html",
    developer: "Playpager"
  },
  {
    title: "Playpager Breakout",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/breakout/index.html",
    developer: "Playpager"
  },
  {
    title: "Playpager Solitaire",
    category: "Card",
    thumbnail: "https://images.unsplash.com/photo-1511116557814-2ac2693b77ab?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/solitaire/index.html",
    developer: "Playpager"
  },
  {
    title: "Playpager 8 Ball Pool",
    category: "Sports",
    thumbnail: "https://images.unsplash.com/photo-1629165187760-b8c2d1b72e5a?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/pool/index.html",
    developer: "Playpager"
  },
  {
    title: "Classic Checkers",
    category: "Strategy",
    thumbnail: "https://images.unsplash.com/photo-1582294468658-0056cb7636e7?q=80&w=600&auto=format&fit=crop",
    iframe: "https://playpager.com/embed/checkers/index.html",
    developer: "Playpager"
  }
];

function injectGames() {
  console.log("🚀 Switching ZynfexGame to Unlocked Catalog Strategy...");
  
  // Transform to ZynfexGame DB format
  const zynfexDB = unlockedGames.map((game, index) => {
    // Create a clean URL slug from the title
    const slug = game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    return {
      slug: slug,
      title: game.title,
      category: game.category,
      thumbnail: game.thumbnail,
      iframe: game.iframe,
      developer: game.developer,
      featured: index === 0 // Make the first game the Hero banner
    };
  });

  const dbPath = path.resolve('./src/data/games.json');
  fs.writeFileSync(dbPath, JSON.stringify(zynfexDB, null, 2));
  
  console.log(`✅ Success! Hardcoded ${zynfexDB.length} premium UNLOCKED games to bypass GameDistribution redirects.`);
}

injectGames();
