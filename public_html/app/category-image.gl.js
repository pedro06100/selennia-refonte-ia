import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

export function mountCategoryImage(canvas, imageUrl) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    22,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    10
  );
  camera.position.z = 2.5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const texture = new THREE.TextureLoader().load(imageUrl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const geometry = new THREE.PlaneGeometry(2.2, 1.4);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.05
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(0.4, 0.8, 1.5);
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  let targetX = 0;
  let targetY = 0;
  let raf;

  const onMove = e => {
    const r = canvas.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.12;
    targetY = -((e.clientY - r.top) / r.height - 0.5) * 0.12;
  };

  canvas.addEventListener("mousemove", onMove);

  const animate = () => {
    plane.rotation.y += (targetX - plane.rotation.y) * 0.06;
    plane.rotation.x += (targetY - plane.rotation.x) * 0.06;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };

  animate();

  const resize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };

  window.addEventListener("resize", resize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("mousemove", onMove);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}
