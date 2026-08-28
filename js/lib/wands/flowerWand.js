/* ==========================================================================
   Flowers Wand Module (Full Screen Edge-to-Edge, Continuous Trail & Big Blooms)
   ========================================================================== */
import { drawFlower, FlowerTypes } from '../artAssets.js';

export class FlowerWand {
    constructor() {
        this.flowers = []; // Active flowers
        this.lastPlantPos = null;
        this.plantThreshold = 5; // Tighter threshold for huge quantity
    }

    reset() {
        this.flowers = [];
        this.lastPlantPos = null;
    }

    updateAndRender(ctx, width, height, handData, offsetX = 0, offsetY = 0) {
        // Handle Hand Input
        if (handData && handData.detected) {
            handData.hands.forEach(hand => {
                const posX = offsetX + hand.indexTip.x * width;
                const posY = offsetY + hand.indexTip.y * height;

                if (hand.gesture === 'pointing') {
                    this.tryPlantFlower(posX, posY);
                } else if (hand.gesture === 'open_palm') {
                    this.triggerBounceFadeOff();
                }
            });
        } else {
            this.lastPlantPos = null;
        }

        // Update & Render Flowers
        for (let i = this.flowers.length - 1; i >= 0; i--) {
            const f = this.flowers[i];

            // Slow continuous organic rotation
            f.rotation += f.vRot;
            f.pulseAngle += f.pulseSpeed;

            // Elastic blooming animation
            if (f.scale < f.targetScale) {
                f.scale += (f.targetScale - f.scale) * 0.35;
            }

            // Bounce & Fade physics mode (when hand opened)
            if (f.isBouncing) {
                f.x += f.vx;
                f.y += f.vy;
                f.vy += 0.25; // Gravity
                f.opacity -= 0.008; // Fade out slowly

                // Bounce off canvas boundaries
                if (f.x <= 20) {
                    f.x = 20;
                    f.vx *= -0.8;
                } else if (f.x >= width - 20) {
                    f.x = width - 20;
                    f.vx *= -0.8;
                }

                if (f.y >= height - 20) {
                    f.y = height - 20;
                    f.vy *= -0.7;
                }

                if (f.opacity <= 0) {
                    this.flowers.splice(i, 1);
                    continue;
                }
            }

            // Cull completely faded out flowers from rendering to save draw calls
            if (f.opacity > 0) {
                const currentScale = f.scale + Math.sin(f.pulseAngle) * 0.08; // Slow beat effect
                drawFlower(ctx, f.x, f.y, currentScale, f.type, f.rotation, f.opacity);
            }
        }
    }

    tryPlantFlower(x, y) {
        if (this.lastPlantPos) {
            const dist = Math.hypot(x - this.lastPlantPos.x, y - this.lastPlantPos.y);
            if (dist < this.plantThreshold) return;
        }

        if (this.flowers.length > 600) {
            this.flowers.shift();
        }

        this.lastPlantPos = { x, y };

        const randomType = FlowerTypes[Math.floor(Math.random() * FlowerTypes.length)];

        this.flowers.push({
            x,
            y,
            scale: 0.1,
            targetScale: 0.6 + Math.random() * 0.3, // Slightly bigger medium flowers
            type: randomType,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.012, // Slow rotation
            pulseAngle: Math.random() * Math.PI * 2,
            pulseSpeed: 0.03 + Math.random() * 0.02, // Slow beat
            opacity: 1,
            isBouncing: false,
            vx: 0,
            vy: 0
        });

        this.lastPlantPos = { x, y };
    }

    triggerBounceFadeOff() {
        if (this.flowers.length === 0) return;

        this.flowers.forEach(f => {
            if (!f.isBouncing) {
                f.isBouncing = true;
                f.vx = (Math.random() - 0.5) * 15; // More pronounced bounce
                f.vy = -6 - Math.random() * 8; // Jump higher initially
            }
        });
    }
}
