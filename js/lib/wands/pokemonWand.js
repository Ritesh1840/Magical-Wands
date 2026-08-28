/* ==========================================================================
   Pocket Companion / Pet Wand Module
   ========================================================================== */
import { drawPetCreature, drawHandStar } from '../artAssets.js';

export class PokemonWand {
    constructor() {
        this.pet = {
            x: 400,
            y: 300,
            targetX: 400,
            targetY: 300,
            state: 'idle',
            frame: 0
        };
        this.treats = [];
        this.lastPinchTime = 0;
    }

    reset() {
        this.pet = { x: 400, y: 300, targetX: 400, targetY: 300, state: 'idle', frame: 0 };
        this.treats = [];
    }

    updateAndRender(ctx, width, height, handData, offsetX = 0, offsetY = 0) {
        this.pet.frame++;

        // Process Hand Tracking
        if (handData && handData.detected) {
            const hand = handData.hands[0];
            const posX = offsetX + hand.indexTip.x * width;
            const posY = offsetY + hand.indexTip.y * height;

            this.pet.targetX = posX;
            this.pet.targetY = posY - 40; // Float slightly above index finger

            // Feed treat on Pinch
            if (hand.isPinch && Date.now() - this.lastPinchTime > 400) {
                this.treats.push({
                    x: posX,
                    y: posY,
                    targetX: this.pet.x,
                    targetY: this.pet.y
                });
                this.lastPinchTime = Date.now();
                this.pet.state = 'happy';
                setTimeout(() => { this.pet.state = 'idle'; }, 1500);
            }
        }

        // Move Pet smoothly towards target
        this.pet.x += (this.pet.targetX - this.pet.x) * 0.1;
        this.pet.y += (this.pet.targetY - this.pet.y) * 0.1;

        // Render Treats flying to pet
        for (let i = this.treats.length - 1; i >= 0; i--) {
            const t = this.treats[i];
            t.x += (this.pet.x - t.x) * 0.2;
            t.y += (this.pet.y - t.y) * 0.2;

            drawHandStar(ctx, t.x, t.y, 10, 5, 0, '#ffd166', true);

            if (Math.hypot(t.x - this.pet.x, t.y - this.pet.y) < 15) {
                this.treats.splice(i, 1);
            }
        }

        // Render Pet
        drawPetCreature(ctx, this.pet.x, this.pet.y, this.pet.state, this.pet.frame);
    }
}
