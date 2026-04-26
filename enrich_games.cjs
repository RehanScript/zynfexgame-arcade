const fs = require('fs');
const games = JSON.parse(fs.readFileSync('./src/data/games.json', 'utf8'));

const enrichment = {
  'IO Games': {
    missions: [
      "Survive as long as possible and grow your character to dominate the leaderboard.",
      "Outsmart opponents in real-time and expand your territory in this competitive arena.",
      "Collect resources, evolve, and defeat other players to become the ultimate survivor."
    ],
    strategies: [
      "Keep moving to avoid being an easy target.",
      "Stay near the edges of the map when you are small.",
      "Use your boost only when absolutely necessary to escape or capture.",
      "Watch the leaderboard to track your top rivals."
    ]
  },
  'Action': {
    missions: [
      "Eliminate all enemies and complete challenging objectives in high-octane combat.",
      "Test your reflexes and combat skills against waves of increasingly difficult foes.",
      "Master the mechanics and use your arsenal to survive the chaos of the arena."
    ],
    strategies: [
      "Master the dodge move to avoid incoming attacks.",
      "Prioritize taking down long-range enemies first.",
      "Collect power-ups immediately to gain a temporary advantage.",
      "Keep an eye on your health bar and retreat when necessary."
    ]
  },
  'Arcade': {
    missions: [
      "Score as many points as possible by mastering the classic arcade mechanics.",
      "Challenge your high score in this addictive and fast-paced arcade experience.",
      "Navigate through obstacles and collect bonuses to reach new levels of success."
    ],
    strategies: [
      "Focus on the rhythm of the game to predict upcoming obstacles.",
      "Aim for combos to multiply your score significantly.",
      "Don't be afraid to take risks for high-value bonuses.",
      "Practice the first few levels to build a solid foundation for longer runs."
    ]
  },
  'Racing': {
    missions: [
      "Cross the finish line first and outpace your rivals in high-speed competition.",
      "Master every curve and straightaway to set new lap records on diverse tracks.",
      "Drift, boost, and navigate obstacles to claim the championship trophy."
    ],
    strategies: [
      "Use your boost on straightaways for maximum efficiency.",
      "Master the drifting mechanic to maintain speed through sharp turns.",
      "Watch the mini-map to anticipate upcoming turns and shortcuts.",
      "Block your opponents' paths to prevent them from overtaking."
    ]
  },
  'Platformer': {
    missions: [
      "Navigate through treacherous levels, avoiding spikes and traps to reach the goal.",
      "Collect hidden items and master difficult jumps to conquer every stage.",
      "Use your agility and timing to overcome obstacles and defeat level bosses."
    ],
    strategies: [
      "Memorize the timing of moving platforms and traps.",
      "Use wall-jumps or double-jumps to reach higher areas.",
      "Look for secret paths that might contain powerful upgrades.",
      "Take your time on difficult jumps; precision is better than speed."
    ]
  },
  'Strategy': {
    missions: [
      "Build your base, manage resources, and outmaneuver your opponents to win.",
      "Develop a winning strategy and lead your forces to total victory.",
      "Analyze the battlefield and make crucial decisions to outsmart the enemy."
    ],
    strategies: [
      "Prioritize resource gathering in the early game.",
      "Scout your opponent's movements to anticipate their next move.",
      "Build a balanced set of units to counter different enemy types.",
      "Upgrade your base defenses before launching a major offensive."
    ]
  },
  'Puzzle': {
    missions: [
      "Solve intricate puzzles and unlock new levels by using your logic and wit.",
      "Challenge your brain with increasingly complex logic and pattern puzzles.",
      "Find the hidden solutions and clear the board in as few moves as possible."
    ],
    strategies: [
      "Look for patterns that repeat across different sections of the puzzle.",
      "Think several moves ahead to avoid getting stuck in a corner.",
      "Don't be afraid to reset if you find yourself in an impossible position.",
      "Try to solve the most difficult parts of the puzzle first."
    ]
  }
};

const enrichedGames = games.map(game => {
  const genericMission = "Master the challenges in " + game.title + " and hit the highest score.";
  const isGeneric = game.mission === genericMission || !game.mission;

  if (isGeneric && enrichment[game.category]) {
    const data = enrichment[game.category];
    game.mission = data.missions[Math.floor(Math.random() * data.missions.length)];
    
    // Shuffle and pick 3 strategies
    const shuffledStrats = [...data.strategies].sort(() => 0.5 - Math.random());
    game.strategies = shuffledStrats.slice(0, 3);
  }
  
  if (game.controls === "Click, tap, or use keyboard to play" || !game.controls) {
    if (game.category === 'Action' || game.category === 'Racing') {
      game.controls = "Use **WASD** or **Arrow Keys** to move. Press **Space** for special actions.";
    } else if (game.category === 'Platformer') {
      game.controls = "Use **Space** or **Up Arrow** to jump. **Left/Right Arrows** to move.";
    } else {
      game.controls = "Use your **Mouse** or **Touch Screen** to interact with the game elements.";
    }
  }

  return game;
});

fs.writeFileSync('./src/data/games.json', JSON.stringify(enrichedGames, null, 2));
console.log("Successfully enriched " + enrichedGames.length + " games!");
