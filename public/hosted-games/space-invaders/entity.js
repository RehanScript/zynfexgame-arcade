/**
 * Space Invaders - Entities (Extended)
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

import { CONFIG } from './constants.js';

export class Entity {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.alive = true;
    }

    draw(ctx) {
        if (!this.alive) return;
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = CONFIG.COLORS.PRIMARY;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export class Ship extends Entity {
    constructor(boardWidth, boardHeight, img) {
        const width = CONFIG.TILE_SIZE * CONFIG.SHIP.WIDTH_TILES;
        const height = CONFIG.TILE_SIZE * CONFIG.SHIP.HEIGHT_TILES;
        const x = boardWidth / 2 - width / 2;
        const y = boardHeight - height - CONFIG.TILE_SIZE;
        super(x, y, width, height, img);
        this.velocityX = CONFIG.SHIP.VELOCITY_X;
    }

    move(direction, boardWidth, boardHeight) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.velocityX;
        } else if (direction === 'right' && this.x + this.width < boardWidth) {
            this.x += this.velocityX;
        } else if (direction === 'up' && this.y > 0) {
            this.y -= this.velocityX;
        } else if (direction === 'down' && this.y + this.height < boardHeight) {
            this.y += this.velocityX;
        }
    }

    setSprite(img) {
        this.img = img;
    }
}

export class Alien extends Entity {
    constructor(x, y, img) {
        const width = CONFIG.TILE_SIZE * CONFIG.ALIEN.WIDTH_TILES;
        const height = CONFIG.TILE_SIZE * CONFIG.ALIEN.HEIGHT_TILES;
        super(x, y, width, height, img);
    }
}

export class Shield extends Entity {
    constructor(x, y, img) {
        const width = CONFIG.TILE_SIZE * CONFIG.SHIELD.WIDTH_TILES;
        const height = CONFIG.TILE_SIZE * CONFIG.SHIELD.HEIGHT_TILES;
        super(x, y, width, height, img);
        this.health = CONFIG.SHIELD.HEALTH;
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.globalAlpha = this.health / CONFIG.SHIELD.HEALTH;
        super.draw(ctx);
        ctx.globalAlpha = 1.0;
    }
}

export class Meteor extends Entity {
    constructor(boardWidth, img) {
        const size = Math.random() * (CONFIG.METEOR.MAX_SIZE - CONFIG.METEOR.MIN_SIZE) + CONFIG.METEOR.MIN_SIZE;
        const x = Math.random() * (boardWidth - size);
        super(x, -size, size, size, img);
        this.velocityY = CONFIG.METEOR.VELOCITY_Y + Math.random() * 2;
    }

    update() {
        this.y += this.velocityY;
        if (this.y > 1000) this.alive = false;
    }
}

export class Explosion extends Entity {
    constructor(x, y, size, img) {
        super(x, y, size, size, img);
        this.startTime = Date.now();
    }

    update() {
        if (Date.now() - this.startTime > CONFIG.EFFECTS.DURATION) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        const scale = (Date.now() - this.startTime) / CONFIG.EFFECTS.DURATION * 2;
        ctx.scale(scale, scale);
        ctx.globalAlpha = 1 - ((Date.now() - this.startTime) / CONFIG.EFFECTS.DURATION);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

export class Bullet extends Entity {
    constructor(x, y, img) {
        super(x, y, 10, 25, img); // Default size for sprite bullet
        this.velocityY = CONFIG.BULLET.VELOCITY_Y;
        this.used = false;
    }

    update() {
        this.y += this.velocityY;
        if (this.y < -50) this.used = true;
    }

    draw(ctx) {
        if (this.used) return;
        if (this.img && this.img.complete) {
            super.draw(ctx);
        } else {
            ctx.fillStyle = CONFIG.BULLET.COLOR;
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONFIG.BULLET.COLOR;
            ctx.fillRect(this.x, this.y, 4, 15);
            ctx.shadowBlur = 0;
        }
    }
}
