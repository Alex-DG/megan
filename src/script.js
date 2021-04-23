import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { hideLoading, trackProgress } from './utils/loader'
import { updateAllMaterials } from './utils/update'
import { showError } from './utils/error'
import { guiPosition, guiDirectionalLight } from './utils/guiHelper'
import { fadeToAction } from './utils/animation'

import * as dat from 'dat.gui'

/**
 * Project template: gui, scene/ground/camera, orbital controls!
 */
console.log('...::..::: Loading Megan 🤖 :::..::.:..')

/**
 * MODEL PATHS
 */
// const MEGAN_PATH = '/models/Megan/Megan.glb'

// Megan model optimised with gltf-pipeline binary file is now ~20% smaller
// https://github.com/CesiumGS/gltf-pipeline => command `> gltf-pipeline -i Megan.glb -0 MeganDraco.glb -d`
const MEGAN_DRACO_PATH = '/models/Megan/Megan-processed.glb'

// Bone Animation Sequence file
const FILE_BONE_ANIMATION = '/models/Megan/Megan.rts'

/**
 * [ Base ]
 */
// Debug
const gui = new dat.GUI({ width: 400 })

let parameters = {
  wireframe: false,
  ground: false,
  action: 'none',
}

const displayFolder = gui.addFolder('Display')
const lightFolder = gui.addFolder('Light')
const animationsFolder = gui.addFolder('Animations')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Model
let content

// Animation
let mixer

// Window sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Base camera
//https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(0, 0, 1) // move the camera on Z to see Megan, z = 1
scene.add(camera)

// Controls
// https://threejs.org/docs/#examples/en/controls/OrbitControls.enableDamping
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // enable inertia to give a sense of weight to the controls

/**
 * [ Model ]
 */
// Draco is a compression method that can be used inside of glTF files
// https://threejs.org/docs/#examples/en/loaders/DRACOLoader
const dracoLoader = new DRACOLoader()
// Specify path to a folder containing WASM/JS decoding libraries.
dracoLoader.setDecoderPath('/draco/')
// Optional: Pre-fetch Draco WASM/JS module.
dracoLoader.preload()

const gltfLoader = new GLTFLoader() // Initialise loader
// glTF loader is setup with the draco loader which means
// if you load a draco file the draco loader will kick off, if it's a standard
// glTF file the glTF loader is smart enough to not load draco in that case when not needed
gltfLoader.setDRACOLoader(dracoLoader)

// Bone Animation Sequence file
const fileLoader = new THREE.FileLoader()
// fileLoader.setResponseType('arraybuffer')

// Load a text file and output the result to the console
fileLoader.load(
  // resource URL
  FILE_BONE_ANIMATION,

  // onLoad callback
  (file) => {
    // output the text to the console
    console.log(file)
  },

  (xhr) => trackProgress(xhr),
  (error) => showError(error)
)

gltfLoader.load(
  MEGAN_DRACO_PATH,
  (gltf) => {
    content = gltf

    console.log({ gltf })

    // Center Megan into the viewport
    const box = new THREE.Box3().setFromObject(content.scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    content.scene.position.sub(center)

    // From "model's scene" to "our scene!"
    scene.add(content.scene)

    // Add Skeleton helper option to GUI
    const helper = new THREE.SkeletonHelper(content.scene)
    helper.visible = false
    scene.add(helper)
    displayFolder.add(helper, 'visible').name('skeleton')

    // Populate GUI with display properties coming from the glb scene
    guiPosition(displayFolder, content.scene)

    /**
     * Animations
     */
    const { animations } = content || { animations: [] }
    mixer = new THREE.AnimationMixer(content.scene)

    // Create Array of actions
    const actions = [parameters.action, ...animations.map(({ name }) => name)]

    // Populate GUI with actions
    animationsFolder.add(parameters, 'action', actions).onChange((value) => {
      switch (value) {
        case 'none':
          fadeToAction(undefined, 0.5) // stop previous action
          break
        default:
          const action = mixer.clipAction(
            animations.find((a) => a.name === value)
          )
          fadeToAction(action, 0.5) // play selected action
      }
    })

    /**
     * Loading done with success!
     */
    hideLoading()

    console.log('...::..::: Hi from Megan-processed! 👋 :::..::.:..')
  },

  (xhr) => trackProgress(xhr),
  (error) => showError(error)
)

/**
 * [ Ground ]
 *
 * This Mesh was initially used to:
 * - test if the project template initially was working and redering something before loading Megane
 * - playing with the lighting and shadow
 * - I kept it as a GUI option disabled by default
 */
let ground = null
let groundGeometry = null
let groundMaterial = null

const generateGround = () => {
  // Remove ground before generation if it does already exist
  if (ground !== null) {
    groundGeometry.dispose()
    groundMaterial.dispose()

    scene.remove(ground)
  }

  if (parameters.ground) {
    groundGeometry = new THREE.PlaneGeometry(2, 2)
    groundMaterial = new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5,
      transparent: true,
    })

    ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.receiveShadow = true
    ground.rotation.x = -Math.PI * 0.5
    ground.position.y = -0.2

    scene.add(ground)
  }
}

generateGround()

/**
 * [ Lights ]
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(2, 5, 5)

scene.add(directionalLight, ambientLight)

/**
 * [ Axes ]
 */
const axesHelper = new THREE.AxesHelper(5)
axesHelper.visible = false
scene.add(axesHelper)

/**
 * [ Events ]
 */
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
 * [ GUI ]
 */
// --- Display ---
displayFolder.add(parameters, 'wireframe').onChange((value) => {
  updateAllMaterials(scene, (material) => {
    material.wireframe = value
  })
})

displayFolder.add(controls, 'autoRotate')
displayFolder.add(controls, 'autoRotateSpeed').min(1).max(20).step(1)

displayFolder.add(parameters, 'ground').onChange((value) => {
  parameters.ground = value
  generateGround() // re generate Ground
})

displayFolder.add(axesHelper, 'visible').name('Axes')

// --- Light ---
guiDirectionalLight(lightFolder, directionalLight)

lightFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('ambientIntensity')

/**
 * [ Renderer ]
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, // reducing how blocky Megan looks.
  alpha: true, // testing css background color
})

// Change default outputEncoding to sRGBEncoding: improve the color result rendering of Megan
// https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer.outputEncoding
renderer.outputEncoding = THREE.sRGBEncoding

// Change the default lights rendering for more realistic values
//https://threejs.org/docs/#api/en/renderers/WebGLRenderer.physicallyCorrectLights
renderer.physicallyCorrectLights = true

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * [ Animate ]
 */
const clock = new THREE.Clock()
let previousTime = 0

const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Model animation
  mixer?.update(deltaTime)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call animate again on the next frame
  window.requestAnimationFrame(animate)
}

animate()
