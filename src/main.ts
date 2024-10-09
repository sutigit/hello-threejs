import './style.css'
import * as THREE from 'three';

const width = 1280;
const height = 720;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2d2a2e);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);


document.querySelector<HTMLDivElement>('#app')!.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);

// Define materials with different colors for each face of the cube
const materials = [
  new THREE.MeshBasicMaterial({ color: 0xff6188 }), // red - front face
  new THREE.MeshBasicMaterial({ color: 0xa9dc76 }), // green - back face
  new THREE.MeshBasicMaterial({ color: 0x78dce8 }), // blue - top face
  new THREE.MeshBasicMaterial({ color: 0xffd866 }), // yellow - bottom face
  new THREE.MeshBasicMaterial({ color: 0xab9df2 }), // purple - right face
  new THREE.MeshBasicMaterial({ color: 0xfc9867 })  // orange - left face
];

// Apply the materials to the cube by passing the array of materials
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 4;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables to track swipe
let previousMouseX = 0;
let swipeSpeedX = 0;
let previousMouseY = 0;
let swipeSpeedY = 0;
let isCubeHovered = false;


// Animation variables
const friction = 0.45; // Friction to slow down the cube rotation
const swipeSpeedScale = 0.05; // Scaling the swipe speed


// Track mouse movement to calculate swipe speed
window.addEventListener('mousemove', (event) => {
  // Update mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check if the cube is hovered
  const intersects = raycaster.intersectObject(cube);
  isCubeHovered = intersects.length > 0;

  // Only calculate swipe speed if hovering over the cube
  if (isCubeHovered) {
    // Calculate horizontal swipe speed based on mouse movement
    swipeSpeedX = (event.clientX - previousMouseX) * swipeSpeedScale; // Scaling the swipe speed
    previousMouseX = event.clientX; // Update the previous mouse X for the next move

    // Calculate vertical swipe speed based on mouse movement
    swipeSpeedY = (event.clientY - previousMouseY) * swipeSpeedScale; // Scaling the swipe speed
    previousMouseY = event.clientY; // Update the previous mouse Y for the next move
  }
});


// Animation loop to rotate the cube based on swipe
function animate() {
  requestAnimationFrame(animate);

  // If the cube is being hovered and there's a swipe speed, apply rotation
  if (isCubeHovered && Math.abs(swipeSpeedX) > 0.01 && Math.abs(swipeSpeedY) > 0.01) {
    cube.rotation.y += swipeSpeedX; // Rotate the cube horizontally (on Y axis)
    cube.rotation.x += swipeSpeedY; // Rotate the cube vertically (on X axis)
    swipeSpeedX *= friction; // Gradually reduce swipe speed for a "friction" effect
    swipeSpeedY *= friction; // Gradually reduce swipe speed for a "friction" effect
  }

  renderer.render(scene, camera);
}

animate(); // Start the animation loop