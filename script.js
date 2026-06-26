(function() {
    const canvas = document.getElementById('eyeCanvas');
    const ctx = canvas.getContext('2d');

    const curvatureSlider = document.getElementById('curvatureSlider');
    const focusSlider = document.getElementById('focusSlider');
    const curvatureValue = document.getElementById('curvatureValue');
    const focusValue = document.getElementById('focusValue');
    const resetBtn = document.getElementById('resetButton');

    const W = 500, H = 400;
    canvas.width = W;
    canvas.height = H;

    // Centro do olho
    const cx = 230, cy = 190;

    let curvature = 1.0;
    let focusOffset = 1.0;

    // Função principal de desenho
    function drawEye() {
        ctx.clearRect(0, 0, W, H);
        ctx.save();

        // Fundo suave
        const grad = ctx.createRadialGradient(180, 180, 20, 230, 190, 280);
        grad.addColorStop(0, '#eaf3fc');
        grad.addColorStop(1, '#cdddee');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Esclera (contorno)
        ctx.beginPath();
        ctx.ellipse(cx, cy, 160, 130, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#f4faff';
        ctx.shadowColor = 'rgba(0,20,30,0.06)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#8db4d0';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Íris / pupila (estética)
        ctx.beginPath();
        ctx.ellipse(cx-4, cy-2, 40, 40, 0, 0, Math.PI*2);
        ctx.fillStyle = '#2d4a66';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0,0,0,0.06)';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#1f3850';
        ctx.lineWidth = 1.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx-2, cy, 20, 20, 0, 0, Math.PI*2);
        ctx.fillStyle = '#0a1a28';
        ctx.fill();

        // Córnea (curva fixa)
        ctx.beginPath();
        ctx.ellipse(cx+8, cy-2, 52, 46, 0, 0, Math.PI*2);
        ctx.strokeStyle = '#aac9e0';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.fillStyle = 'rgba(210, 232, 248, 0.12)';
        ctx.fill();

        // Cristalino (curvatura variável)
        const lensBaseW = 36;
        const lensBaseH = 22;
        const lensW = lensBaseW * (0.8 + 0.4 * curvature);
        const lensH = lensBaseH * (0.7 + 0.6 * curvature);
        const lensX = cx + 24;
        const lensY = cy - 1;

        ctx.beginPath();
        ctx.ellipse(lensX, lensY - 2, lensW * 0.7, lensH * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#3f718f';
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.fillStyle = 'rgba(210, 235, 250, 0.20)';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(lensX - 2, lensY - 1, lensW * 0.45, lensH * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#5d8aaa';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // --- RAIOS LUMINOSOS ---
        const startX = 20;
        const startY1 = cy - 55;
        const startY2 = cy + 55;
        const startY3 = cy - 8;

        const focusBaseX = cx + 120;
        const focusX = focusBaseX + (focusOffset - 1.0) * 50;
        const focusY = cy + (focusOffset - 1.0) * 16;

        const rays = [
            { y: startY1, color: '#c7423a' },
            { y: startY2, color: '#3a7ac7' },
            { y: startY3, color: '#3a9e7a' }
        ];

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2.4;

        rays.forEach((r) => {
            const startY = r.y;
            const lensInterceptX = lensX - 4;
            const lensInterceptY = startY * 0.3 + cy * 0.7;

            const dx = focusX - lensInterceptX;
            const dy = focusY - lensInterceptY;
            const lengthFactor = 1.2;
            const endX = lensInterceptX + dx * lengthFactor;
            const endY = lensInterceptY + dy * lengthFactor;

            // antes do cristalino
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(lensInterceptX, lensInterceptY);
            ctx.strokeStyle = r.color;
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = 2.6;
            ctx.stroke();

            // depois do cristalino
            ctx.beginPath();
            ctx.moveTo(lensInterceptX, lensInterceptY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = r.color;
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = 2.6;
            ctx.stroke();
        });

        // Ponto focal (brilho)
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(focusX, focusY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#f5c542';
        ctx.shadowBlur = 22;
        ctx.shadowColor = '#f5b842';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#f0b83a';
        ctx.beginPath();
        ctx.arc(focusX, focusY, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Retina (linha)
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(cx+124, cy-1, 6, 48, 0, 0, Math.PI*2);
        ctx.strokeStyle = '#4b7a5c';
        ctx.lineWidth = 2.6;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(80, 140, 100, 0.06)';
        ctx.fill();

        // Legendas
        ctx.globalAlpha = 0.8;
        ctx.font = '500 12px "Inter", sans-serif';
        ctx.fillStyle = '#1d553a';
        ctx.fillText('🟢 Retina', cx+132, cy-48);

        ctx.fillStyle = '#b07d2a';
        ctx.fillText('⚡ foco', focusX-20, focusY-22);

        ctx.fillStyle = '#1f5a7a';
        ctx.fillText('🔵 Cristalino', lensX-30, lensY-30);

        ctx.fillStyle = '#2f6888';
        ctx.fillText('🔹 Córnea', cx-28, cy-84);

        ctx.restore();
    }

    // Atualiza a partir dos sliders
    function updateFromSliders() {
        curvature = parseFloat(curvatureSlider.value);
        focusOffset = parseFloat(focusSlider.value);
        curvatureValue.textContent = curvature.toFixed(2);
        focusValue.textContent = focusOffset.toFixed(2);
        drawEye();
    }

    // Eventos
    curvatureSlider.addEventListener('input', updateFromSliders);
    focusSlider.addEventListener('input', updateFromSliders);

    resetBtn.addEventListener('click', function() {
        curvatureSlider.value = '1.0';
        focusSlider.value = '1.0';
        updateFromSliders();
    });

    // Desenho inicial
    updateFromSliders();

    // Redesenha em resize (para manter qualidade)
    window.addEventListener('resize', drawEye);

    // Previne scroll em touch no canvas
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
})();
