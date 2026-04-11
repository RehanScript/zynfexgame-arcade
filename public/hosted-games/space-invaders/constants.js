/**
 * Space Invaders - Constants (Extended)
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

export const CONFIG = {
    TILE_SIZE: 32,
    ROWS: 20,
    COLUMNS: 30,
    
    SHIP: {
        WIDTH_TILES: 2,
        HEIGHT_TILES: 1.5,
        VELOCITY_X: 10,
        SPRITE: './assets/images/Sprites/Ships/spaceShips_001.png'
    },
    
    ALIEN: {
        WIDTH_TILES: 1.5,
        HEIGHT_TILES: 1,
        INITIAL_ROWS: 4,
        INITIAL_COLS: 6,
        VELOCITY_X: 1.5,
        DROP_TILES: 0.5,
        SPRITE: './assets/images/alien.png'
    },
    
    BULLET: {
        WIDTH: 4,
        HEIGHT: 15,
        VELOCITY_Y: -12,
        COLOR: '#00ff41'
    },
    
    SHIELD: {
        WIDTH_TILES: 3,
        HEIGHT_TILES: 2,
        COUNT: 4,
        HEALTH: 5,
        SPRITE: './assets/images/Sprites/Building/spaceBuilding_001.png'
    },

    METEOR: {
        MIN_SIZE: 20,
        MAX_SIZE: 60,
        VELOCITY_Y: 2,
        SPRITE: './assets/images/Sprites/Meteors/spaceMeteors_001.png'
    },

    EFFECTS: {
        EXPLOSION: './assets/images/Sprites/Effects/spaceEffects_001.png',
        DURATION: 500
    },

    LIVES: {
        INITIAL: 3,
        SPRITE: './assets/images/Sprites/Astronauts/spaceAstronauts_001.png'
    },

    BOSS: {
        SPRITE: './assets/images/Sprites/Rockets/spaceRockets_001.png',
        POINTS: 500,
        CHANCE: 0.005
    },

    STATION: {
        SPRITE: './assets/images/Sprites/Station/spaceStation_001.png'
    },
    
    COLORS: {
        PRIMARY: '#00ff41',
        ACCENT: '#ff00ff',
        TEXT: '#e0e0e0',
        BG: '#050507'
    }
};
