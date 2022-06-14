import * as THREE from 'three'
import * as dat from 'dat.gui'
import OrbitControls from 'three-orbitcontrols'
import noise from 'noisejs-ilmiont'
const gui = new dat.GUI()
noise.seed(Math.random())
const clock = new THREE.Clock()

const grid = {
  size: 32,
  box: 1,
  distance: 5,
  wavelength: {
    x: 16,
    y: 16
  },
  frequency: 0.25,
  amplitude: 5,
}

const guiWaveProps = gui.addFolder('Wave Properties')
const guiWavelength = guiWaveProps.addFolder('Wavelength')
guiWavelength.add(grid.wavelength, 'x', 0.01, 128.0, 0.001)
guiWavelength.add(grid.wavelength, 'y', 0.01, 128.0, 0.001)
guiWaveProps.add(grid, 'frequency', 0.001, 5.0, 0.001)
guiWaveProps.add(grid, 'amplitude', 1, 64, 0.001)
const guiTerrainProps = gui.addFolder('Terrain Properties')
guiTerrainProps.add(grid, 'scale')
guiTerrainProps.add(grid, 'scaleSize', 0.001, 20, 0.001)
guiTerrainProps.add(grid, 'noInvert')
guiTerrainProps.add(grid, 'terrain')
guiTerrainProps.add(grid, 'tAmplitude', 1, 64, 0.001)
guiTerrainProps.add(grid, 'tSmooth')
guiTerrainProps.add(grid, 'tSmoothAmount', 0.001, 100, 0.001)

function fourQuadrantGrid (size, callback) {
  let offset = size / 2
  let start = offset * -1
  let i = 1
  let r = size * size
  for (let x = start; x < offset; x++) {
    for (let y = start; y < offset; y++) {
      callback(x, y, i, r)
      i++
      r--
    }
  }
}

const container = {
  el: document.querySelector('#scene'),
  height () {
    return this.el.getBoundingClientRect().height
  },
  width () {
    return this.el.getBoundingClientRect().width
  }
}

function configScene (scene, camera) {
  const light = new THREE.DirectionalLight(0xffffff, 1.5)
  light.castShadow = true
  light.shadow.camera.top = 50
  light.shadow.camera.bottom = -50
  light.shadow.camera.left = -50
  light.shadow.camera.right = 50
  light.shadow.bias = 0.001
  light.shadow.mapSize.width = 8192
  light.shadow.mapSize.height = 8192
  light.position.set(25, 50, 25)
  light.lookAt(0, 0, 0)
  scene.add(light)
  const ambient = new THREE.AmbientLight('rgb(60,0,155)', 2)
  scene.add(ambient)
  scene.fog = new THREE.FogExp2('rgb(20,0,155)', 0.0055)

  const boxGrid = new THREE.Group()
  fourQuadrantGrid(grid.size, (x, y) => {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(grid.box, grid.box, grid.box),
      new THREE.MeshPhongMaterial({ color: 'rgb(165, 165, 165)' })
    )
    box.name = `box-${x}-${y}`
    box.castShadow = true
    box.position.x = x * grid.distance
    box.position.z = y * grid.distance
    boxGrid.add(box)
  })
  boxGrid.position.y = boxGrid.children[0].geometry.parameters.height * 0.5
  boxGrid.name = 'boxGrid'
  scene.add(boxGrid)

  camera.position.y = 150
  camera.lookAt(0, 0, 0)
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
  configScene(scene, camera)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.width(), container.height())
  renderer.shadowMap.enabled = true
  renderer.setClearColor('rgb(020,0,155)')
  container.el.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableKeys = false
  return { scene, camera, renderer, controls }
}

function render (init) {
  const { scene, camera, renderer, controls } = init
  renderer.render(scene, camera)
  controls.update()
  const time = clock.getElapsedTime()
  fourQuadrantGrid(grid.size, (x, y, i, r) => { })
  window.requestAnimationFrame(() => {
    render(init)
  })
}

window.environment3d = init(container, configScene)
render(window.environment3d)
