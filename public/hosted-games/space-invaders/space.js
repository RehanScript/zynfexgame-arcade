/**
 * Space Invaders - 2D Main Logic
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

import { Engine2D } from './engine2d.js';
import { Ship2D, Alien2D, Bullet2D, Meteor2D, PowerUp2D, Particle2D, Shield2D, Boss2D, Starfield2D } from './entities2d.js';
import { AudioManager } from './audio.js';
import { StorageManager } from './storage.js';

let engine, ship, starfield;
let aliens = [], bullets = [], meteors = [], powerups = [], particles = [], shields = [];
let boss = null;
let score = 0, level = 1, lives = 3;
let gameOver = false, gameStarted = false, paused = false;
let lastShot = 0;
const keys = {};

// global handlers
window.selectShip = (type) => {
    selectedShipType = type;
    document.querySelectorAll('.ship-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    const selectedOpt = document.querySelector(`[data-ship="${type}"]`);
    if (selectedOpt) selectedOpt.classList.add('selected');
};

window.toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

window.togglePause = () => {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    document.getElementById('pause-overlay')?.classList.toggle('hidden', !paused);
};

window.toggleMute = () => {
    AudioManager.toggleMute();
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.innerHTML = AudioManager.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
};

// Power-up states
let powerupState = {
    rapidFire: false,
    rapidFireEnd: 0,
    multiShot: false,
    multiShotEnd: 0,
    speedBoost: false,
    speedBoostEnd: 0
};

// Player invincibility after being hit
let playerInvincible = false;
let playerInvincibleEnd = 0;
const INVINCIBILITY_DURATION = 2000; // 2 seconds

// Easy mode - no lives lost when hit
let easyMode = false;

// Selected ship type
let selectedShipType = 'fighter';

// Wave and Survival tracking
let isWaveTransition = false;
let waveCountdown = 0;
let survivalTimeStart = 0;
let survivalTime = 0;
let currentWaveTimer = 0;
let lastSpawnTime = 0;
let spawningActive = false;

const BOUNDS = { x: 400, y: 300 };

window.onload = async () => {
    engine = new Engine2D("game-canvas");
    await AudioManager.init();
    updateUI(); // Initial HUD update
    
    document.getElementById("start-btn").onclick = startGame;
    document.getElementById("restart-btn").onclick = startGame;
    document.getElementById("fullscreen-btn").onclick = window.toggleFullScreen;
    document.getElementById("pause-btn").onclick = window.togglePause;
    document.getElementById("mute-btn").onclick = window.toggleMute;
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    
    // Mobile controls
    setupMobileControls();
    
    animate();
};

function startGame() {
    // Check easy mode toggle
    const easyModeToggle = document.getElementById('easy-mode-toggle');
    easyMode = easyModeToggle ? easyModeToggle.checked : false;
    
    initGame();
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("game-over-overlay").classList.add("hidden");
    document.body.classList.add("in-game");
    gameStarted = true;
    gameOver = false;
    paused = false;
    
    // Start background music
    AudioManager.playBGM();
}

function initGame() {
    ship = new Ship2D(window.innerWidth, window.innerHeight, selectedShipType);
    starfield = new Starfield2D(200);
    
    // Add shields
    shields = [];
    const shieldXPositions = [window.innerWidth * 0.2, window.innerWidth * 0.4, window.innerWidth * 0.6, window.innerWidth * 0.8];
    for (const x of shieldXPositions) {
        const shield = new Shield2D(x, window.innerHeight - 150);
        shields.push(shield);
    }
    
    aliens = [];
    bullets = [];
    meteors = [];
    powerups = [];
    particles = [];
    boss = null;
    
    score = 0;
    level = 1;
    lives = 3;
    
    resetPowerups();
    
    survivalTimeStart = Date.now();
    survivalTime = 0;
    isWaveTransition = false;
    waveCountdown = 0;
    currentWaveTimer = 0;
    spawningActive = false;
    
    const durationSlider = document.getElementById('wave-duration');
    const durationVal = document.getElementById('duration-val');
    durationSlider.oninput = () => {
        durationVal.textContent = durationSlider.value + 's';
    };

    spawnWave();
    updateUI();
}

function resetPowerups() {
    powerupState = {
        rapidFire: false,
        rapidFireEnd: 0,
        multiShot: false,
        multiShotEnd: 0,
        speedBoost: false,
        speedBoostEnd: 0
    };
    if (ship) {
        ship.speed = ship.fireRate || 8;
        ship.deactivateShield();
    }
}

function spawnWave() {
    // Check for boss level
    if (level % 5 === 0) {
        boss = new Boss2D(level, window.innerWidth, window.innerHeight);
        showWaveMessage(`BOSS LEVEL ${level}!`);
        spawningActive = false;
        return;
    }
    
    // Survival Mode Wave
    currentWaveTimer = parseInt(document.getElementById('wave-duration').value) * 1000;
    spawningActive = true;
    lastSpawnTime = 0;
    
    showWaveMessage(`WAVE ${level} - SURVIVE!`);
}

function spawnSmallGroup() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    const count = 3 + Math.floor(level / 2);
    const shooterChance = Math.min(0.1 + level * 0.02, 0.5);
    
    for (let i = 0; i < count; i++) {
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        const padding = 100;
        const type = Math.random() < shooterChance ? 'shooter' : 'basic';
        
        if (edge === 0) { x = Math.random() * engine.width; y = -padding; }
        else if (edge === 1) { x = engine.width + padding; y = Math.random() * engine.height; }
        else if (edge === 2) { x = Math.random() * engine.width; y = engine.height + padding; }
        else { x = -padding; y = Math.random() * engine.height; }

        const targetX = engine.width / 2 + (Math.random() - 0.5) * 400;
        const targetY = engine.height / 2 + (Math.random() - 0.5) * 400;
        const angle = Math.atan2(targetY - y, targetX - x);
        
        const alien = new Alien2D(x, y, colors[Math.floor(Math.random() * colors.length)], type);
        alien.vx = Math.cos(angle) * (1.5 + level * 0.2);
        alien.vy = Math.sin(angle) * (1.5 + level * 0.2);
        aliens.push(alien);
    }
}

function showWaveMessage(text) {
    const msg = document.getElementById('wave-message');
    msg.textContent = text;
    msg.classList.remove('hidden');
    msg.classList.add('show');
    setTimeout(() => {
        msg.classList.remove('show');
        msg.classList.add('hidden');
    }, 2000);
}

function spawnPowerUp(x, y) {
    const types = ['rapid', 'shield', 'multishot', 'speed', 'life'];
    const type = types[Math.floor(Math.random() * types.length)];
    const powerup = new PowerUp2D(x, y, type);
    powerups.push(powerup);
}

function createExplosion(x, y, color = '#ffaa00', count = 20) {
    for (let i = 0; i < count; i++) {
        const particle = new Particle2D(x, y, color);
        particles.push(particle);
    }
}

function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const deltaTime = 16.67; // Approx for 60fps
    
    // Update survival time
    if (!gameOver && !paused && gameStarted) {
        survivalTime = Math.floor((now - survivalTimeStart) / 1000);
    }
    
    // Clear canvas
    engine.clear();
    
    if (!gameStarted || gameOver || paused) {
        if (starfield) starfield.draw(engine.ctx);
        return;
    }

    // Update powerup states
    updatePowerupStates(now);

    // Starfield
    if (starfield) {
        starfield.update();
        starfield.draw(engine.ctx);
    }

    // Ship Movement and Firing
    if (ship && ship.alive) {
        if (keys['ArrowLeft'] || keys['KeyA']) ship.move('left');
        else ship.stop('left');
        if (keys['ArrowRight'] || keys['KeyD']) ship.move('right');
        else ship.stop('right');
        if (keys['ArrowUp'] || keys['KeyW']) ship.move('up');
        else ship.stop('up');
        if (keys['ArrowDown'] || keys['KeyS']) ship.move('down');
        else ship.stop('down');
        
        if (keys['Space']) fireBullet();
        
        if (powerupState.speedBoost) {
            ship.speed = 18;
        } else {
            ship.speed = 8;
        }

        ship.update();
        ship.draw(engine.ctx);
    }

    // Boss Logic
    if (boss) {
        const shouldShoot = boss.update(now);
        if (shouldShoot) {
            for (let i = -1; i <= 1; i++) {
                const b = new Bullet2D(boss.x + i * 60, boss.y + 40, 0, true);
                bullets.push(b);
            }
        }
        
        // Check boss collision with player bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (!b.isEnemy && boss.intersects(b)) {
                boss.takeDamage(1);
                createExplosion(b.x, b.y, '#ff0000', 10);
                bullets.splice(i, 1);
                
                if (!boss.alive) {
                    createExplosion(boss.x, boss.y, '#ff0000', 50);
                    score += 1000 + level * 100;
                    AudioManager.playExplosion();
                    boss = null;
                    setTimeout(() => {
                        level++;
                        spawnWave();
                    }, 2000);
                }
                break;
            }
        }
        
        // Boss collision with player
        if (boss && ship.intersects(boss)) {
            if (!ship.shieldActive && !playerInvincible) {
                handlePlayerHit();
            }
        }
        
        if (boss) boss.draw(engine.ctx);
    }

    // Aliens Logic
    for (let i = aliens.length - 1; i >= 0; i--) {
        const a = aliens[i];
        const shooting = a.update(now);
        
        // Alien shooting logic - aim at player
        if (shooting && a.canShoot) {
            const angle = Math.atan2(ship.y - a.y, ship.x - a.x) + Math.PI / 2;
            const b = new Bullet2D(a.x, a.y, angle, true);
            bullets.push(b);
            AudioManager.playEnemyShoot();
        }

        // Remove alien only if it is far off-screen in any direction
        const pad = 200;
        if (a.x < -pad || a.x > engine.width + pad || a.y < -pad || a.y > engine.height + pad) {
            aliens.splice(i, 1);
            continue;
        }

        // Only damage on actual collision with ship
        if (ship.intersects(a)) {
            if (!ship.shieldActive && !playerInvincible) {
                handlePlayerHit();
            }
            createExplosion(a.x, a.y, '#ffaa00', 15);
            aliens.splice(i, 1);
            continue;
        }
        
        a.draw(engine.ctx);
    }

    // Bullets Logic
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.update();
        
        if (!b.alive) {
            bullets.splice(i, 1);
            continue;
        }

        // Enemy bullets hitting player
        if (b.isEnemy && ship.intersects(b)) {
            if (ship.shieldActive) {
                createExplosion(b.x, b.y, '#00ffff', 8);
            } else {
                handlePlayerHit();
            }
            bullets.splice(i, 1);
            continue;
        }

        // Only enemy bullets hit shields
        if (b.isEnemy) {
            for (let s = shields.length - 1; s >= 0; s--) {
                if (shields[s].intersects(b)) {
                    shields[s].takeDamage();
                    createExplosion(b.x, b.y, '#00ff41', 8);
                    AudioManager.playShieldHit();
                    bullets.splice(i, 1);
                    if (!shields[s].alive) {
                        shields.splice(s, 1);
                    }
                    break;
                }
            }
        }

        // Player bullets hitting aliens
        if (!b.isEnemy) {
            for (let j = aliens.length - 1; j >= 0; j--) {
                const a = aliens[j];
                if (b.intersects(a)) {
                    score += a.type === 'shooter' ? 150 : 100;
                    createExplosion(a.x, a.y, '#ffaa00', 15);
                    AudioManager.playExplosion();
                    
                    // Chance to spawn powerup
                    if (Math.random() < 0.15) {
                        spawnPowerUp(a.x, a.y);
                    }
                    
                    aliens.splice(j, 1);
                    bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // Player bullets hitting meteors (asteroids)
        if (!b.isEnemy) {
            for (let m = meteors.length - 1; m >= 0; m--) {
                const meteor = meteors[m];
                if (b.intersects(meteor)) {
                    bullets.splice(i, 1);
                    const destroyed = meteor.takeDamage();
                    createExplosion(b.x, b.y, '#886644', 8);
                    
                    if (destroyed) {
                        score += 50; // Points for destroying meteor
                        createExplosion(meteor.x, meteor.y, '#886644', 20);
                        AudioManager.playExplosion();
                        meteors.splice(m, 1);
                    }
                    break;
                }
            }
        }
        
        b.draw(engine.ctx);
    }

    // Powerups Logic
    for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i];
        p.update();
        
        if (ship.intersects(p)) {
            applyPowerUp(p.type);
            powerups.splice(i, 1);
            AudioManager.playPowerUp();
        } else if (!p.alive) {
            powerups.splice(i, 1);
        } else {
            p.draw(engine.ctx);
        }
    }

    // Meteors Logic
    if (Math.random() < 0.01 + level * 0.003) {
        const m = new Meteor2D(BOUNDS);
        meteors.push(m);
    }
    
    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.update();
        
        // Meteors destroy shields
        for (let s = shields.length - 1; s >= 0; s--) {
            if (shields[s].intersects(m)) {
                shields[s].takeDamage();
                shields[s].takeDamage();
                createExplosion(m.x, m.y, '#886644', 12);
                if (!shields[s].alive) {
                    shields.splice(s, 1);
                }
                meteors.splice(i, 1);
                break;
            }
        }
        
        if (i >= meteors.length) continue;
        
        if (ship.intersects(m)) {
            // Meteor no longer damages player per user request
            createExplosion(m.x, m.y, '#886644', 15);
            meteors.splice(i, 1);
        } else if (!m.alive) {
            meteors.splice(i, 1);
        } else {
            m.draw(engine.ctx);
        }
    }

    // Particles update
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (!p.alive) {
            particles.splice(i, 1);
        } else {
            p.draw(engine.ctx);
        }
    }

    // Draw shields
    for (const shield of shields) {
        shield.draw(engine.ctx);
    }

    // Spawning logic during wave
    if (spawningActive && currentWaveTimer > 0) {
        currentWaveTimer -= deltaTime;
        if (now - lastSpawnTime > 3000 - Math.min(level * 100, 2000)) {
            lastSpawnTime = now;
            spawnSmallGroup();
        }
    } else if (spawningActive) {
        spawningActive = false; // Duration ended
    }

    // Check wave complete (Duration ended and all enemies cleared)
    if (!boss && !spawningActive && aliens.length === 0) {
        if (!isWaveTransition) {
            isWaveTransition = true;
            waveCountdown = 5000; // 5 seconds in ms
            AudioManager.playLevelUp?.();
        }
        
        waveCountdown -= deltaTime;
        
        // Draw countdown
        engine.ctx.save();
        engine.ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
        engine.ctx.font = 'bold 42px "Courier New", Courier, monospace';
        engine.ctx.textAlign = 'center';
        engine.ctx.shadowColor = 'rgba(0, 255, 65, 0.5)';
        engine.ctx.shadowBlur = 15;
        engine.ctx.fillText(`NEXT WAVE IN: ${Math.ceil(waveCountdown / 1000)}s`, engine.width / 2, engine.height / 2);
        
        // Timer display during wave
        if (spawningActive || currentWaveTimer > 0) {
             // Already handled by HUD, but can show more here
        }

        // Add a survival bonus hint
        engine.ctx.font = '18px "Courier New", Courier, monospace';
        engine.ctx.fillText('STAY ALERT - SENSORS DETECTING NEW ENEMIES', engine.width / 2, engine.height / 2 + 50);
        engine.ctx.restore();
        
        if (waveCountdown <= 0) {
            isWaveTransition = false;
            level++;
            spawnWave();
        }
    }

    updateUI();
}

function updatePowerupStates(time) {
    if (powerupState.rapidFire && time > powerupState.rapidFireEnd) {
        powerupState.rapidFire = false;
    }
    if (powerupState.multiShot && time > powerupState.multiShotEnd) {
        powerupState.multiShot = false;
    }
    if (powerupState.speedBoost && time > powerupState.speedBoostEnd) {
        powerupState.speedBoost = false;
        ship.speed = 10;
    }
    
    // Update invincibility
    if (playerInvincible && time > playerInvincibleEnd) {
        playerInvincible = false;
    }
}

function applyPowerUp(type) {
    const now = Date.now();
    switch(type) {
        case 'rapid':
            powerupState.rapidFire = true;
            powerupState.rapidFireEnd = now + 5000;
            showPowerupMessage('RAPID FIRE!');
            break;
        case 'shield':
            ship.activateShield(5000);
            AudioManager.playShieldUp();
            showPowerupMessage('SHIELD ACTIVE!');
            break;
        case 'multishot':
            powerupState.multiShot = true;
            powerupState.multiShotEnd = now + 5000;
            showPowerupMessage('MULTI SHOT!');
            break;
        case 'speed':
            powerupState.speedBoost = true;
            powerupState.speedBoostEnd = now + 5000;
            showPowerupMessage('SPEED BOOST!');
            break;
        case 'life':
            lives = Math.min(lives + 1, 5);
            showPowerupMessage('EXTRA LIFE!');
            break;
    }
    updateUI();
}

function showPowerupMessage(text) {
    const msg = document.getElementById('powerup-message');
    msg.textContent = text;
    msg.classList.remove('hidden');
    msg.style.animation = 'none';
    msg.offsetHeight; // Trigger reflow
    msg.style.animation = 'pulse 0.5s ease-in-out 3';
    setTimeout(() => {
        msg.classList.add('hidden');
    }, 1500);
}

function removeEntity(entity, array) {
    engine.scene.remove(entity.mesh);
    if (array && array.length > 0) {
        const idx = array.indexOf(entity);
        if (idx > -1) array.splice(idx, 1);
    }
}

function handleKeyDown(e) {
    if (!gameStarted || gameOver) return;
    keys[e.code] = true;
    
    if (e.code === "Escape") {
        togglePause();
        return;
    }
    
    if (paused) return;
    
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }

    // Movement and firing logic moved to main loop for smoothness
    
    if (e.code === "Space") {
        fireBullet();
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') ship.stop('left');
    if (e.code === 'ArrowRight' || e.code === 'KeyD') ship.stop('right');
    if (e.code === 'ArrowUp' || e.code === 'KeyW') ship.stop('up');
    if (e.code === 'ArrowDown' || e.code === 'KeyS') ship.stop('down');
}

function fireBullet() {
    if (!ship || !ship.alive) return;
    
    const now = Date.now();
    const fireDelay = powerupState.rapidFire ? 100 : 250;
    if (now - lastShot < fireDelay) return;
    lastShot = now;
    
    if (powerupState.multiShot) {
        // Fire 3 bullets spread
        for (let i = -1; i <= 1; i++) {
            const b = new Bullet2D(ship.x, ship.y, ship.rotation + i * 0.2, false);
            bullets.push(b);
        }
    } else {
        const b = new Bullet2D(ship.x, ship.y, ship.rotation, false);
        bullets.push(b);
    }
    
    AudioManager.playShoot();
}

function handlePlayerHit() {
    if (playerInvincible) return; // Skip if invincible
    
    // In easy mode, no lives lost - just visual feedback
    if (easyMode) {
        AudioManager.playHit();
        
        // Visual feedback only
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 300);
        
        playerInvincible = true;
        playerInvincibleEnd = Date.now() + INVINCIBILITY_DURATION;
        
        // Blink effect (visual feedback only - 2D ship has no mesh.visible)
        playerInvincible = true;
        playerInvincibleEnd = Date.now() + INVINCIBILITY_DURATION;
        
        return; // No lives lost!
    }
    
    lives--;
    playerInvincible = true;
    playerInvincibleEnd = Date.now() + INVINCIBILITY_DURATION;
    
    AudioManager.playHit();
    
    // Screen shake effect
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);
    
    if (lives <= 0) endGame();
    updateUI();
}

function updateUI() {
    document.getElementById("score-val").innerText = score.toLocaleString();
    document.getElementById("level-val").innerText = level;
    document.getElementById("lives-val").innerHTML = '❤️'.repeat(lives) + '🖤'.repeat(5 - lives);
    
    // Update powerup indicators
    const rapidIndicator = document.getElementById('rapid-indicator');
    const multiIndicator = document.getElementById('multi-indicator');
    const speedIndicator = document.getElementById('speed-indicator');
    
    if (rapidIndicator) rapidIndicator.classList.toggle('active', powerupState.rapidFire);
    if (multiIndicator) multiIndicator.classList.toggle('active', powerupState.multiShot);
    if (speedIndicator) speedIndicator.classList.toggle('active', powerupState.speedBoost);
    
    // Boss health bar
    const bossHealth = document.getElementById('boss-health-container');
    const bossHealthBar = document.getElementById('boss-health-bar');
    if (bossHealth && bossHealthBar) {
        if (boss) {
            bossHealth.classList.remove('hidden');
            const healthPercent = (boss.health / boss.maxHealth) * 100;
            bossHealthBar.style.width = `${healthPercent}%`;
        } else {
            bossHealth.classList.add('hidden');
        }
    }
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    document.body.classList.remove("in-game");
    
    // Stop background music
    AudioManager.stopBGM();
    
    const playerName = document.getElementById('player-name')?.value || "Pilot";
    StorageManager.saveScore({ name: playerName, score: score, level: level });
    
    document.getElementById("final-score").innerText = score.toLocaleString();
    document.getElementById("final-level").innerText = level;
    
    // Update high scores list
    const scores = StorageManager.getScores();
    const list = document.getElementById("high-score-list");
    list.innerHTML = scores.map((s, i) => 
        `<li><span class="rank">#${i + 1}</span> <span class="name">${s.name}</span> <span class="score">${s.score.toLocaleString()}</span></li>`
    ).join('');
    
    document.getElementById("game-over-overlay").classList.remove("hidden");
    AudioManager.playGameOver();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function togglePause() {
    if (!gameStarted || gameOver) return;
    paused = !paused;
    document.getElementById('pause-overlay')?.classList.toggle('hidden', !paused);
}

function toggleMute() {
    AudioManager.toggleMute();
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.innerHTML = AudioManager.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
}

function setupMobileControls() {
    const dpad = document.getElementById('mobile-dpad');
    if (!dpad) return;
    
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        dpad.classList.remove('hidden');
        
        const up = document.getElementById('btn-up');
        const down = document.getElementById('btn-down');
        const left = document.getElementById('btn-left');
        const right = document.getElementById('btn-right');
        const fire = document.getElementById('btn-fire');
        
        const handleTouch = (btn, dir) => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (gameStarted && !paused && !gameOver) {
                    ship.move(dir);
                }
            });
        };
        
        if (up) handleTouch(up, 'up');
        if (down) handleTouch(down, 'down');
        if (left) handleTouch(left, 'left');
        if (right) handleTouch(right, 'right');
        
        if (fire) {
            fire.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (gameStarted && !paused && !gameOver) {
                    fireBullet();
                }
            });
        }
    }
}