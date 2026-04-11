/**
 * Space Invaders - 3D Entities (Pure Geometries)
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { CONFIG } from './constants.js';

export class Entity3D {
    constructor(group) {
        this.mesh = group;
        this.alive = true;
    }

    update() {}
    
    get position() { return this.mesh.position; }
    get box() { return new THREE.Box3().setFromObject(this.mesh); }
}

export class Ship3D extends Entity3D {
    constructor() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeo = new THREE.ConeGeometry(20, 60, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Wings
        const wingGeo = new THREE.BoxGeometry(80, 5, 20);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
        const wings = new THREE.Mesh(wingGeo, wingMat);
        wings.position.z = -10;
        group.add(wings);

        // Cockpit
        const cockpitGeo = new THREE.SphereGeometry(10, 16, 16);
        const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 });
        const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
        cockpit.position.y = 10;
        cockpit.position.z = 5;
        group.add(cockpit);

        // Engine glow
        const engineGeo = new THREE.CylinderGeometry(8, 12, 15, 8);
        const engineMat = new THREE.MeshBasicMaterial({ color: 0x00ff41 });
        const engine = new THREE.Mesh(engineGeo, engineMat);
        engine.rotation.x = Math.PI / 2;
        engine.position.z = -35;
        group.add(engine);

        super(group);
        this.mesh.position.y = -300;
        this.speed = 10;
        this.shieldActive = false;
        this.shieldMesh = null;
    }

    move(dir, bounds) {
        if (dir === 'left' && this.mesh.position.x > -bounds.x) {
            this.mesh.position.x -= this.speed;
            this.mesh.rotation.z = Math.max(this.mesh.rotation.z - 0.05, -0.3);
        }
        if (dir === 'right' && this.mesh.position.x < bounds.x) {
            this.mesh.position.x += this.speed;
            this.mesh.rotation.z = Math.min(this.mesh.rotation.z + 0.05, 0.3);
        }
        if (dir === 'up' && this.mesh.position.y < bounds.y) {
            this.mesh.position.y += this.speed;
            this.mesh.rotation.x = Math.max(this.mesh.rotation.x - 0.05, -0.3);
        }
        if (dir === 'down' && this.mesh.position.y > -bounds.y) {
            this.mesh.position.y -= this.speed;
            this.mesh.rotation.x = Math.min(this.mesh.rotation.x + 0.05, 0.3);
        }
        
        // Auto-righting
        this.mesh.rotation.x *= 0.95;
        this.mesh.rotation.z *= 0.95;
    }

    activateShield(duration = 5000) {
        if (this.shieldMesh) return;
        
        const shieldGeo = new THREE.SphereGeometry(50, 16, 16);
        const shieldMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.3,
            wireframe: true
        });
        this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        this.mesh.add(this.shieldMesh);
        this.shieldActive = true;
        
        setTimeout(() => {
            this.deactivateShield();
        }, duration);
    }

    deactivateShield() {
        if (this.shieldMesh) {
            this.mesh.remove(this.shieldMesh);
            this.shieldMesh = null;
        }
        this.shieldActive = false;
    }
}

export class Alien3D extends Entity3D {
    constructor(color, x, y, z = 0, type = 'basic') {
        const group = new THREE.Group();
        
        // Saucer
        const saucerGeo = new THREE.CylinderGeometry(25, 30, 10, 16);
        const saucerMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.5 });
        const saucer = new THREE.Mesh(saucerGeo, saucerMat);
        group.add(saucer);

        // Dome
        const domeGeo = new THREE.SphereGeometry(15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 5;
        group.add(dome);

        // Eyes for some types
        if (type === 'shooter') {
            const eyeGeo = new THREE.SphereGeometry(5, 8, 8);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-10, 5, 20);
            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(10, 5, 20);
            group.add(leftEye);
            group.add(rightEye);
        }

        super(group);
        this.mesh.position.set(x, y, z);
        this.velocity = new THREE.Vector3(1, 0, 0);
        this.type = type;
        this.canShoot = type === 'shooter';
        this.lastShot = 0;
        this.shootInterval = 2000 + Math.random() * 2000;
    }

    update(time) {
        this.mesh.position.add(this.velocity);
        this.mesh.rotation.y += 0.05;
        this.mesh.position.y += Math.sin(time * 0.005) * 0.5;
        
        // Shooting logic
        if (this.canShoot && time - this.lastShot > this.shootInterval) {
            this.lastShot = time;
            return true; // Signal to shoot
        }
        return false;
    }
}

export class Boss3D extends Entity3D {
    constructor(level) {
        const group = new THREE.Group();
        
        // Main body - larger saucer
        const bodyGeo = new THREE.CylinderGeometry(80, 100, 40, 16);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x880000, metalness: 0.7 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);

        // Dome
        const domeGeo = new THREE.SphereGeometry(50, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 20;
        group.add(dome);

        // Side cannons
        const cannonGeo = new THREE.CylinderGeometry(15, 15, 60, 8);
        const cannonMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        
        const leftCannon = new THREE.Mesh(cannonGeo, cannonMat);
        leftCannon.rotation.z = Math.PI / 2;
        leftCannon.position.set(-100, 0, 0);
        group.add(leftCannon);
        
        const rightCannon = new THREE.Mesh(cannonGeo, cannonMat);
        rightCannon.rotation.z = Math.PI / 2;
        rightCannon.position.set(100, 0, 0);
        group.add(rightCannon);

        // Health ring
        const ringGeo = new THREE.TorusGeometry(120, 5, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const healthRing = new THREE.Mesh(ringGeo, ringMat);
        healthRing.rotation.x = Math.PI / 2;
        group.add(healthRing);

        super(group);
        this.healthRing = healthRing;
        this.mesh.position.set(0, 0, -1500);
        this.maxHealth = 20 + level * 5;
        this.health = this.maxHealth;
        this.lastShot = 0;
        this.shootInterval = 800;
        this.movePattern = 0;
    }

    update(time) {
        // Complex movement pattern
        this.movePattern += 0.02;
        this.mesh.position.x = Math.sin(this.movePattern) * 300;
        this.mesh.position.y = Math.cos(this.movePattern * 0.5) * 100;
        this.mesh.position.z += 2;
        
        if (this.mesh.position.z > 400) {
            this.mesh.position.z = 400;
        }
        
        this.mesh.rotation.y += 0.02;
        this.healthRing.rotation.z += 0.05;
        
        // Update health ring color
        const healthPercent = this.health / this.maxHealth;
        this.healthRing.material.color.setHex(
            healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000
        );
        
        // Shooting
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
}

export class Bullet3D extends Entity3D {
    constructor(x, y, z, color = 0x00ff41, speed = 20, isEnemy = false) {
        const geometry = new THREE.CapsuleGeometry(3, 15, 4, 8);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.rotation.x = Math.PI / 2;
        super(mesh);
        this.speed = speed;
        this.isEnemy = isEnemy;
    }

    update() {
        this.mesh.position.z += this.isEnemy ? this.speed : -this.speed;
        if (this.mesh.position.z < -2000 || this.mesh.position.z > 1000) this.alive = false;
    }
}

export class Meteor3D extends Entity3D {
    constructor(bounds) {
        const size = Math.random() * 30 + 15;
        const geometry = new THREE.IcosahedronGeometry(size, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x886644, roughness: 1 });
        const mesh = new THREE.Mesh(geometry, material);
        
        const x = Math.random() * bounds.x * 2 - bounds.x;
        const y = Math.random() * bounds.y * 2 - bounds.y;
        mesh.position.set(x, y, -1500);
        super(mesh);
        this.speed = Math.random() * 5 + 5;
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05
        };
    }

    update() {
        this.mesh.position.z += this.speed;
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        if (this.mesh.position.z > 1000) this.alive = false;
    }
}

export class PowerUp3D extends Entity3D {
    constructor(x, y, z, type) {
        const group = new THREE.Group();
        
        // Outer ring
        const ringGeo = new THREE.TorusGeometry(20, 5, 8, 16);
        const colors = {
            'rapid': 0xff0000,
            'shield': 0x00ffff,
            'multishot': 0xffff00,
            'speed': 0x00ff00,
            'life': 0xff00ff
        };
        const ringMat = new THREE.MeshBasicMaterial({ color: colors[type] || 0xffffff });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        // Inner core
        const coreGeo = new THREE.OctahedronGeometry(12, 0);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);
        
        // Icon
        const iconGeo = new THREE.BoxGeometry(10, 10, 2);
        const iconMat = new THREE.MeshBasicMaterial({ color: colors[type] || 0xffffff });
        const icon = new THREE.Mesh(iconGeo, iconMat);
        icon.position.z = 5;
        group.add(icon);

        super(group);
        this.mesh.position.set(x, y, z);
        this.type = type;
        this.rotationSpeed = 0.03;
        this.bobSpeed = 0.002;
    }

    update(time) {
        this.mesh.rotation.y += this.rotationSpeed;
        this.mesh.rotation.x = Math.sin(time * this.bobSpeed) * 0.2;
        this.mesh.position.z += 2;
        if (this.mesh.position.z > 600) this.alive = false;
    }
}

export class Particle3D extends Entity3D {
    constructor(x, y, z, color = 0xffaa00, count = 15) {
        const group = new THREE.Group();
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 4 + 2;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.set(
                x + (Math.random() - 0.5) * 30,
                y + (Math.random() - 0.5) * 30,
                z + (Math.random() - 0.5) * 30
            );
            
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            particles.push(particle);
            group.add(particle);
        }
        
        super(group);
        this.particles = particles;
        this.lifetime = 60;
        this.age = 0;
    }

    update() {
        this.age++;
        const progress = this.age / this.lifetime;
        
        for (const p of this.particles) {
            p.position.add(p.velocity);
            p.velocity.multiplyScalar(0.95);
            p.rotation.x += 0.1;
            p.rotation.y += 0.1;
            p.material.opacity = 1 - progress;
        }
        
        if (this.age >= this.lifetime) {
            this.alive = false;
        }
    }
}

export class Starfield3D extends Entity3D {
    constructor(count = 1000) {
        const group = new THREE.Group();
        
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        
        const colorPalette = [
            new THREE.Color(0xffffff),
            new THREE.Color(0xaaaaff),
            new THREE.Color(0xffddaa)
        ];
        
        for (let i = 0; i < count; i++) {
            positions.push(
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 4000,
                (Math.random() - 0.5) * 4000 - 1000
            );
            
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors.push(color.r, color.g, color.b);
            sizes.push(Math.random() * 3 + 1);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const points = new THREE.Points(geometry, material);
        group.add(points);
        
        super(group);
        this.points = points;
        this.speed = 2;
    }

    update() {
        const positions = this.points.geometry.attributes.position.array;
        
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += this.speed;
            if (positions[i] > 1000) {
                positions[i] = -3000;
            }
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}

export class Shield3D extends Entity3D {
    constructor(x, y) {
        const group = new THREE.Group();
        
        // Main barrier
        const barrierGeo = new THREE.BoxGeometry(80, 60, 20);
        const barrierMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ff41,
            transparent: true,
            opacity: 0.6,
            emissive: 0x00ff41,
            emissiveIntensity: 0.3
        });
        const barrier = new THREE.Mesh(barrierGeo, barrierMat);
        group.add(barrier);
        
        // Frame
        const frameGeo = new THREE.BoxGeometry(85, 65, 15);
        const frameMat = new THREE.MeshBasicMaterial({ color: 0x004400, wireframe: true });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        group.add(frame);
        
        super(group);
        this.mesh.position.set(x, y, 0);
        this.health = 5;
        this.maxHealth = 5;
    }

    takeDamage() {
        this.health--;
        const healthPercent = this.health / this.maxHealth;
        this.mesh.children[0].material.opacity = 0.6 * healthPercent;
        this.mesh.children[0].material.emissiveIntensity = 0.3 * healthPercent;
        
        if (this.health <= 0) {
            this.alive = false;
        }
    }
}
