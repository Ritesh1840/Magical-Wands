/* ==========================================================================
   Stars & Constellations Wand Module (Make a Wish Experience)
   ========================================================================== */
import { drawHandStar, drawHandLine } from '../artAssets.js';

export class StarWand {
    constructor() {
        this.stars = [];
        this.floatingStars = [];
        this.particles = [];
        this.lastStarPos = null;
        this.starDistance = 35;
        this.state = 'IDLE'; // IDLE, CHARGING, RELEASED
    }

    reset() {
        this.stars = [];
        this.floatingStars = [];
        this.particles = [];
        this.lastStarPos = null;
        this.state = 'IDLE';
    }

    updateAndRender(ctx, width, height, handData, offsetX = 0, offsetY = 0, gestureTextElem = null) {
        // Process Hand Input
        if (handData && handData.detected) {
            handData.hands.forEach(hand => {
                const posX = offsetX + hand.indexTip.x * width;
                const posY = offsetY + hand.indexTip.y * height;

                if (hand.gesture === 'pointing') {
                    if (this.state === 'IDLE') {
                        this.tryPlaceStar(posX, posY);
                    }
                } else if (hand.gesture === 'fist') {
                    if (this.state === 'IDLE' && this.stars.length > 0) {
                        this.state = 'CHARGING';
                        this.chargeStars();
                        if (gestureTextElem) gestureTextElem.textContent = "Open your hand and make a wish!";
                    }
                } else if (hand.gesture === 'open_palm') {
                    if (this.state === 'CHARGING') {
                        this.makeWish();
                    }
                }
            });
        } else {
            this.lastStarPos = null;
        }

        // Draw Constellation Connection Lines for IDLE/CHARGING stars
        if (this.stars.length > 1) {
            ctx.save();
            ctx.strokeStyle = this.state === 'CHARGING' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(200, 220, 255, 0.2)';
            ctx.lineWidth = this.state === 'CHARGING' ? 2 : 1;

            for (let i = 0; i < this.stars.length - 1; i++) {
                const s1 = this.stars[i];
                const s2 = this.stars[i + 1];
                drawHandLine(ctx, s1.x, s1.y, s2.x, s2.y);
            }
            ctx.restore();
        }

        // Update & Render Placed Stars (Seed / Charged)
        this.stars.forEach((s) => {
            s.rotation += s.vRot;
            
            // Pulse size when charged by fist
            if (this.state === 'CHARGING') {
                s.pulseAngle += 0.15;
                s.currentSize = s.baseSize * 1.5 + Math.sin(s.pulseAngle) * 5;
                s.opacity = 0.8 + Math.sin(s.pulseAngle) * 0.2;
            } else {
                s.currentSize = s.baseSize;
            }

            drawHandStar(ctx, s.x, s.y, s.currentSize, s.points, s.rotation, s.color, true, s.opacity);
        });

        // Update & Render Particles (Explosion effect)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.opacity -= 0.02;
            
            if (p.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Update & Render Floating Stars (Wish Released)
        for (let i = this.floatingStars.length - 1; i >= 0; i--) {
            const fs = this.floatingStars[i];
            fs.x += fs.vx;
            fs.y += fs.vy;
            
            // Gentle upward drift
            fs.vy -= 0.02; // slow acceleration upwards
            
            // Twinkle effect
            fs.pulseAngle += 0.05;
            const twinkleOpacity = 0.5 + Math.sin(fs.pulseAngle) * 0.5;

            // Optional fade out as they float very high
            if (fs.y < -100) {
                this.floatingStars.splice(i, 1);
                continue;
            }

            drawHandStar(ctx, fs.x, fs.y, fs.size, fs.points, fs.rotation, fs.color, true, twinkleOpacity);
        }
    }

    tryPlaceStar(x, y) {
        if (this.lastStarPos) {
            const dist = Math.hypot(x - this.lastStarPos.x, y - this.lastStarPos.y);
            if (dist < this.starDistance) return;
        }

        if (this.stars.length > 50) {
            this.stars.shift();
        }

        // Dim 'seed' star properties
        const newStar = {
            x,
            y,
            baseSize: 6 + Math.random() * 4,
            currentSize: 6,
            points: Math.random() > 0.4 ? 4 : 5,
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.01,
            color: '#a0c4ff', // Dim blueish white
            opacity: 0.4, // Dim
            pulseAngle: Math.random() * Math.PI * 2
        };

        this.stars.push(newStar);
        this.lastStarPos = { x, y };
    }

    chargeStars() {
        if (this.stars.length === 0) return;
        
        const chargedColors = ['#ffd166', '#ffffff', '#e0aaff', '#9bf6ff'];
        
        this.stars.forEach(s => {
            s.color = chargedColors[Math.floor(Math.random() * chargedColors.length)];
            
            // Particle Explosion for each star
            for(let i=0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 5;
                this.particles.push({
                    x: s.x,
                    y: s.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1 + Math.random() * 2,
                    color: s.color,
                    opacity: 1
                });
            }
        });
    }

    makeWish() {
        this.state = 'RELEASED';
        const container = document.getElementById('app-container');
        if (container) {
            container.classList.add('wish-made');
        }

        // Transfer to floating stars
        this.stars.forEach(s => {
            this.floatingStars.push({
                x: s.x,
                y: s.y,
                vx: (Math.random() - 0.5) * 1.5, // Gentle horizontal drift
                vy: -1 - Math.random() * 2, // Gentle upward drift
                size: s.currentSize,
                points: s.points,
                color: s.color,
                rotation: s.rotation,
                pulseAngle: s.pulseAngle
            });
        });

        this.stars = [];
        
        // Reset state after a long time to allow placing new stars
        setTimeout(() => {
            this.state = 'IDLE';
            if (container) container.classList.remove('wish-made');
            const gestureText = document.getElementById('gesture-text');
            if (gestureText) gestureText.textContent = 'Point to place a star';
        }, 15000); // 15 seconds to enjoy the wish
    }
}
