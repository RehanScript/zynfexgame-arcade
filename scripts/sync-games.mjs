import fs from 'fs';
import path from 'path';

async function fetchThousandsOfGames() {
  console.log("🚀 Starting ZynfexGame Auto-Sync...");
  let allGames = [];
  const maxGames = 100;
  const limit = 100;

  try {
    const totalPages = Math.ceil(maxGames / limit);
    for (let page = 1; page <= totalPages; page++) {
      const endpoint = `https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&limit=${limit}&page=${page}&type=html5&format=json`;
      console.log(`Fetching games from Page ${page}...`);
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!data || data.length === 0) break;
      allGames = allGames.concat(data);
    }
    
    // Transform GameDistribution complex JSON into our simple ZynfexGame format
    let zynfexDB = allGames.map((game, index) => {
      // Create a clean URL slug from the title
      const slug = game.Title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      return {
        slug: slug,
        title: game.Title,
        category: (game.Category && game.Category.length > 0) ? game.Category[0] : "Casual",
        thumbnail: (game.Asset && game.Asset.length > 0) ? game.Asset[0] : "https://via.placeholder.com/400x400/1e1b4b/6366f1",
        iframe: game.Url,
        developer: game.Company || "GameDistribution",
        featured: index === 0 // Make the #1 most recent game the Hero banner
      };
    });

    // Deduplicate games by slug to guarantee no visual UI looping bugs
    zynfexDB = Array.from(new Map(zynfexDB.map(item => [item.slug, item])).values());

    // Make sure only the first one is featured
    zynfexDB.forEach((game, index) => {
       game.featured = index === 0;
    });

    const dbPath = path.resolve('./src/data/games.json');
    fs.writeFileSync(dbPath, JSON.stringify(zynfexDB, null, 2));
    
    console.log(`✅ Success! Downloaded and mapped ${zynfexDB.length} premium games into your database automatically.`);
  } catch (err) {
    console.error("❌ Failed to sync games:", err.message);
  }
}

fetchThousandsOfGames();
