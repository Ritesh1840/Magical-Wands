/* ==========================================================================
   MediaPipe Hands & Fast Camera Tracking Engine (Optimized 60 FPS)
   ========================================================================== */

export class HandTracker {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.video = null;
        this.latestParsedData = { detected: false, hands: [] };
        this.isLoaded = false;
        this.fallbackMode = false;
        this.mousePos = { x: 0.5, y: 0.5 };
        this.isMouseDown = false;
        this.isProcessingFrame = false;
    }

    async init(videoElement) {
        this.video = videoElement;

        // Wait up to 1.5s if MediaPipe script is still loading asynchronously
        let retries = 15;
        while (!window.Hands && retries > 0) {
            await new Promise(r => setTimeout(r, 100));
            retries--;
        }

        try {
            if (window.Hands) {
                this.hands = new window.Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
                });

                // Set modelComplexity to 0 (Lite model for fast 60 FPS performance)
                this.hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 0,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                this.hands.onResults((results) => {
                    this.latestParsedData = this.parseGestures(results);
                    this.isProcessingFrame = false;
                });

                this.isLoaded = true;
                console.log("MediaPipe Hands initialized in Lite Mode (Optimized).");
                return true;
            } else {
                console.warn("window.Hands not available after wait, enabling mouse fallback.");
                this.enableMouseFallback();
                return true;
            }
        } catch (err) {
            console.warn("MediaPipe Hands init error, enabling mouse fallback:", err);
            this.enableMouseFallback();
            return true;
        }
    }

    enableMouseFallback() {
        this.fallbackMode = true;
        this.isLoaded = true;

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX / window.innerWidth;
            this.mousePos.y = e.clientY / window.innerHeight;
        });

        window.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mousePos.x = e.touches[0].clientX / window.innerWidth;
                this.mousePos.y = e.touches[0].clientY / window.innerHeight;
            }
        });
    }

    async startCamera() {
        if (this.fallbackMode) {
            return true;
        }

        try {
            if (window.Camera && this.video) {
                // Use 640x480 camera stream for fast tracking
                this.camera = new window.Camera(this.video, {
                    onFrame: async () => {
                        if (this.hands && this.video && !this.video.paused && !this.isProcessingFrame) {
                            this.isProcessingFrame = true;
                            await this.hands.send({ image: this.video });
                        }
                    },
                    width: 640,
                    height: 480
                });

                await this.camera.start();
                return true;
            } else {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" },
                    audio: false
                });
                this.video.srcObject = stream;
                await this.video.play();
                return true;
            }
        } catch (err) {
            console.warn("Camera start error, switching to interactive mouse mode:", err);
            this.enableMouseFallback();
            return true;
        }
    }

    detect() {
        if (this.fallbackMode) {
            return {
                detected: true,
                hands: [{
                    landmarks: Array(21).fill(this.mousePos),
                    indexTip: { x: this.mousePos.x, y: this.mousePos.y, z: 0 },
                    thumbTip: { x: this.mousePos.x - 0.05, y: this.mousePos.y, z: 0 },
                    wrist: { x: this.mousePos.x, y: this.mousePos.y + 0.1, z: 0 },
                    gesture: this.isMouseDown ? 'fist' : 'pointing',
                    isPinch: false
                }]
            };
        }

        return this.latestParsedData;
    }

    parseGestures(results) {
        if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            return { detected: false, hands: [] };
        }

        const handsData = results.multiHandLandmarks.map((landmarks) => {
            const points = landmarks.map(p => ({
                x: 1 - p.x, // Mirror X
                y: p.y,
                z: p.z
            }));

            const wrist = points[0];
            const indexTip = points[8];
            const indexPip = points[6];
            const middleTip = points[12];
            const middlePip = points[10];
            const ringTip = points[16];
            const ringPip = points[14];
            const pinkyTip = points[20];
            const pinkyPip = points[18];
            const thumbTip = points[4];

            const distWrist = (p) => Math.hypot(p.x - wrist.x, p.y - wrist.y);
            const indexExt = distWrist(indexTip) > distWrist(indexPip);
            const middleExt = distWrist(middleTip) > distWrist(middlePip);
            const ringExt = distWrist(ringTip) > distWrist(ringPip);
            const pinkyExt = distWrist(pinkyTip) > distWrist(pinkyPip);

            const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
            const isPinch = pinchDist < 0.08;

            let gesture = 'pointing';
            if (indexExt && middleExt && ringExt && pinkyExt) {
                gesture = 'open_palm';
            } else if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
                gesture = 'fist';
            } else if (indexExt && !middleExt && !ringExt && !pinkyExt) {
                gesture = 'pointing';
            } else if (isPinch) {
                gesture = 'pinch';
            } else if (indexExt && middleExt && !ringExt && !pinkyExt) {
                gesture = 'victory';
            }

            return {
                landmarks: points,
                rawLandmarks: landmarks,
                indexTip,
                thumbTip,
                wrist,
                gesture,
                isPinch
            };
        });

        return {
            detected: true,
            hands: handsData
        };
    }
}
