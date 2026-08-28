/* ==========================================================================
   Magical Wands - Main Application Controller
   ========================================================================== */

import { HandTracker } from './handTracking.js';
import { FlowerWand } from './wands/flowerWand.js';
import { StarWand } from './wands/starWand.js';
import { DoodleWand } from './wands/doodleWand.js';
import { PokemonWand } from './wands/pokemonWand.js';
import { SparklerWand } from './wands/sparklerWand.js';
import { GalleryManager } from './gallery.js';

export class MagicalApp {
    constructor() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('output-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Hand Tracker & Wands
        this.tracker = new HandTracker();
        this.wands = {
            flowers: new FlowerWand(),
            stars: new StarWand(),
            doodle: new DoodleWand(),
            pokemon: new PokemonWand(),
            sparkler: new SparklerWand()
        };
        this.currentWandKey = 'flowers';

        // Gallery & Audio
        this.gallery = new GalleryManager();

        // Shutter & Recording State
        this.currentMode = 'photo'; // 'photo' or 'video'
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingTimerInterval = null;
        // UI Elements
        this.landingScreen = document.getElementById('landing-screen');
        this.cameraHud = document.getElementById('camera-hud');
        this.startBtn = document.getElementById('start-btn');
        this.gestureTextElem = document.getElementById('gesture-text');
        this.recordingBadge = document.getElementById('recording-badge');
        this.recordingTimerElem = document.getElementById('recording-timer');

        this.initEventListeners();
    }

