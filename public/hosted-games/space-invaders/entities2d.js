/**
 * Space Invaders - 2D Entities with Sprites
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

// Sprite loader utility
const spriteCache = {};

function loadSprite(path) {
    if (spriteCache[path]) {
        return spriteCache[path];
    }
    const img = new Image();
    img.src = path;
    spriteCache[path] = img;
    return img;
}

export class Entity2D {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alive = true;
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }

    intersects(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        return a.left < b.right && a.right > b.left && 
               a.top < b.bottom && a.bottom > b.top;
    }

    update() {}
    draw(ctx) {}
}

export class Ship2D extends Entity2D {
    constructor(canvasWidth, canvasHeight, type = 'fighter') {
        // Different sizes based on ship type - larger for sprites
        const sizes = {
            'scout': { width: 55, height: 55, speed: 12 },
            'fighter': { width: 65, height: 65, speed: 8 },
            'tank': { width: 75, height: 75, speed: 5 }
        };
        
        const size = sizes[type] || sizes['fighter'];
        super(canvasWidth / 2, canvasHeight - 80, size.width, size.height);
        
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.shipType = type;
        this.speed = size.speed;
        this.rotation = 0; // Current rotation in radians
        this.moveX = 0; // Movement direction X
        this.moveY = 0; // Movement direction Y
        this.shieldActive = false;
        this.shieldTimer = 0;
        
        // Load ship sprite based on type - use all 9 ship sprites
        const shipSprites = {
            'scout': 'assets/images/Sprites/Ships/spaceShips_001.png',
            'fighter': 'assets/images/Sprites/Ships/spaceShips_002.png',
            'tank': 'assets/images/Sprites/Ships/spaceShips_003.png'
        };
        this.sprite = loadSprite(shipSprites[type] || shipSprites['fighter']);
        
        // Engine flame animation - use ALL 18 effect sprites
        this.engineFrame = 0;
        this.engineSprites = [
            'assets/images/Sprites/Effects/spaceEffects_001.png',
            'assets/images/Sprites/Effects/spaceEffects_002.png',
            'assets/images/Sprites/Effects/spaceEffects_003.png',
            'assets/images/Sprites/Effects/spaceEffects_004.png',
            'assets/images/Sprites/Effects/spaceEffects_005.png',
            'assets/images/Sprites/Effects/spaceEffects_006.png',
            'assets/images/Sprites/Effects/spaceEffects_007.png',
            'assets/images/Sprites/Effects/spaceEffects_008.png',
            'assets/images/Sprites/Effects/spaceEffects_009.png',
            'assets/images/Sprites/Effects/spaceEffects_010.png',
            'assets/images/Sprites/Effects/spaceEffects_011.png',
            'assets/images/Sprites/Effects/spaceEffects_012.png',
            'assets/images/Sprites/Effects/spaceEffects_013.png',
            'assets/images/Sprites/Effects/spaceEffects_014.png',
            'assets/images/Sprites/Effects/spaceEffects_015.png',
            'assets/images/Sprites/Effects/spaceEffects_016.png',
            'assets/images/Sprites/Effects/spaceEffects_017.png',
            'assets/images/Sprites/Effects/spaceEffects_018.png'
        ].map(loadSprite);
    }

    move(dir) {
        if (dir === 'left') this.moveX = -1;
        if (dir === 'right') this.moveX = 1;
        if (dir === 'up') this.moveY = -1;
        if (dir === 'down') this.moveY = 1;
    }

    stop(dir) {
        if (dir === 'left' && this.moveX === -1) this.moveX = 0;
        if (dir === 'right' && this.moveX === 1) this.moveX = 0;
        if (dir === 'up' && this.moveY === -1) this.moveY = 0;
        if (dir === 'down' && this.moveY === 1) this.moveY = 0;
    }

    activateShield(duration = 5000) {
        this.shieldActive = true;
        this.shieldTimer = Date.now() + duration;
    }

    deactivateShield() {
        this.shieldActive = false;
        this.shieldTimer = 0;
    }

    update() {
        if (this.shieldActive && Date.now() > this.shieldTimer) {
            this.shieldActive = false;
        }

        // Apply movement
        if (this.moveX !== 0 || this.moveY !== 0) {
            // Calculate target rotation based on movement
            const targetRotation = Math.atan2(this.moveY, this.moveX) + Math.PI / 2;
            
            // Smoothly rotate towards movement direction
            let diff = targetRotation - this.rotation;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            this.rotation += diff * 0.15;

            // Move ship
            const moveSpeed = this.speed;
            const dist = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
            this.x += (this.moveX / dist) * moveSpeed;
            this.y += (this.moveY / dist) * moveSpeed;

            // Keep within bounds
            this.x = Math.max(this.width/2, Math.min(this.canvasWidth - this.width/2, this.x));
            this.y = Math.max(this.height/2, Math.min(this.canvasHeight - this.height/2, this.y));
        }

        // Animate engine flame
        this.engineFrame = (this.engineFrame + 0.2) % this.engineSprites.length;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw engine flame behind ship
        const engineSprite = this.engineSprites[Math.floor(this.engineFrame)];
        if (engineSprite && engineSprite.complete) {
            ctx.drawImage(
                engineSprite,
                -15,
                this.height / 2,
                30,
                30
            );
        }
        
        // Shield
        if (this.shieldActive) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.width * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.fill();
        }

        // Draw ship sprite
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback if sprite not loaded
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.moveTo(0, -this.height/2);
            ctx.lineTo(-this.width/2, this.height/2);
            ctx.lineTo(this.width/2, this.height/2);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

}

export class Alien2D extends Entity2D {
    constructor(x, y, color, type = 'basic') {
        super(x, y, 55, 55);
        this.color = color;
        this.type = type;
        this.rotation = Math.PI; // Face downward initially
        this.vx = 0;
        this.vy = 0;
        this.speed = 1.5 + Math.random() * 2;
        this.canShoot = type === 'shooter';
        this.lastShot = 0;
        this.shootInterval = 2000 + Math.random() * 2000;
        
        // Load alien sprite - use ALL ship sprites + rockets + rocket parts + astronauts!
        const alienSprites = [
            // All 9 ship sprites
            'assets/images/Sprites/Ships/spaceShips_001.png',
            'assets/images/Sprites/Ships/spaceShips_002.png',
            'assets/images/Sprites/Ships/spaceShips_003.png',
            'assets/images/Sprites/Ships/spaceShips_004.png',
            'assets/images/Sprites/Ships/spaceShips_005.png',
            'assets/images/Sprites/Ships/spaceShips_006.png',
            'assets/images/Sprites/Ships/spaceShips_007.png',
            'assets/images/Sprites/Ships/spaceShips_008.png',
            'assets/images/Sprites/Ships/spaceShips_009.png',
            // All 4 rocket sprites
            'assets/images/Sprites/Rockets/spaceRockets_001.png',
            'assets/images/Sprites/Rockets/spaceRockets_002.png',
            'assets/images/Sprites/Rockets/spaceRockets_003.png',
            'assets/images/Sprites/Rockets/spaceRockets_004.png',
            // All 18 astronaut sprites
            'assets/images/Sprites/Astronauts/spaceAstronauts_001.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_002.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_003.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_004.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_005.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_006.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_007.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_008.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_009.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_010.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_011.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_012.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_013.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_014.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_015.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_016.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_017.png',
            'assets/images/Sprites/Astronauts/spaceAstronauts_018.png'
        ];
        const spriteIndex = Math.floor(Math.random() * alienSprites.length);
        this.sprite = loadSprite(alienSprites[spriteIndex]);
        
        // Engine effects for aliens - use ALL 18 effects
        this.engineFrame = Math.random() * 18;
        this.engineSprites = [
            'assets/images/Sprites/Effects/spaceEffects_001.png',
            'assets/images/Sprites/Effects/spaceEffects_002.png',
            'assets/images/Sprites/Effects/spaceEffects_003.png',
            'assets/images/Sprites/Effects/spaceEffects_004.png',
            'assets/images/Sprites/Effects/spaceEffects_005.png',
            'assets/images/Sprites/Effects/spaceEffects_006.png',
            'assets/images/Sprites/Effects/spaceEffects_007.png',
            'assets/images/Sprites/Effects/spaceEffects_008.png',
            'assets/images/Sprites/Effects/spaceEffects_009.png',
            'assets/images/Sprites/Effects/spaceEffects_010.png',
            'assets/images/Sprites/Effects/spaceEffects_011.png',
            'assets/images/Sprites/Effects/spaceEffects_012.png',
            'assets/images/Sprites/Effects/spaceEffects_013.png',
            'assets/images/Sprites/Effects/spaceEffects_014.png',
            'assets/images/Sprites/Effects/spaceEffects_015.png',
            'assets/images/Sprites/Effects/spaceEffects_016.png',
            'assets/images/Sprites/Effects/spaceEffects_017.png',
            'assets/images/Sprites/Effects/spaceEffects_018.png'
        ].map(loadSprite);
    }

    update(time) {
        this.x += this.vx;
        this.y += this.vy;
        
        // Rotate towards movement
        this.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
        
        // Animate engine
        this.engineFrame = (this.engineFrame + 0.15) % this.engineSprites.length;
        
        // Shooting
        if (this.canShoot && time - this.lastShot > this.shootInterval) {
            this.lastShot = time;
            return true;
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw engine flame above alien
        const engineSprite = this.engineSprites[Math.floor(this.engineFrame)];
        if (engineSprite && engineSprite.complete) {
            ctx.drawImage(
                engineSprite,
                -12,
                -this.height / 2 - 25,
                24,
                24
            );
        }
        
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 25, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Red eyes for shooters
        if (this.type === 'shooter') {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(-10, -2, 4, 0, Math.PI * 2);
            ctx.arc(10, -2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

export class Boss2D extends Entity2D {
    constructor(level, canvasWidth, canvasHeight) {
        super(canvasWidth / 2, 100, 180, 180);
        this.canvasWidth = canvasWidth;
        this.maxHealth = 20 + level * 5;
        this.health = this.maxHealth;
        this.lastShot = 0;
        this.shootInterval = 800;
        this.movePattern = 0;
        
        // Load boss sprite from Station folder - use multiple for variety
        const stationSprites = [
            'assets/images/Sprites/Station/spaceStation_001.png',
            'assets/images/Sprites/Station/spaceStation_002.png',
            'assets/images/Sprites/Station/spaceStation_003.png',
            'assets/images/Sprites/Station/spaceStation_004.png',
            'assets/images/Sprites/Station/spaceStation_005.png',
            'assets/images/Sprites/Station/spaceStation_006.png',
            'assets/images/Sprites/Station/spaceStation_007.png',
            'assets/images/Sprites/Station/spaceStation_008.png',
            'assets/images/Sprites/Station/spaceStation_009.png',
            'assets/images/Sprites/Station/spaceStation_010.png',
            'assets/images/Sprites/Station/spaceStation_011.png',
            'assets/images/Sprites/Station/spaceStation_012.png'
        ];
        const spriteIndex = Math.floor(Math.random() * stationSprites.length);
        this.sprite = loadSprite(stationSprites[spriteIndex]);
        
        // Boss glow effect
        this.glowFrame = 0;
        this.glowSprites = [
            'assets/images/Sprites/Effects/spaceEffects_015.png',
            'assets/images/Sprites/Effects/spaceEffects_016.png'
        ].map(loadSprite);
    }

    update(time) {
        this.movePattern += 0.02;
        this.x = this.canvasWidth / 2 + Math.sin(this.movePattern) * 200;
        this.y = 100 + Math.cos(this.movePattern * 0.5) * 50;
        
        this.glowFrame = (this.glowFrame + 0.1) % this.glowSprites.length;
        
        if (time - this.lastShot > this.shootInterval) {
            this.lastShot = time;
            return true;
        }
        return false;
    }

    takeDamage(damage = 1) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        const healthPercent = this.health / this.maxHealth;
        
        // Draw glow effect
        const glowSprite = this.glowSprites[Math.floor(this.glowFrame)];
        if (glowSprite && glowSprite.complete) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
                glowSprite,
                this.x - this.width / 2 - 20,
                this.y - this.height / 2 - 20,
                this.width + 40,
                this.height + 40
            );
            ctx.globalAlpha = 1;
        }
        
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                this.x - this.width / 2, 
                this.y - this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback
            ctx.fillStyle = '#880000';
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, 75, 40, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Health ring
        ctx.strokeStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 0.6, 0, Math.PI * 2);
        ctx.stroke();
    }
}

export class Bullet2D extends Entity2D {
    constructor(x, y, rotation, isEnemy = false) {
        super(x, y, 12, 32);
        this.isEnemy = isEnemy;
        this.rotation = rotation;
        this.speed = isEnemy ? 6 : 12;
        this.vx = Math.sin(rotation) * this.speed;
        this.vy = -Math.cos(rotation) * this.speed;
        
        // Load missile sprite - use ALL 40 missile sprites for variety
        const missileSprites = [
            'assets/images/Sprites/Missiles/spaceMissiles_001.png',
            'assets/images/Sprites/Missiles/spaceMissiles_002.png',
            'assets/images/Sprites/Missiles/spaceMissiles_003.png',
            'assets/images/Sprites/Missiles/spaceMissiles_004.png',
            'assets/images/Sprites/Missiles/spaceMissiles_005.png',
            'assets/images/Sprites/Missiles/spaceMissiles_006.png',
            'assets/images/Sprites/Missiles/spaceMissiles_007.png',
            'assets/images/Sprites/Missiles/spaceMissiles_008.png',
            'assets/images/Sprites/Missiles/spaceMissiles_009.png',
            'assets/images/Sprites/Missiles/spaceMissiles_010.png',
            'assets/images/Sprites/Missiles/spaceMissiles_011.png',
            'assets/images/Sprites/Missiles/spaceMissiles_012.png',
            'assets/images/Sprites/Missiles/spaceMissiles_013.png',
            'assets/images/Sprites/Missiles/spaceMissiles_014.png',
            'assets/images/Sprites/Missiles/spaceMissiles_015.png',
            'assets/images/Sprites/Missiles/spaceMissiles_016.png',
            'assets/images/Sprites/Missiles/spaceMissiles_017.png',
            'assets/images/Sprites/Missiles/spaceMissiles_018.png',
            'assets/images/Sprites/Missiles/spaceMissiles_019.png',
            'assets/images/Sprites/Missiles/spaceMissiles_020.png',
            'assets/images/Sprites/Missiles/spaceMissiles_021.png',
            'assets/images/Sprites/Missiles/spaceMissiles_022.png',
            'assets/images/Sprites/Missiles/spaceMissiles_023.png',
            'assets/images/Sprites/Missiles/spaceMissiles_024.png',
            'assets/images/Sprites/Missiles/spaceMissiles_025.png',
            'assets/images/Sprites/Missiles/spaceMissiles_026.png',
            'assets/images/Sprites/Missiles/spaceMissiles_027.png',
            'assets/images/Sprites/Missiles/spaceMissiles_028.png',
            'assets/images/Sprites/Missiles/spaceMissiles_029.png',
            'assets/images/Sprites/Missiles/spaceMissiles_030.png',
            'assets/images/Sprites/Missiles/spaceMissiles_031.png',
            'assets/images/Sprites/Missiles/spaceMissiles_032.png',
            'assets/images/Sprites/Missiles/spaceMissiles_033.png',
            'assets/images/Sprites/Missiles/spaceMissiles_034.png',
            'assets/images/Sprites/Missiles/spaceMissiles_035.png',
            'assets/images/Sprites/Missiles/spaceMissiles_036.png',
            'assets/images/Sprites/Missiles/spaceMissiles_037.png',
            'assets/images/Sprites/Missiles/spaceMissiles_038.png',
            'assets/images/Sprites/Missiles/spaceMissiles_039.png',
            'assets/images/Sprites/Missiles/spaceMissiles_040.png'
        ];
        const spriteIndex = Math.floor(Math.random() * missileSprites.length);
        this.sprite = loadSprite(missileSprites[spriteIndex]);
        
        // Trail effect - use ALL 18 effects
        this.trailSprites = [
            'assets/images/Sprites/Effects/spaceEffects_001.png',
            'assets/images/Sprites/Effects/spaceEffects_002.png',
            'assets/images/Sprites/Effects/spaceEffects_003.png',
            'assets/images/Sprites/Effects/spaceEffects_004.png',
            'assets/images/Sprites/Effects/spaceEffects_005.png',
            'assets/images/Sprites/Effects/spaceEffects_006.png',
            'assets/images/Sprites/Effects/spaceEffects_007.png',
            'assets/images/Sprites/Effects/spaceEffects_008.png',
            'assets/images/Sprites/Effects/spaceEffects_009.png',
            'assets/images/Sprites/Effects/spaceEffects_010.png',
            'assets/images/Sprites/Effects/spaceEffects_011.png',
            'assets/images/Sprites/Effects/spaceEffects_012.png',
            'assets/images/Sprites/Effects/spaceEffects_013.png',
            'assets/images/Sprites/Effects/spaceEffects_014.png',
            'assets/images/Sprites/Effects/spaceEffects_015.png',
            'assets/images/Sprites/Effects/spaceEffects_016.png',
            'assets/images/Sprites/Effects/spaceEffects_017.png',
            'assets/images/Sprites/Effects/spaceEffects_018.png'
        ].map(loadSprite);
        this.trailFrame = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.trailFrame = (this.trailFrame + 0.3) % this.trailSprites.length;
        if (this.x < -100 || this.x > window.innerWidth + 100 || 
            this.y < -100 || this.y > window.innerHeight + 100) {
            this.alive = false;
        }
    }

    draw(ctx) {
        // Draw trail
        const trailSprite = this.trailSprites[Math.floor(this.trailFrame)];
        if (trailSprite && trailSprite.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
                trailSprite,
                -6,
                15,
                12,
                16
            );
            ctx.restore();
            ctx.globalAlpha = 1;
        }
        
        if (this.sprite.complete) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
            ctx.restore();
        } else {
            // Fallback
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.isEnemy ? '#ff0000' : '#00ff41';
            ctx.fillRect(-6, -16, 12, 32);
            ctx.restore();
        }
    }
}

export class Meteor2D extends Entity2D {
    constructor(bounds) {
        const x = Math.random() * (bounds.x * 2) + (window.innerWidth / 2 - bounds.x);
        super(x, -50, 60, 60);
        this.speed = Math.random() * 4 + 3;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.health = 3;
        this.maxHealth = 3;
        
        // Load meteor sprite
        const meteorSprites = [
            'assets/images/Sprites/Meteors/spaceMeteors_001.png',
            'assets/images/Sprites/Meteors/spaceMeteors_002.png',
            'assets/images/Sprites/Meteors/spaceMeteors_003.png',
            'assets/images/Sprites/Meteors/spaceMeteors_004.png'
        ];
        const spriteIndex = Math.floor(Math.random() * meteorSprites.length);
        this.sprite = loadSprite(meteorSprites[spriteIndex]);
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        if (this.y > window.innerHeight + 50) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.sprite.complete) {
            // Adjust alpha based on health
            const healthPercent = this.health / this.maxHealth;
            ctx.globalAlpha = 0.5 + (healthPercent * 0.5);
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
            ctx.globalAlpha = 1;
        } else {
            // Fallback
            ctx.fillStyle = '#886644';
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

export class PowerUp2D extends Entity2D {
    constructor(x, y, type) {
        super(x, y, 40, 40);
        this.type = type;
        this.speed = 3;
        this.rotation = 0;
        
        // Use ALL 18 effects sprites for powerups
        const effectSprites = [
            'assets/images/Sprites/Effects/spaceEffects_001.png',
            'assets/images/Sprites/Effects/spaceEffects_002.png',
            'assets/images/Sprites/Effects/spaceEffects_003.png',
            'assets/images/Sprites/Effects/spaceEffects_004.png',
            'assets/images/Sprites/Effects/spaceEffects_005.png',
            'assets/images/Sprites/Effects/spaceEffects_006.png',
            'assets/images/Sprites/Effects/spaceEffects_007.png',
            'assets/images/Sprites/Effects/spaceEffects_008.png',
            'assets/images/Sprites/Effects/spaceEffects_009.png',
            'assets/images/Sprites/Effects/spaceEffects_010.png',
            'assets/images/Sprites/Effects/spaceEffects_011.png',
            'assets/images/Sprites/Effects/spaceEffects_012.png',
            'assets/images/Sprites/Effects/spaceEffects_013.png',
            'assets/images/Sprites/Effects/spaceEffects_014.png',
            'assets/images/Sprites/Effects/spaceEffects_015.png',
            'assets/images/Sprites/Effects/spaceEffects_016.png',
            'assets/images/Sprites/Effects/spaceEffects_017.png',
            'assets/images/Sprites/Effects/spaceEffects_018.png'
        ];
        const typeMap = {
            'rapid': 0, 'shield': 1, 'multishot': 2, 'speed': 3, 'life': 4
        };
        const spriteIndex = typeMap[type] || Math.floor(Math.random() * effectSprites.length);
        this.sprite = loadSprite(effectSprites[spriteIndex]);
        
        this.colors = {
            'rapid': '#ff0000',
            'shield': '#00ffff',
            'multishot': '#ffff00',
            'speed': '#00ff00',
            'life': '#ff00ff'
        };
    }

    update() {
        this.y += this.speed;
        this.rotation += 0.05;
        if (this.y > window.innerHeight) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback
            ctx.strokeStyle = this.colors[this.type];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = this.colors[this.type];
            ctx.fillRect(-8, -8, 16, 16);
        }
        
        ctx.restore();
    }
}

export class Particle2D extends Entity2D {
    constructor(x, y, color = '#ffaa00', type = 'debris') {
        super(x, y, 15, 15);
        this.color = color;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 40 + Math.random() * 30;
        this.maxLife = this.life;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.type = type;
        
        // Use parts sprites for realistic debris - ALL 98 parts!
        const partSprites = [
            'assets/images/Sprites/Parts/spaceParts_001.png',
            'assets/images/Sprites/Parts/spaceParts_002.png',
            'assets/images/Sprites/Parts/spaceParts_003.png',
            'assets/images/Sprites/Parts/spaceParts_004.png',
            'assets/images/Sprites/Parts/spaceParts_005.png',
            'assets/images/Sprites/Parts/spaceParts_006.png',
            'assets/images/Sprites/Parts/spaceParts_007.png',
            'assets/images/Sprites/Parts/spaceParts_008.png',
            'assets/images/Sprites/Parts/spaceParts_009.png',
            'assets/images/Sprites/Parts/spaceParts_010.png',
            'assets/images/Sprites/Parts/spaceParts_011.png',
            'assets/images/Sprites/Parts/spaceParts_012.png',
            'assets/images/Sprites/Parts/spaceParts_013.png',
            'assets/images/Sprites/Parts/spaceParts_014.png',
            'assets/images/Sprites/Parts/spaceParts_015.png',
            'assets/images/Sprites/Parts/spaceParts_016.png',
            'assets/images/Sprites/Parts/spaceParts_017.png',
            'assets/images/Sprites/Parts/spaceParts_018.png',
            'assets/images/Sprites/Parts/spaceParts_019.png',
            'assets/images/Sprites/Parts/spaceParts_020.png',
            'assets/images/Sprites/Parts/spaceParts_021.png',
            'assets/images/Sprites/Parts/spaceParts_022.png',
            'assets/images/Sprites/Parts/spaceParts_023.png',
            'assets/images/Sprites/Parts/spaceParts_024.png',
            'assets/images/Sprites/Parts/spaceParts_025.png',
            'assets/images/Sprites/Parts/spaceParts_026.png',
            'assets/images/Sprites/Parts/spaceParts_027.png',
            'assets/images/Sprites/Parts/spaceParts_028.png',
            'assets/images/Sprites/Parts/spaceParts_029.png',
            'assets/images/Sprites/Parts/spaceParts_030.png'
        ];
        const spriteIndex = Math.floor(Math.random() * partSprites.length);
        this.sprite = loadSprite(partSprites[spriteIndex]);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.rotation += this.rotationSpeed;
        this.life--;
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                -this.width / 2, 
                -this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback
            ctx.fillStyle = this.color;
            ctx.fillRect(-7, -7, 14, 14);
        }
        
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

export class Shield2D extends Entity2D {
    constructor(x, y) {
        super(x, y, 90, 70);
        this.health = 5;
        this.maxHealth = 5;
        
        // Use building sprites for shields - ALL 25 building options!
        const buildingSprites = [
            'assets/images/Sprites/Building/spaceBuilding_001.png',
            'assets/images/Sprites/Building/spaceBuilding_002.png',
            'assets/images/Sprites/Building/spaceBuilding_003.png',
            'assets/images/Sprites/Building/spaceBuilding_004.png',
            'assets/images/Sprites/Building/spaceBuilding_005.png',
            'assets/images/Sprites/Building/spaceBuilding_006.png',
            'assets/images/Sprites/Building/spaceBuilding_007.png',
            'assets/images/Sprites/Building/spaceBuilding_008.png',
            'assets/images/Sprites/Building/spaceBuilding_009.png',
            'assets/images/Sprites/Building/spaceBuilding_010.png',
            'assets/images/Sprites/Building/spaceBuilding_011.png',
            'assets/images/Sprites/Building/spaceBuilding_012.png',
            'assets/images/Sprites/Building/spaceBuilding_013.png',
            'assets/images/Sprites/Building/spaceBuilding_014.png',
            'assets/images/Sprites/Building/spaceBuilding_015.png',
            'assets/images/Sprites/Building/spaceBuilding_016.png',
            'assets/images/Sprites/Building/spaceBuilding_017.png',
            'assets/images/Sprites/Building/spaceBuilding_018.png',
            'assets/images/Sprites/Building/spaceBuilding_019.png',
            'assets/images/Sprites/Building/spaceBuilding_020.png',
            'assets/images/Sprites/Building/spaceBuilding_021.png',
            'assets/images/Sprites/Building/spaceBuilding_022.png',
            'assets/images/Sprites/Building/spaceBuilding_023.png',
            'assets/images/Sprites/Building/spaceBuilding_024.png',
            'assets/images/Sprites/Building/spaceBuilding_025.png'
        ];
        const spriteIndex = Math.floor(Math.random() * buildingSprites.length);
        this.sprite = loadSprite(buildingSprites[spriteIndex]);
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        const alpha = (this.health / this.maxHealth) * 0.9;
        ctx.globalAlpha = alpha;
        
        if (this.sprite.complete) {
            ctx.drawImage(
                this.sprite, 
                this.x - this.width / 2, 
                this.y - this.height / 2, 
                this.width, 
                this.height
            );
        } else {
            // Fallback
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.fillRect(this.x - 45, this.y - 35, 90, 70);
            ctx.strokeStyle = '#00ff41';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 45, this.y - 35, 90, 70);
        }
        
        ctx.globalAlpha = 1;
    }
}

export class Starfield2D {
    constructor(count = 200) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.5
            });
        }
    }

    update() {
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > window.innerHeight) {
                star.y = 0;
                star.x = Math.random() * window.innerWidth;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ffffff';
        for (const star of this.stars) {
            ctx.globalAlpha = star.alpha;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

