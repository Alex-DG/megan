import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { hideLoading, trackProgress } from './utils/loader'
import { updateAllMaterials } from './utils/update'
import { showError } from './utils/error'
import { guiPosition, guiDirectionalLight } from './utils/guiHelper'

import * as dat from 'dat.gui'

/**
 * Project template: gui, scene/floor/camera, orbital controls
 */
console.log('...::..::: Loading Megan 🤖 :::..::.:..')

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 })

const parameters = {
  wireframe: false,
  floor: true,
}

const displayFolder = gui.addFolder('Display')
const lightFolder = gui.addFolder('Light')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Model
let content

// Binary path
const MEGAN_PATH = '/models/Megan/Megan.glb'

/**
 * Model
 */
const gltfLoader = new GLTFLoader() // initialise loader
gltfLoader.load(
  MEGAN_PATH,
  (gltf) => {
    content = gltf

    // Make Megan bigger
    content.scene.scale.set(10, 10, 10)

    // From "model's scene" to "our scene!"
    scene.add(content.scene)

    console.log('...::..::: Hi from Megan 👋 :::..::.:..')

    guiPosition(displayFolder, content.scene)
    hideLoading()
  },
  (xhr) => trackProgress(xhr),
  (error) => showError(error)
)

/**
 * Floor
 */
let floor = null
let floorGeometry = null
let floorMaterial = null

const generateFloor = () => {
  // Remove floor before generation if it does already exist
  if (floor !== null) {
    floorGeometry.dispose()
    floorMaterial.dispose()

    scene.remove(floor)
  }

  if (parameters.floor) {
    floorGeometry = new THREE.PlaneGeometry(10, 10)
    floorMaterial = new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5,
      transparent: true,
    })

    floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    floor.position.y = -1.4

    scene.add(floor)
  }
}

generateFloor()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)

scene.add(directionalLight, ambientLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  80,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, 0.9, 3)
scene.add(camera)

// Controls
let controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)

/**
 * GUI
 */

// --- Display ---
displayFolder.add(parameters, 'wireframe').onChange((value) => {
  updateAllMaterials(scene, (material) => {
    material.wireframe = value
  })
})

displayFolder.add(controls, 'autoRotate')
displayFolder.add(controls, 'autoRotateSpeed').min(1).max(20).step(1)

displayFolder.add(parameters, 'floor').onChange((value) => {
  parameters.floor = value
  generateFloor() // re generate Floor
})

// --- Light ---
guiDirectionalLight(lightFolder, directionalLight)

lightFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('ambientIntensity')

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // testing css background color
})
renderer.physicallyCorrectLights = true // enable realistc lightning
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// const clock = new THREE.Clock()

const animate = () => {
  // const elapsedTime = clock.getElapsedTime()
  // const deltaTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

animate()
