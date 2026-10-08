document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- BANDERINES DIBUJADOS EN CANVAS ---
  function drawGarlands() {
    const colors = ['#ff7675', '#74b9ff', '#ffeaa7', '#a29bfe', '#55efc4', '#fd79a8'];
    const flagWidth = 30;
    const flagHeight = 35;
    const count = Math.ceil(canvas.width / flagWidth);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(canvas.width / 2, 25, canvas.width, 0);
    ctx.stroke();

    for (let i = 0; i < count; i++) {
      const x = i * flagWidth;
      const y = Math.sin((i / count) * Math.PI) * 12;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + flagWidth, y);
      ctx.lineTo(x + flagWidth / 2, y + flagHeight);
      ctx.closePath();
      ctx.fill();
    }
  }

  // --- GLOBOS FLOTANTES CON HILO ---
  const globos = Array.from({ length: 12 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight,
    radius: 18 + Math.random() * 12,
    color: ['#ff7675', '#74b9ff', '#ffeaa7', '#a29bfe', '#55efc4', '#fd79a8'][Math.floor(Math.random() * 6)],
    speed: 0.6 + Math.random() * 0.8,
    swing: Math.random() * Math.PI * 2
  }));

  function updateGlobos() {
    globos.forEach(g => {
      g.y -= g.speed;
      g.swing += 0.02;
      g.x += Math.sin(g.swing) * 0.5;

      if (g.y < -60) {
        g.y = canvas.height + 60;
        g.x = Math.random() * canvas.width;
      }

      // Dibujar globo
      ctx.beginPath();
      ctx.ellipse(g.x, g.y, g.radius * 0.85, g.radius, 0, 0, Math.PI * 2);
      ctx.fillStyle = g.color;
      ctx.fill();

      // Brillo del globo
      ctx.beginPath();
      ctx.ellipse(g.x - g.radius * 0.3, g.y - g.radius * 0.3, g.radius * 0.2, g.radius * 0.3, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // Nudo e hilo
      ctx.beginPath();
      ctx.moveTo(g.x, g.y + g.radius);
      ctx.lineTo(g.x - 3, g.y + g.radius + 6);
      ctx.lineTo(g.x + 3, g.y + g.radius + 6);
      ctx.fillStyle = g.color;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(g.x, g.y + g.radius + 6);
      ctx.quadraticCurveTo(g.x + 10, g.y + g.radius + 20, g.x - 5, g.y + g.radius + 40);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // --- RASTRO MÁGICO DEL RATÓN ---
  const particles = [];
  const mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    for (let i = 0; i < 3; i++) {
      particles.push({
        x: mouse.x,
        y: mouse.y,
        size: Math.random() * 8 + 4,
        color: `hsl(${Math.random() * 360}, 90%, 65%)`,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        alpha: 1,
        shape: Math.random() > 0.5 ? 'heart' : 'star'
      });
    }
  });

  function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    ctx.fill();
    ctx.restore();
  }

  function drawStar(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size + x, -Math.sin((18 + i * 72) * Math.PI / 180) * size + y);
      ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (size / 2) + x, -Math.sin((54 + i * 72) * Math.PI / 180) * (size / 2) + y);
    }
    ctx.fill();
    ctx.restore();
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        if (p.shape === 'heart') {
          drawHeart(p.x, p.y, p.size, p.color, p.alpha);
        } else {
          drawStar(p.x, p.y, p.size, p.color, p.alpha);
        }
      }
    }
  }

  // --- BUCLE PRINCIPAL DE ANIMACIÓN ---
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGarlands();
    updateGlobos();
    updateParticles();

    requestAnimationFrame(animate);
  }

  animate();

  // --- LÓGICA DE CONFETI Y MENSAJE ---
  const btn = document.getElementById('surpriseBtn');
  const letter = document.getElementById('letter');

  confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

  btn.addEventListener('click', () => {
    letter.classList.toggle('open');
    if (letter.classList.contains('open')) {
      btn.innerText = "Cerrar mensaje ✉️";
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
    } else {
      btn.innerText = "Toca para una sorpresa 🎁";
    }
  });
});