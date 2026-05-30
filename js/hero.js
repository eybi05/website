const canvas = document.getElementById('heroCanvas');
if (!canvas) throw new Error('no canvas');

const ctx = canvas.getContext('2d');
let W, H, nodes, raf;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function mkNode() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
  };
}

function init() {
  resize();
  nodes = Array.from({ length: 80 }, mkNode);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const nodeColor = isDark ? 'rgba(139,92,246,' : 'rgba(99,102,241,';
  const lineColor = isDark ? 'rgba(99,102,241,' : 'rgba(99,102,241,';
  const dist = 140;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = nodeColor + '0.6)';
    ctx.fill();

    for (let j = i + 1; j < nodes.length; j++) {
      const m = nodes[j];
      const dx = n.x - m.x, dy = n.y - m.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < dist) {
        const a = (1 - d / dist) * 0.18;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = lineColor + a + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  raf = requestAnimationFrame(draw);
}

window.addEventListener('resize', () => { resize(); });
init();
draw();
