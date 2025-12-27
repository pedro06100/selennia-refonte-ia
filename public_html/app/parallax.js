export function initParallax(canvas) {
  const ctx = canvas.getContext("2d");

  const img = new Image();
  const depth = new Image();

  img.src = canvas.dataset.image;
  depth.src = canvas.dataset.depth;

  const strength = Number(canvas.dataset.strength || 15);

  let mouseX = 0;
  let mouseY = 0;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / r.width - 0.5;
    mouseY = (e.clientY - r.top) / r.height - 0.5;
  });

  Promise.all([
    new Promise(r => img.onload = r),
    new Promise(r => depth.onload = r)
  ]).then(() => {
    resize();
    render();
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dx = mouseX * strength;
    const dy = mouseY * strength;
    ctx.drawImage(img, dx, dy, canvas.width, canvas.height);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
}
