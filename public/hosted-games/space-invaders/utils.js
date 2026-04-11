/**
 * Space Invaders - Utilities
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

export const Utils = {
    detectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },
    
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};
