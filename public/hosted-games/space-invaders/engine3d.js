/**
 * Space Invaders - 3D Engine (Three.js)
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { CONFIG } from './constants.js';

export class Engine3D {
    constructor(containerId) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init(containerId);
    }

    init(containerId) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = "board-3d";

        this.camera.position.z = 600;
        this.camera.position.y = -200;
        this.camera.lookAt(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff41, 1, 1000);
        pointLight.position.set(0, 0, 500);
        this.scene.add(pointLight);

        // Background Nebula
        const loader = new THREE.TextureLoader();
        loader.load('./assets/images/nebula.png', (texture) => {
            this.scene.background = texture;
            this.scene.environment = texture;
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
