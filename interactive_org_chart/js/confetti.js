/**
 * Standalone Local Canvas Confetti Engine
 * Guarantees realistic confetti animation even when offline or running under local file:// protocol.
 */
(function() {
    if (window.confetti) return;

    window.confetti = function(options) {
        options = options || {};
        const count = options.particleCount || 100;
        const zIndex = options.zIndex || 999999;
        const originY = options.origin && options.origin.y !== undefined ? options.origin.y : 0.7;
        const spread = options.spread || 70;
        const startVelocity = options.startVelocity || 45;
        const decay = options.decay || 0.92;

        let canvas = document.getElementById('local-confetti-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'local-confetti-canvas';
            canvas.style.cssText = `position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: ${zIndex};`;
            document.body.appendChild(canvas);
        } else {
            canvas.style.zIndex = zIndex;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#F5A623', '#10B981', '#3B82F6', '#EF4444', '#EC4899', '#8B5CF6', '#FBBF24', '#FFFFFF'];
        const particles = [];

        const spreadRad = (spread * Math.PI) / 180;

        for (let i = 0; i < count; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad;
            const velocity = startVelocity * (0.6 + Math.random() * 0.8);
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 80,
                y: canvas.height * originY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 10 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 14,
                opacity: 1,
                gravity: 0.45,
                drag: decay,
                fade: Math.random() * 0.015 + 0.008
            });
        }

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                if (p.opacity <= 0) return;
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.fade;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            if (active) {
                requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        render();
    };
})();
