/* ==========================================================================
   Sparkler / Magic Fireworks Wand Module
   ========================================================================== */

export class SparklerWand {
    constructor() {
        this.sparks = [];
        this.lastPos = null;
    }

    reset() {
        this.sparks = [];
        this.lastPos = null;
    }

    updateAndRender(ctx, width, height, handData, offsetX = 0, offsetY = 0) {
        // Handle Hand Input
        if (handData && handData.detected) {
            const hand = handData.hands[0];
            const posX = offsetX + hand.indexTip.x * width;
            const posY = offsetY + hand.indexTip.y * height;

            if (hand.gesture === 'pointing' || hand.gesture === 'victory' || hand.gesture === 'open_palm') {
                this.emitSparks(posX, posY);
            }
        }

        // Update & Render Sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.15; // Gravity
            s.life -= s.decay;

            if (s.life <= 0) {
                this.sparks.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = s.life;
            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.color;
            ctx.lineWidth = s.size;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();

            // Star spark lines
            ctx.beginPath();
            ctx.moveTo(s.x - s.size * 2, s.y);
            ctx.lineTo(s.x + s.size * 2, s.y);
            ctx.moveTo(s.x, s.y - s.size * 2);
            ctx.lineTo(s.x, s.y + s.size * 2);
            ctx.stroke();

            ctx.restore();
        }
    }

    emitSparks(x, y) {
        if (this.sparks.length > 40) return;
        const colors = ['#ff4d6d', '#ffb703', '#52b788', '#00b4d8', '#b5179e', '#ffffff'];

        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.sparks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: 2 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.03 + Math.random() * 0.03
            });
        }
    }
}
