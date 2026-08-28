/* ==========================================================================
   Cute & Vibrant 20-Flower Floral Sprite Engine (Pre-rendered for 60 FPS)
   ========================================================================== */

export const FlowerTypes = [
    'daisy', 'bluebell', 'violet', 'marigold', 
    'hibiscus', 'pinkpeony', 'sunflower', 'wildflower', 
    'leaf', 'babysbreath', 'tulip', 'rose',
    'clover', 'lotus', 'sakura', 'forgetmenot',
    'dahlia', 'poppy', 'dandelion', 'buttercup'
];

const spriteCache = {};

function createFlowerSprite(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.translate(64, 64);
    ctx.scale(2, 2); // 2x high-res crisp rendering

    if (type === 'daisy') {
        for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 8);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, -13, 4.5, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffb703';
        ctx.strokeStyle = '#fb8500';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } 
    else if (type === 'bluebell') {
        ctx.fillStyle = '#3a86ff';
        ctx.strokeStyle = '#004e92';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(0, -11, 5, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#8338ec';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'violet') {
        ctx.fillStyle = '#7209b7';
        ctx.strokeStyle = '#3f37c9';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.arc(0, -9, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'marigold') {
        const colors = ['#ff4d6d', '#ff758f', '#ffb703', '#fb8500'];
        for (let r = 15; r > 3; r -= 3.5) {
            ctx.fillStyle = colors[Math.floor(r / 4)] || '#ff758f';
            ctx.strokeStyle = '#d00000';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    else if (type === 'hibiscus') {
        ctx.fillStyle = '#e63946';
        ctx.strokeStyle = '#9d0208';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(0, -11, 6, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'pinkpeony') {
        ctx.fillStyle = '#ffb3c1';
        ctx.strokeStyle = '#ff758f';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.ellipse(0, -10, 6, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'sunflower') {
        ctx.fillStyle = '#ffc300';
        ctx.strokeStyle = '#ff9f1c';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 10);
            ctx.beginPath();
            ctx.ellipse(0, -13, 3.5, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#582f0e';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'wildflower') {
        ctx.fillStyle = '#c77dff';
        ctx.strokeStyle = '#7b2cbf';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(0, -9, 4.5, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'leaf') {
        ctx.fillStyle = '#38b000';
        ctx.strokeStyle = '#007200';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(-5, 0, 8, 4.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(5, 0, 8, 4.5, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    else if (type === 'babysbreath') {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#70e000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const offsetX = (i - 1.5) * 4;
            const offsetY = -i * 2.5;
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    else if (type === 'tulip') {
        ctx.fillStyle = '#ff0054';
        ctx.strokeStyle = '#9e0031';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -2, 10, 0, Math.PI);
        ctx.lineTo(-10, -12);
        ctx.lineTo(-4, -6);
        ctx.lineTo(0, -14);
        ctx.lineTo(4, -6);
        ctx.lineTo(10, -12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    else if (type === 'rose') {
        ctx.fillStyle = '#ff4d6d';
        ctx.strokeStyle = '#800f2f';
        ctx.lineWidth = 1;
        for (let r = 13; r > 2; r -= 3.5) {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    else if (type === 'clover') {
        ctx.fillStyle = '#52b788';
        ctx.strokeStyle = '#1b4332';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 4);
            ctx.beginPath();
            ctx.arc(0, -8, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
    else if (type === 'lotus') {
        ctx.fillStyle = '#ff9ebb';
        ctx.strokeStyle = '#ff477e';
        ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 7);
            ctx.beginPath();
            ctx.ellipse(0, -10, 4, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#fff0f5';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'sakura') {
        ctx.fillStyle = '#ffc6ff';
        ctx.strokeStyle = '#ff66c4';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(0, -9, 4.5, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'forgetmenot') {
        ctx.fillStyle = '#00b4d8';
        ctx.strokeStyle = '#0077b6';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.arc(0, -8, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'dahlia') {
        ctx.fillStyle = '#b5179e';
        ctx.strokeStyle = '#7209b7';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 12);
            ctx.beginPath();
            ctx.ellipse(0, -11, 3, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'poppy') {
        ctx.fillStyle = '#ff5400';
        ctx.strokeStyle = '#9e0031';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 4);
            ctx.beginPath();
            ctx.arc(0, -7, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#212529';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'dandelion') {
        ctx.fillStyle = '#ffea00';
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 16; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 16);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -13);
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (type === 'buttercup') {
        ctx.fillStyle = '#ffdd00';
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(0, -8, 5, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#70e000';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    return canvas;
}

// Pre-populate sprite cache only on client side (to avoid Next.js SSR crashes)
if (typeof document !== 'undefined') {
    FlowerTypes.forEach(t => {
        spriteCache[t] = createFlowerSprite(t);
    });
}

export function drawFlower(ctx, x, y, scale = 1, type = 'daisy', rotation = 0, opacity = 1) {
    const sprite = spriteCache[type] || spriteCache['daisy'];
    const s = scale * 0.5;
    
    // Direct transform matrix is much faster than save/restore
    ctx.setTransform(
        Math.cos(rotation) * s, Math.sin(rotation) * s,
        -Math.sin(rotation) * s, Math.cos(rotation) * s,
        x, y
    );
    
    ctx.globalAlpha = opacity < 0 ? 0 : opacity;
    ctx.drawImage(sprite, -64, -64);
    
    // Reset transform directly
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
}

export function drawHandLine(ctx, x1, y1, x2, y2, color = 'rgba(255, 255, 255, 0.4)') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Render Hand-Drawn Star
export function drawHandStar(ctx, x, y, size = 14, points = 4, rotation = 0, color = '#ffd166', glow = false, opacity = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    const outerRadius = size;
    const innerRadius = size * 0.4;
    const angleStep = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const currAngle = i * angleStep;
        const px = Math.cos(currAngle) * r;
        const py = Math.sin(currAngle) * r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Render Hand-Drawn Pet Creature
export function drawPetCreature(ctx, x, y, state = 'idle', frame = 0) {
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(frame * 0.12) * 5;
    ctx.translate(0, bounce);

    ctx.fillStyle = '#ffb703';
    ctx.strokeStyle = '#fb8500';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-14, -14);
    ctx.lineTo(-22, -32);
    ctx.lineTo(-5, -20);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(14, -14);
    ctx.lineTo(22, -32);
    ctx.lineTo(5, -20);
    ctx.fill();
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.arc(-12, 4, 4.5, 0, Math.PI * 2);
    ctx.arc(12, 4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(-7, -3, 3.5, 0, Math.PI * 2);
    ctx.arc(7, -3, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-2.5, 5, 2.5, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(2.5, 5, 2.5, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
}
