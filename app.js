// ------------------
// Constants
// ------------------
const TICK_ANGLE = 7.5;

const BASE_ANGLES = {
  E: 0,
  NE: 45,
  N: 90,
  NW: 135,
  W: 180,
  SW: 225,
  S: 270,
  SE: 315
};

// ------------------
// Globals
// ------------------
let scene, camera, renderer, labelRenderer, controls;
let pointsGroup;

// ------------------
// Math (UNCHANGED)
// ------------------
function directionTicksToRadians(direction, ticksRight) {
  const base = BASE_ANGLES[direction.toUpperCase()];
  const angleDeg = (base - ticksRight * TICK_ANGLE) % 360;
  return angleDeg * Math.PI / 180;
}

function calculatePosition(direction, ticksRight, distance, depth, observingLifePod) {
  const z = -depth;
  const horizontal = Math.sqrt(distance * distance - depth * depth);
  let theta = directionTicksToRadians(direction, ticksRight);

  if (observingLifePod) {
    theta += Math.PI;
  }

  return {
    x: horizontal * Math.cos(theta),
    y: horizontal * Math.sin(theta),
    z
  };
}

// ------------------
// Init
// ------------------
init();
animate();
fetch("observations.csv")
  .then(r => r.text())
  .then(parseCSV);

// ------------------
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x001421);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  // MAP-FIRST VIEW (important)
  camera.position.set(0, -900, 700); // south + above
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(labelRenderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableRotate = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.update();

  pointsGroup = new THREE.Group();
  scene.add(pointsGroup);

  addGrid();
  addAxes();
  addScaleMarkers();

  window.addEventListener("resize", onResize);
}

// ------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// ------------------
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// ------------------
// Visual helpers
// ------------------
function addGrid() {
  const grid = new THREE.GridHelper(3000, 15, 0x3a6ea5, 0x1b3a57);
  grid.rotation.x = Math.PI / 2;
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  scene.add(grid);
}

function addAxes() {
  const axes = new THREE.AxesHelper(400);
  scene.add(axes);
}

// Only ONE subtle reference per axis
function addScaleMarkers() {
  const step = 200;
  const range = 1500;

  for (let i = step; i <= range; i += step) {
    addScaleLabel(i, 0, 0, `${i} m`);     // East
    addScaleLabel(0, i, 0, `${i} m`);     // North
    addScaleLabel(0, 0, -i, `${i} m`);    // Depth
  }
}


// ------------------
// Labels
// ------------------
function addScaleLabel(x, y, z, text) {
  const div = document.createElement("div");
  div.className = "scale-label";
  div.textContent = text;

  const label = new THREE.CSS2DObject(div);
  label.position.set(x, y, z);
  scene.add(label);
}

// ------------------
// Points
// ------------------
function addPoint(x, y, z, name, isLifePod) {
  const geom = isLifePod
    ? new THREE.ConeGeometry(25, 60, 16)
    : new THREE.SphereGeometry(10, 16, 16);

  const mat = new THREE.MeshBasicMaterial({
    color: isLifePod ? 0xffcc00 : 0x4dd0e1
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);

  if (isLifePod) {
    mesh.rotation.x = Math.PI / 2;
  }

  pointsGroup.add(mesh);

  const div = document.createElement("div");
  div.className = "label";
  div.textContent = name;

  const label = new THREE.CSS2DObject(div);
  label.position.set(0, 0, 20);
  mesh.add(label);
}

// ------------------
// CSV
// ------------------
function parseCSV(text) {
  pointsGroup.clear();

  const lines = text.trim().split("\n");
  for (let i = 1; i < lines.length; i++) {
    const [
      name,
      direction,
      ticks,
      distance,
      depth,
      observingLifePod
    ] = lines[i].split(",");

    const pos = calculatePosition(
      direction.trim(),
      Number(ticks),
      Number(distance),
      Number(depth),
      observingLifePod.trim().toLowerCase() === "true"
    );

    const isLifePod = name.trim().toLowerCase().includes("life");

    addPoint(pos.x, pos.y, pos.z, name.trim(), isLifePod);
  }
}
