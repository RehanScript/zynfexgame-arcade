/**
 * Space Invaders - Storage Manager
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

const STORAGE_KEY = 'rsk_space_invaders_scores';

export const StorageManager = {
    saveScore(playerData) {
        let scores = this.getScores();
        scores.push(playerData);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); // Keep top 5
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    },

    getScores() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getHighScore() {
        const scores = this.getScores();
        return scores.length > 0 ? scores[0].score : 0;
    }
};
