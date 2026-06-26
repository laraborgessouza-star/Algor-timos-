(function () {
    const canvas = document.getElementById('eyeCanvas');
    const ctx = canvas.getContext('2d');

    const curvatureSlider = document.getElementById('curvatureSlider');
    const focusSlider     = document.getElementById('focusSlider');
    const curvatureValue  = document.getElementById('curvatureValue');
    const focusValue      = document.getElementById('focusValue');
    const resetBtn        = document.getElementById('resetButton');

    const W = 500, H = 400;

    // Eye center
    const cx = 250, cy = 198;

    let curvature   = 1.0;
    let focusOffset = 1.0;

    /* ──────────────────────────────────────────────
       Helper: rounded text label with background
    ────────────────────────────────────────────── */
    function label(text, x, y, color = '#a8d4ec') {
        ctx.save();
        ctx.font = '500 11px "Inter", sans-serif';
        const w = ctx.measureText(text).width;
        ctx.fillStyle = 'rgba(6,18,30,0.55)';
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 13, w + 8, 17, 5);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    /* ──────────────────────────────────────────────
       Main draw function
    ────────────────────────────────────────────── */
    function drawEye() {
        ctx.clearRect(0, 0, W, H);
        ctx.save();

        // ── Background ──────────────────────────────
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#0a1928');
        bg.addColorStop(1, '#081422');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Subtle grid lines
        ctx.strokeStyle = 'rgba(90,172,207,0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // ── Sclera ──────────────────────────────────
        const scleraGrad = ctx.createRadialGradient(cx - 30, cy - 20, 10, cx, cy, 165);
        scleraGrad.addColorStop(0, '#eaf4ff');
        scleraGrad.addColorStop(0.7, '#cde3f5');
        scleraGrad.addColorStop(1, '#adc8de');
        ctx.beginPath();
        ctx.ellipse(cx, cy, 168, 132, 0, 0, Math.PI * 2);
        ctx.fillStyle = scleraGrad;
        ctx.shadowColor = 'rgba(90,172,207,0.3)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#5aaccf';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // ── Iris ────────────────────────────────────
        const irisX = cx - 6, irisY = cy - 2;
        const irisGrad = ctx.createRadialGradient(irisX - 10, irisY - 10, 2, irisX, irisY, 44);
        irisGrad.addColorStop(0,   '#2a6090');
        irisGrad.addColorStop(0.5, '#1a3e5a');
        irisGrad.addColorStop(1,   '#0e2336');
        ctx.beginPath();
        ctx.ellipse(irisX, irisY, 44, 44, 0, 0, Math.PI * 2);
        ctx.fillStyle = irisGrad;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Iris texture rings
        for (let r = 14; r <= 40; r += 5) {
            ctx.beginPath();
            ctx.ellipse(irisX, irisY, r, r, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(90,160,210,0.12)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        // Pupil
        const pupilGrad = ctx.createRadialGradient(irisX - 4, irisY - 4, 1, irisX, irisY, 22);
        pupilGrad.addColorStop(0, '#0d1f2e');
        pupilGrad.addColorStop(1, '#030a10');
        ctx.beginPath();
        ctx.ellipse(irisX, irisY, 22, 22, 0, 0, Math.PI * 2);
        ctx.fillStyle = pupilGrad;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.ellipse(irisX - 10, irisY - 9, 7, 5, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.30)';
        ctx.fill();

        // ── Cornea ──────────────────────────────────
        ctx.beginPath();
        ctx.ellipse(cx + 6, cy - 2, 54, 48, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(120,200,240,0.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = 'rgba(180,230,255,0.07)';
        ctx.fill();

        // ── Lens (crystalline) ──────────────────────
        const lensBaseW = 36, lensBaseH = 24;
        const lensW = lensBaseW * (0.75 + 0.5 * curvature);
        const lensH = lensBaseH * (0.65 + 0.7 * curvature);
        const lensX = cx + 28, lensY = cy - 2;

        const lensGrad = ctx.createRadialGradient(lensX - 4, lensY - 4, 2, lensX, lensY, lensW);
        lensGrad.addColorStop(0, 'rgba(200,240,255,0.35)');
        lensGrad.addColorStop(1, 'rgba(120,190,230,0.08)');

        ctx.beginPath();
        ctx.ellipse(lensX, lensY, lensW * 0.7, lensH * 0.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = lensGrad;
        ctx.fill();
        ctx.strokeStyle = '#5aaccf';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Inner lens shine
        ctx.beginPath();
        ctx.ellipse(lensX - 3, lensY - 2, lensW * 0.38, lensH * 0.32, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(180,230,255,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // ── Retina line ─────────────────────────────
        const retinaX = cx + 128;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(retinaX, cy, 5, 52, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#3ab898';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 8]);
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(58,184,152,0.06)';
        ctx.fill();
        ctx.restore();

        // ── Light rays ──────────────────────────────
        const startX = 18;
        const rayOffsets = [-52, 0, 52];
        const rayColors  = ['#e05555', '#e8b840', '#4488dd'];

        const focusBaseX = cx + 118;
        const focusX = focusBaseX + (focusOffset - 1.0) * 55;
        const focusY = cy + (focusOffset - 1.0) * 14;

        rayColors.forEach((color, i) => {
            const startY = cy + rayOffsets[i];
            const interceptX = lensX - 6;
            const interceptY = startY * 0.25 + cy * 0.75;

            const dx = focusX - interceptX;
            const dy = focusY - interceptY;
            const endX = focusX + dx * 0.28;
            const endY = focusY + dy * 0.28;

            // Before lens
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(interceptX, interceptY);
            const grad1 = ctx.createLinearGradient(startX, startY, interceptX, interceptY);
            grad1.addColorStop(0, color + '99');
            grad1.addColorStop(1, color + 'cc');
            ctx.strokeStyle = grad1;
            ctx.lineWidth = 2.2;
            ctx.globalAlpha = 0.75;
            ctx.stroke();

            // After lens → focus
            ctx.beginPath();
            ctx.moveTo(interceptX, interceptY);
            ctx.lineTo(endX, endY);
            const grad2 = ctx.createLinearGradient(interceptX, interceptY, endX, endY);
            grad2.addColorStop(0, color + 'bb');
            grad2.addColorStop(1, color + '44');
            ctx.strokeStyle = grad2;
            ctx.lineWidth = 2.2;
            ctx.globalAlpha = 0.65;
            ctx.stroke();
        });

        ctx.globalAlpha = 1;

        // ── Focus point ─────────────────────────────
        const focusDist = Math.abs(focusX - retinaX);
        const onRetina  = focusDist < 12;
        const focusColor = onRetina ? '#3ab898' : '#e8b840';

        // Glow
        const glow = ctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, 20);
        glow.addColorStop(0,   focusColor + 'cc');
        glow.addColorStop(0.4, focusColor + '44');
        glow.addColorStop(1,   focusColor + '00');
        ctx.beginPath();
        ctx.arc(focusX, focusY, 20, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(focusX, focusY, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = focusColor;
        ctx.shadowColor = focusColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // ── Status badge ────────────────────────────
        const statusText = onRetina ? '✓ Foco na retina' : '✗ Foco desviado';
        const statusColor = onRetina ? '#3ab898' : '#e8b840';
        ctx.save();
        ctx.font = '600 11.5px "Inter", sans-serif';
        const sw = ctx.measureText(statusText).width;
        ctx.fillStyle = onRetina ? 'rgba(58,184,152,0.15)' : 'rgba(232,184,64,0.15)';
        ctx.beginPath();
        ctx.roundRect(W - sw - 28, 10, sw + 20, 26, 8);
        ctx.fill();
        ctx.strokeStyle = statusColor + '55';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = statusColor;
        ctx.fillText(statusText, W - sw - 18, 27);
        ctx.restore();

        // ── Labels ──────────────────────────────────
        label('Córnea',    cx + 44, cy - 78, '#88ccee');
        label('Cristalino', lensX - 22, lensY - lensH * 0.65 - 12, '#aaddff');
        label('Retina',    retinaX + 10, cy - 56, '#3ab898');
        label('Foco',      focusX - 14, focusY - 14, focusColor);

        ctx.restore();
    }

    /* ──────────────────────────────────────────────
       Update slider fill gradient
    ────────────────────────────────────────────── */
    function updateSliderFill(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.setProperty('--prog', pct + '%');
    }

    /* ──────────────────────────────────────────────
       Event handlers
    ────────────────────────────────────────────── */
    function updateFromSliders() {
        curvature   = parseFloat(curvatureSlider.value);
        focusOffset = parseFloat(focusSlider.value);
        curvatureValue.textContent = curvature.toFixed(2);
        focusValue.textContent     = focusOffset.toFixed(2);
        updateSliderFill(curvatureSlider);
        updateSliderFill(focusSlider);
        drawEye();
    }

    curvatureSlider.addEventListener('input', updateFromSliders);
    focusSlider.addEventListener('input', updateFromSliders);

    resetBtn.addEventListener('click', function () {
        curvatureSlider.value = '1.0';
        focusSlider.value     = '1.0';
        updateFromSliders();
    });

    // Prevent touch scroll on canvas
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Init
    updateFromSliders();
})();
