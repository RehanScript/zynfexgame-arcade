/**
 * Space Invaders - 2D Engine (HTML5 Canvas)
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

export class Engine2D {
    constructor(canvasId) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = canvasId || 'game-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.backgroundLoaded = false;
        this.backgroundImage = new Image();
        this.backgroundImage.src = './assets/images/nebula.png';
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
        };

        this.init();
    }

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '1';
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });
    }

    clear() {
        if (this.backgroundLoaded) {
            // Draw nebula background
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
            // Add a dark overlay to keep the game readable
            this.ctx.fillStyle = 'rgba(2, 2, 5, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#020205';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    drawStarfield(stars) {
        this.ctx.fillStyle = '#ffffff';
        for (const star of stars) {
            this.ctx.globalAlpha = star.alpha;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    render() {
        // Canvas is rendered automatically, this is a placeholder for any post-processing
    }
}
