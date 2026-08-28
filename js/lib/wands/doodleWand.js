/* ==========================================================================
   Neon Doodle Wand Module (Hand-Drawn Mid-Air Drawing)
   ========================================================================== */

export class DoodleWand {
    constructor() {
        this.strokes = []; // Array of drawn paths
        this.currentStroke = null;
        this.activeColor = '#ff4d6d';
        this.brushSize = 8;
    }

    reset() {
        this.strokes = [];
        this.currentStroke = null;
    }

    setColor(color) {
        this.activeColor = color;
    }

    setSize(size) {
        this.brushSize = parseInt(size, 10);
    }

    updateAndRender(ctx, width, height, handData, offsetX = 0, offsetY = 0) {
        // Handle Hand Input
        if (handData && handData.detected) {
            const hand = handData.hands[0];
            const posX = offsetX + hand.indexTip.x * width;
            const posY = offsetY + hand.indexTip.y * height;

            if (hand.gesture === 'pointing') {
                if (!this.currentStroke) {
                    this.currentStroke = {
                        color: this.activeColor,
                        size: this.brushSize,
                        points: []
                    };
                    this.strokes.push(this.currentStroke);
                }
                this.currentStroke.points.push({ x: posX, y: posY });
            } else if (hand.gesture === 'open_palm') {
                // Clear stroke drawing
                if (this.strokes.length > 0) {
                    this.strokes = [];
                }
                this.currentStroke = null;
            } else {
                this.currentStroke = null;
            }
        } else {
            this.currentStroke = null;
        }

        // Render Strokes with High Performance
        this.strokes.forEach(stroke => {
            if (stroke.points.length < 2) return;

            ctx.save();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

            for (let i = 1; i < stroke.points.length; i++) {
                const pt = stroke.points[i];
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            ctx.restore();
        });
    }
}
