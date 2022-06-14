import * as THREE from 'three'
import * as dat from 'dat.gui'
const gui = new dat.GUI()

const container = {
  el: document.querySelector('#scene'),
  height () {
    return this.el.getBoundingClientRect().height
  },
  width () {
    return this.el.getBoundingClientRect().width
  }
}

function changeColor (property, color) {
  property.color.set(color)
}

function configLights (scene, camera) {
  const params = {
    color: 0xffffff,
    amColor: 0xffffff
  }
  const guiLightControls = gui.addFolder('Light Controls')
  const amLight = new THREE.AmbientLight(params.amColor, 0)
  const guiAmbientLight = guiLightControls.addFolder('Ambient')
  guiAmbientLight.add(amLight, 'intensity', 0, 5, 0.1)
  guiAmbientLight.addColor(params, 'amColor').onChange(() => {
    changeColor(amLight, params.amColor)
  })
  scene.add(amLight)
  for (let i = 0; i < 2; i++) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 24, 24),
      new THREE.MeshBasicMaterial({ color: params.color })
    )
    const light = new THREE.PointLight(params.color, 1)
    light.position.y = 10
    light.position.x = -8
    light.position.z = -8
    if (i > 0) {
      light.intensity = 0.5
      light.position.x = light.position.x * -1
    }
    light.castShadow = true
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.add(sphere)
    scene.add(light)
    const folder = guiLightControls.addFolder(`Light ${i + 1}`)
    folder.add(light, 'intensity', 0, 5, 0.1)
    folder.addColor(params, 'color').onChange(() => {
      changeColor(light, params.color)
      changeColor(sphere.material, params.color)
    })
    folder.add(light.position, 'x', -20, 20, 0.1)
    folder.add(light.position, 'y', 0, 20, 0.1)
    folder.add(light.position, 'z', -20, 20, 0.1)
  }
}
function configGround (scene, size) {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshPhongMaterial({
      color: 'rgb(125, 125, 125)',
      side: THREE.DoubleSide
    })
  )
  plane.name = 'myplane'
  plane.receiveShadow = true
  plane.rotation.x += THREE.Math.degToRad(90)
  scene.add(plane)
}

function configCamera (camera, scene, config) {
  // Create the null objects for pitch and yaw
  const pitch = new THREE.Group()
  const yaw = new THREE.Group()

  // Add the camera to pitch controller
  // Camera should be the deepest nested item in the rig
  pitch.add(camera)
  // Add the pitch controller to yaw the contoller
  yaw.add(pitch)
  // Add the yaw controller to the scene
  scene.add(yaw)

  // Set the initial values for the rig
  camera.position.x = config.position.x
  camera.position.y = config.position.y
  camera.position.z = config.position.z
  pitch.rotation.x = config.rotation.x
  yaw.rotation.y = config.rotation.y
  camera.rotation.z = config.rotation.z

  // Setup controls to test
  if (config.gui) {
    const guiCameraControls = gui.addFolder('Camera Controls')
    guiCameraControls
      .add(camera.position, 'x', -100, 100, 0.001)
      .name('Left/Right')
    guiCameraControls
      .add(camera.position, 'y', -100, 100, 0.001)
      .name('Down/Up')
    guiCameraControls
      .add(camera.position, 'z', -100, 100, 0.001)
      .name('Forward/Back')
    guiCameraControls
      .add(pitch.rotation, 'x', -Math.PI, Math.PI, 0.0001)
      .name('Pitch')
    guiCameraControls
      .add(yaw.rotation, 'y', -Math.PI, Math.PI, 0.0001)
      .name('Yaw')
    guiCameraControls
      .add(camera.rotation, 'z', -Math.PI, Math.PI, 0.0001)
      .name('Rotate')
  }
}

function configObjects (scene) {
  const params = {
    color: 0xafafaf
  }
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3.5, 1, 100, 16),
    new THREE.MeshBasicMaterial({ color: params.color })
  )
  torus.castShadow = true
  torus.name = 'torus'
  torus.position.y += torus.geometry.parameters.radius * 2
  scene.add(torus)
  const guiMaterialControls = gui.addFolder('Object Controls')
  guiMaterialControls.addColor(params, 'color').onChange(() => {
    changeColor(torus.material, params.color)
  })
}

function configScene (scene, camera, renderer) {
  configLights(scene, camera)
  configGround(scene, 100)
  configCamera(camera, scene, {
    gui: false,
    position: {
      x: 0,
      y: 6,
      z: 18
    },
    rotation: {
      x: -0.25,
      y: 3.14,
      z: 0
    }
  })
  configObjects(scene)
  const fog = {
    color: 0x000000,
    density: 0.03
  }
  scene.fog = new THREE.FogExp2(fog.color, fog.density)
  const guiSceneControls = gui.addFolder('Scene Controls')
  guiSceneControls
    .addColor(fog, 'color')
    .name('Fog Color')
    .onChange(() => {
      changeColor(scene.fog, fog.color)
      renderer.setClearColor(fog.color)
    })
  guiSceneControls.add(scene.fog, 'density', 0, 0.15, 0.001).name('Fog Density')
}

function init (container, configScene) {
  const scene = new THREE.Scene()
  const cam = {
    fov: 55,
    aspect: container.width() / container.height(),
    near: 0.1,
    far: 1000
  }
  const camera = new THREE.PerspectiveCamera(
    cam.fov,
    cam.aspect,
    cam.near,
    cam.far
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.width(), container.height())
  renderer.shadowMap.enabled = true
  configScene(scene, camera, renderer)
  container.el.appendChild(renderer.domElement)
  return { scene, camera, renderer }
}

function render (init) {
  const { scene, camera, renderer } = init
  renderer.render(scene, camera)
  const torus = scene.getObjectByName('torus')
  torus.rotation.x += 0.025
  torus.rotation.y += 0.025
  window.requestAnimationFrame(() => {
    render(init)
  })
}

window.environment3d = init(container, configScene)
render(window.environment3d)
console.log(window.environment3d)
