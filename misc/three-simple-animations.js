import * as dat from 'dat.gui'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
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
  light.position.set(-60, 50, -75)
  light.lookAt(0, 0, 0)
  gui.add(light.position, 'x', -75, 75, 1)
  gui.add(light.position, 'y', -75, 75, 1)
  gui.add(light.position, 'z', -75, 75, 1)
  const helper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(helper)
  scene.add(light)
  const ambient = new THREE.AmbientLight('rgb(60,0,155)', 2)
  scene.add(ambient)
  scene.fog = new THREE.FogExp2('rgb(20,0,155)', 0.018)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({
      color: 'rgb(125, 125, 125)',
      side: THREE.DoubleSide
    })
  )
  plane.name = 'myplane'
  plane.receiveShadow = true
  plane.rotation.x += THREE.Math.degToRad(90)
  scene.add(plane)

  const boxGrid = new THREE.Group()
  for (let x = -8; x <= 8; x++) {
    for (let z = -8; z <= 8; z++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 'rgb(165, 165, 165)' })
      )
      box.name = `box-${x}-${z}`
      box.castShadow = true
      box.position.x = x * 4
      box.position.z = z * 4
      boxGrid.add(box)
    }
  }
  boxGrid.position.y = boxGrid.children[0].geometry.parameters.height * 0.5
  boxGrid.name = 'boxGrid'
  scene.add(boxGrid)

  camera.position.x = -35
  camera.position.z = -35
  camera.position.y = 15
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
  return { scene, camera, renderer, controls }
}

function render (init) {
  const { scene, camera, renderer, controls } = init
  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(() => {
    render(init)
  })
}

window.environment3d = init(container, configScene)
render(window.environment3d)
console.log(window.environment3d)
