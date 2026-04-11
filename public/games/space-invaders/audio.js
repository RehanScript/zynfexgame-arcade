/**
 * Space Invaders - Audio Manager
 * Procedural sounds using Web Audio API
 * Developed by: Molla Samser (RSK World)
 * Website: https://rskworld.in
 * Copyright © 2026 RSK World. All rights reserved.
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const AudioManager = {
    muted: false,
    bgmOscillators: [],
    bgmGain: null,
    bgmBuffer: null,
    bgmSource: null,
    sounds: {}, // Cache for loaded audio buffers

    async init() {
        // Pre-load sound effects
        const soundFiles = {
            'shoot': './assets/images/Sound FX/shot 1.wav',
            'enemyShoot': './assets/images/Sound FX/shot 2.wav',
            'explosion': './assets/images/Sound FX/explosion.wav',
            'hit': './assets/images/Sound FX/hit.wav'
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                this.sounds[name] = await this.loadSound(path);
            } catch (e) {
                console.error(`Failed to load sound: ${path}`, e);
            }
        }
        
        // Load background music
        try {
            this.bgmBuffer = await this.loadSound('./assets/images/bg.mp3');
        } catch (e) {
            console.error("Failed to load bg.mp3", e);
        }
    },

    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioCtx.decodeAudioData(arrayBuffer);
    },

    playBuffer(buffer, volume = 0.2, pitchVariation = false) {
        if (!buffer || this.muted) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        // Add subtle pitch variation for realism
        if (pitchVariation) {
            source.playbackRate.value = 0.9 + Math.random() * 0.2;
        }

        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(audioCtx.destination);
        source.start(0);
    },

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
        } else {
            this.resumeBGM();
        }
    },

    stopBGM() {
        if (this.bgmSource) {
            this.bgmSource.stop();
            this.bgmSource = null;
        }
    },

    resumeBGM() {
        if (!this.muted && !this.bgmSource) {
            this.playBGM();
        }
    },

    playBGM() {
        if (this.muted || this.bgmSource) return;
        
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        this.bgmGain = audioCtx.createGain();
        this.bgmGain.gain.value = 0.4; // Music volume
        this.bgmGain.connect(audioCtx.destination);

        if (this.bgmBuffer) {
            this.bgmSource = audioCtx.createBufferSource();
            this.bgmSource.buffer = this.bgmBuffer;
            this.bgmSource.loop = true;
            this.bgmSource.connect(this.bgmGain);
            this.bgmSource.start(0);
        } else {
            // Fallback to procedural drone if no buffer
            this.playProceduralBGM();
        }
    },

    playProceduralBGM() {
        // ... (previous procedural code)
        const frequencies = [55, 82.5, 110, 165];
        frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            osc.connect(this.bgmGain);
            osc.start();
            this.bgmOscillators.push(osc);
        });
    },

    stopBGM() {
        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.bgmOscillators = [];
        this.bgmPlaying = false;
    },

    playShoot() {
        if (this.sounds['shoot']) {
            this.playBuffer(this.sounds['shoot'], 0.15, true);
        } else {
            // Fallback...
            // Fallback to procedural
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.15);
        }
    },

    playEnemyShoot() {
        if (this.sounds['enemyShoot']) {
            this.playBuffer(this.sounds['enemyShoot'], 0.1, true);
        } else {
            // Fallback...
            // Fallback to procedural
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.2);
        }
    },

    playExplosion() {
        if (this.sounds['explosion']) {
            this.playBuffer(this.sounds['explosion'], 0.3, true);
        } else {
            // Fallback to procedural
            const now = audioCtx.currentTime;
            const duration = 0.4;
            
            const bufferSize = audioCtx.sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + duration);
            
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            
            source.start(now);
        }
    },

    playShieldHit() {
        if (this.sounds['hit']) {
            this.playBuffer(this.sounds['hit'], 0.15, true);
        } else {
            // Procedural metallic clang fallback
            const now = audioCtx.currentTime;
            [800, 1200, 1600].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'triangle';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0.1, now + i * 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3 + i * 0.02);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now + i * 0.02);
                osc.stop(now + 0.3 + i * 0.02);
            });
        }
    },

    playHit() {
        if (this.sounds['hit']) {
            this.playBuffer(this.sounds['hit'], 0.25);
        } else {
            // Fallback to procedural
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.3);
        }
    },

    playShieldUp() {
        if (this.muted) return;
        // Shield activation
        const now = audioCtx.currentTime;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
    },

    playGameOver() {
        if (this.muted) return;
        // Sad descending arpeggio
        const now = audioCtx.currentTime;
        [440, 349, 294, 220].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.2, now + i * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.4);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now + i * 0.3);
            osc.stop(now + i * 0.3 + 0.4);
        });
    },

    playPowerUp() {
        if (this.muted) return;
        // Play an ascending arpeggio with shimmer
        const now = audioCtx.currentTime;
        [440, 554, 659, 880, 1109].forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, i * 60);
        });
    },

    playSound(frequency, type, volume, duration, slide) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        if (slide) {
            osc.frequency.exponentialRampToValueAtTime(frequency + slide, audioCtx.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },

    playNoise(volume, duration) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        source.connect(gain);
        gain.connect(audioCtx.destination);
        
        source.start();
    }
};
