/**
 * Landing Page Controller & Canvas Background Animation
 * Aligned with PRD v2.0 (Premium micro-interactions & audio synth)
 */

window.LandingView = {
    canvas: null,
    ctx: null,
    animationFrameId: null,
    nodes: [],
    audioEnabled: false,
    audioCtx: null,

    init() {
        this.canvas = document.getElementById('glow-map-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            this.createNodes();
            this.startAnimation();
            
            window.addEventListener('resize', () => this.resizeCanvas());
        }

        // Audio controls
        const audioBtn = document.getElementById('audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.toggleAudio());
        }
        
        // Add premium soft sound on hover of CTA and cards
        this.setupUIAudioTriggers();
    },

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.createNodes(); // Recreate nodes to fit new bounds
    },

    createNodes() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.nodes = [];
        
        // Create random nodes representing connection networks
        const count = 25;
        for (let i = 0; i < count; i++) {
            this.nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.5 + 0.3
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
            
            // Draw connections/links between nodes
            ctx.strokeStyle = 'rgba(26, 75, 140, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < this.nodes.length; i++) {
                const n1 = this.nodes[i];
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const n2 = this.nodes[j];
                    const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }
            }
            
            // Draw nodes
            ctx.fillStyle = '#FFC94A'; // Gold highlight
            for (const n of this.nodes) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245, 166, 35, ${n.alpha})`;
                ctx.fill();
                
                // Update position
                n.x += n.vx;
                n.y += n.vy;
                
                // Boundaries
                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;
            }
            
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
                osc.frequency.setValueAtTime(800, this.audioCtx.currentTime); // Pitch
                gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime); // Low volume
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1); // Decay
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.1);
            } else if (type === 'click') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
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
        // Find elements to attach sounds to
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

