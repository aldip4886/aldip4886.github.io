/**
 * Landing Page Controller & Kinetic Grid Canvas Background Animation
 * Based on 21st.dev (@satoriui/components/kinetic-grid)
 * Features interactive warping dot grid, cursor magnetism, click ripples, and web audio synth.
 */

window.LandingView = {
    canvas: null,
    ctx: null,
    animationFrameId: null,
    gridDots: [],
    ripples: [],
    mouse: { x: -1000, y: -1000, active: false },
    audioEnabled: false,
    audioCtx: null,

    // Kinetic Grid Config
    gridSpacing: 28,
    dotBaseRadius: 1.8,
    cursorRadius: 140,
    mouseForce: 0.35,
    damping: 0.82,
    stiffness: 0.08,

    init() {
        this.canvas = document.getElementById('glow-map-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            this.setupEventListeners();
            this.startAnimation();
        }

        // Audio controls
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.toggleAudio());
        }
        
        this.setupUIAudioTriggers();
    },

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createKineticGrid();
    },

    createKineticGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.gridDots = [];

        const cols = Math.ceil(width / this.gridSpacing) + 1;
        const rows = Math.ceil(height / this.gridSpacing) + 1;

        const offsetX = (width - (cols - 1) * this.gridSpacing) / 2;
        const offsetY = (height - (rows - 1) * this.gridSpacing) / 2;

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const bx = offsetX + c * this.gridSpacing;
                const by = offsetY + r * this.gridSpacing;

                this.gridDots.push({
                    col: c,
                    row: r,
                    baseX: bx,
                    baseY: by,
                    x: bx,
                    y: by,
                    vx: 0,
                    vy: 0,
                    radius: this.dotBaseRadius,
                    alpha: 0.35
                });
            }
        }
    },

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        if (this.canvas) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.active = true;
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.active = false;
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });

            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                // Trigger Kinetic Ripple Wave
                this.ripples.push({
                    x: clickX,
                    y: clickY,
                    radius: 0,
                    maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.7,
                    speed: 8,
                    amplitude: 24,
                    alpha: 1.0
                });

                this.playBeep('click');
            });
        }
    },

    startAnimation() {
        const render = () => {
            if (!this.canvas || !this.ctx) return;
            const ctx = this.ctx;
            const width = this.canvas.width;
            const height = this.canvas.height;
            
            ctx.clearRect(0, 0, width, height);

            // Update & Expand Kinetic Ripples
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const rip = this.ripples[i];
                rip.radius += rip.speed;
                rip.alpha *= 0.96;
                if (rip.radius > rip.maxRadius || rip.alpha < 0.01) {
                    this.ripples.splice(i, 1);
                }
            }

            // Update Dots Physics & Displacement
            const isDark = document.documentElement.classList.contains('dark');
            const dotColor = isDark ? 'rgba(245, 166, 35,' : 'rgba(217, 119, 6,';
            const lineColor = isDark ? 'rgba(245, 166, 35, 0.08)' : 'rgba(217, 119, 6, 0.06)';

            for (let i = 0; i < this.gridDots.length; i++) {
                const dot = this.gridDots[i];

                // 1. Mouse Warping Magnetism Force
                if (this.mouse.active) {
                    const dx = this.mouse.x - dot.x;
                    const dy = this.mouse.y - dot.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < this.cursorRadius && dist > 0) {
                        const angle = Math.atan2(dy, dx);
                        const force = (1 - dist / this.cursorRadius) * 18;
                        dot.vx -= Math.cos(angle) * force * this.mouseForce;
                        dot.vy -= Math.sin(angle) * force * this.mouseForce;
                    }
                }

                // 2. Kinetic Ripple Displacement
                for (const rip of this.ripples) {
                    const rDx = dot.baseX - rip.x;
                    const rDy = dot.baseY - rip.y;
                    const rDist = Math.hypot(rDx, rDy);
                    const diff = Math.abs(rDist - rip.radius);

                    if (diff < 40) {
                        const waveForce = Math.sin((diff / 40) * Math.PI) * rip.amplitude * rip.alpha;
                        const angle = Math.atan2(rDy, rDx);
                        dot.vx += Math.cos(angle) * waveForce * 0.15;
                        dot.vy += Math.sin(angle) * waveForce * 0.15;
                    }
                }

                // 3. Spring Physics towards Base Home Position
                const homeDx = dot.baseX - dot.x;
                const homeDy = dot.baseY - dot.y;

                dot.vx += homeDx * this.stiffness;
                dot.vy += homeDy * this.stiffness;

                dot.vx *= this.damping;
                dot.vy *= this.damping;

                dot.x += dot.vx;
                dot.y += dot.vy;

                // Dynamic Radius & Alpha depending on displacement
                const disp = Math.hypot(dot.x - dot.baseX, dot.y - dot.baseY);
                const activeScale = Math.min(disp / 10, 2.5);
                const currentRadius = this.dotBaseRadius + activeScale;
                const currentAlpha = Math.min(0.3 + disp / 20, 0.95);

                // Render Kinetic Grid Dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = `${dotColor} ${currentAlpha})`;
                ctx.fill();
            }

            // Draw Subtle Grid Network Connection Lines
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            const cols = Math.ceil(width / this.gridSpacing) + 1;

            for (let i = 0; i < this.gridDots.length; i++) {
                const dot = this.gridDots[i];
                // Connect to right neighbor
                if ((i + 1) % cols !== 0 && i + 1 < this.gridDots.length) {
                    const rightDot = this.gridDots[i + 1];
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(rightDot.x, rightDot.y);
                }
                // Connect to bottom neighbor
                if (i + cols < this.gridDots.length) {
                    const bottomDot = this.gridDots[i + cols];
                    ctx.moveTo(dot.x, dot.y);
                    ctx.lineTo(bottomDot.x, bottomDot.y);
                }
            }
            ctx.stroke();

            this.animationFrameId = requestAnimationFrame(render);
        };

        render();
    },

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    },

    // Soft UI synthesizer using Web Audio API
    playBeep(type = 'hover') {
        if (!this.audioEnabled) return;
        
        try {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
                gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.08);
            } else if (type === 'click') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(320, this.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.15);
            }
        } catch (e) {
            console.error("Audio playback error:", e);
        }
    },

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const btn = document.getElementById('audio-toggle');
        
        if (btn) {
            if (this.audioEnabled) {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
                btn.title = "Bisukan Suara";
                this.playBeep('click');
            } else {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
                btn.title = "Aktifkan Suara";
            }
        }
    },

    setupUIAudioTriggers() {
        const selectables = document.querySelectorAll('.btn, .feature-card, .icon-btn, .map-pulse-point');
        
        selectables.forEach(el => {
            el.addEventListener('mouseenter', () => this.playBeep('hover'));
            el.addEventListener('click', () => this.playBeep('click'));
        });
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.LandingView.init();
});