    initEventListeners() {
        // Start Camera Button
        this.startBtn.addEventListener('click', async () => {
            this.startBtn.disabled = true;
            const btnText = this.startBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = "STARTING...";

            try {
                await this.tracker.init(this.video);
                await this.tracker.startCamera();
            } catch (err) {
                console.warn("Error starting tracking/camera:", err);
                this.tracker.enableMouseFallback();
            }

            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            this.landingScreen.classList.add('hidden');
            this.cameraHud.classList.remove('hidden');

            if (this.tracker.fallbackMode) {
                this.showToast("🪄 Interactive Mouse/Touch Wand Active! Move cursor or tap to cast spells.");
            } else {
                this.showToast("🪄 Camera Hand Tracking Active! Point index finger to cast spells.");
            }

            this.startRenderLoop();
        });


        // Wand Selector
        const wandBtns = document.querySelectorAll('.wand-btn');
        wandBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                wandBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchWand(btn.dataset.wand);
            });
        });

        // Photo / Video Tab Switchers
        const tabPhoto = document.getElementById('tab-photo');
        const tabVideo = document.getElementById('tab-video');
        if (tabPhoto && tabVideo) {
            tabPhoto.addEventListener('click', () => {
                if (this.isRecording) return;
                tabPhoto.classList.add('active');
                tabVideo.classList.remove('active');
                this.currentMode = 'photo';
            });
            tabVideo.addEventListener('click', () => {
                if (this.isRecording) return;
                tabVideo.classList.add('active');
                tabPhoto.classList.remove('active');
                this.currentMode = 'video';
            });
        }

        // Shutter Button Action
        this.shutterBtn = document.getElementById('shutter-btn');
        if (this.shutterBtn) {
            this.shutterBtn.addEventListener('click', () => {
                if (this.currentMode === 'photo') {
                    this.takePhoto();
                } else {
                    this.toggleVideoRecording();
                }
            });
        }
    }

    switchWand(wandKey) {
        this.currentWandKey = wandKey;
        const wandInstructions = {
            stars: { text: 'Point to place a star' },
            flowers: { text: 'Point to plant · Open your hand to scatter' },
            doodle: { text: 'Pinch and drag to sketch' },
        };

        const info = wandInstructions[wandKey];
        if (this.gestureTextElem) {
            this.gestureTextElem.textContent = info.text;
        }

        this.showToast(`Switched to ${wandKey.toUpperCase()} Wand`);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getVideoBounds() {
        const vw = (this.video && this.video.videoWidth) ? this.video.videoWidth : 1280;
        const vh = (this.video && this.video.videoHeight) ? this.video.videoHeight : 720;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        const videoRatio = vw / vh;
        const containerRatio = cw / ch;

        let drawW, drawH, offsetX, offsetY;
        if (containerRatio > videoRatio) {
            drawH = ch;
            drawW = ch * videoRatio;
            offsetX = (cw - drawW) / 2;
            offsetY = 0;
        } else {
            drawW = cw;
            drawH = cw / videoRatio;
            offsetX = 0;
            offsetY = (ch - drawH) / 2;
        }

        return { drawW, drawH, offsetX, offsetY };
    }

    startRenderLoop() {
        const render = () => {
            const width = this.canvas.width;
            const height = this.canvas.height;

            // Clear Canvas
            this.ctx.clearRect(0, 0, width, height);

            // Run Hand Tracker
            const handData = this.tracker.detect();

            // Render Hand Landmarks (Glowing Skeleton Lines)
            if (handData && handData.detected) {
                this.drawHandSkeleton(handData.hands, width, height);
            }

            // Update & Render Active Wand
            const activeWand = this.wands[this.currentWandKey];
            if (activeWand) {
                activeWand.updateAndRender(this.ctx, width, height, handData, 0, 0, this.gestureTextElem);
            }

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    drawHandSkeleton(hands, width, height) {
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],
            [0, 5], [5, 6], [6, 7], [7, 8],
            [5, 9], [9, 10], [10, 11], [11, 12],
            [9, 13], [13, 14], [14, 15], [15, 16],
            [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]
        ];

        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;

        hands.forEach(hand => {
            const points = hand.landmarks.map(p => ({
                x: p.x * width,
                y: p.y * height
            }));

            // Single batched path for bones
            this.ctx.beginPath();
            connections.forEach(([i, j]) => {
                const p1 = points[i];
                const p2 = points[j];
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            });
            this.ctx.stroke();

            // Draw Landmark Nodes
            points.forEach((pt, idx) => {
                this.ctx.fillStyle = idx === 8 ? '#ff4d6d' : '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(pt.x, pt.y, idx === 8 ? 6 : 3, 0, Math.PI * 2);
                this.ctx.fill();
            });
        });

        this.ctx.restore();
    }

    takePhoto() {
        // Flash animation
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99;opacity:0.9;transition:opacity 0.3s ease;pointer-events:none;';
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 50);

        try {
            // Combine video and canvas
            const mergedCanvas = document.createElement('canvas');
            mergedCanvas.width = this.canvas.width || 1920;
            mergedCanvas.height = this.canvas.height || 1080;
            const mctx = mergedCanvas.getContext('2d');

            // Calculate object-fit: cover mapping
            const videoRatio = (this.video.videoWidth || 1920) / (this.video.videoHeight || 1080);
            const canvasRatio = mergedCanvas.width / mergedCanvas.height;
            let drawW, drawH, offsetX, offsetY;

            if (canvasRatio > videoRatio) {
                drawW = mergedCanvas.width;
                drawH = mergedCanvas.width / videoRatio;
                offsetX = 0;
                offsetY = (mergedCanvas.height - drawH) / 2;
            } else {
                drawW = mergedCanvas.height * videoRatio;
                drawH = mergedCanvas.height;
                offsetX = (mergedCanvas.width - drawW) / 2;
                offsetY = 0;
            }

            mctx.save();
            mctx.scale(-1, 1);
            mctx.drawImage(this.video, -drawW - offsetX, offsetY, drawW, drawH);
            mctx.restore();

            mctx.drawImage(this.canvas, 0, 0);

            // Stamp author watermark on exported photos
            mctx.save();
            mctx.font = '600 16px sans-serif';
            mctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            mctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            mctx.shadowBlur = 4;
            mctx.fillText('✦ Magical Wands • by Rupam Kayal', 24, mergedCanvas.height - 24);
            mctx.restore();

            const dataUrl = mergedCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `FlowerBand_Photo_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            this.showToast("📸 Photo Downloaded!");
        } catch (err) {
            this.showToast("❌ Error: " + err.message);
        }
    }

    toggleVideoRecording() {
        if (!this.isRecording) {
            this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    startRecording() {
        this.recordedChunks = [];
        const stream = this.canvas.captureStream(30);

        try {
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        } catch (e) {
            this.mediaRecorder = new MediaRecorder(stream);
        }

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FlowerBand_Video_${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showToast("🎥 Video Downloaded!");
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        this.shutterBtn.classList.add('recording');
        this.recordingBadge.classList.remove('hidden');

        this.recordingSeconds = 0;
        this.recordingTimerElem.textContent = "00:00";
        this.recordingTimerInterval = setInterval(() => {
            this.recordingSeconds++;
            const mins = String(Math.floor(this.recordingSeconds / 60)).padStart(2, '0');
            const secs = String(this.recordingSeconds % 60).padStart(2, '0');
            this.recordingTimerElem.textContent = `${mins}:${secs}`;
        }, 1000);

        this.showToast("🔴 Recording Started...");
    }

    stopRecording() {
        if (!this.isRecording) return;
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.shutterBtn.classList.remove('recording');
        this.recordingBadge.classList.add('hidden');
        clearInterval(this.recordingTimerInterval);
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize App
// App initialized by React component MagicalCanvas.js
