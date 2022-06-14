import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
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

function configScene (scene, camera) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 24, 24),
    new THREE.MeshBasicMaterial({ color: 'rgb(255, 255, 255)' })
  )
  const light = new THREE.PointLight('rgb(255, 255, 255)', 1)
  light.castShadow = true
  light.add(sphere)
  scene.add(light)
  light.intensity = 2
  light.position.x = 0
  light.position.y = 2
  light.position.z = 0
  gui.add(light, 'intensity', 0, 5, 0.1)
  gui.add(light.position, 'x', -10, 10, 0.1)
  gui.add(light.position, 'y', 0, 10, 0.1)
  gui.add(light.position, 'z', -10, 10, 0.1)
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
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

  for (let x = -2.5; x <= 2.5; x++) {
    for (let z = -2.5; z <= 2.5; z++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshPhongMaterial({ color: 'rgb(155, 155, 155)' })
      )
      box.name = `box-${x}-${z}`
      box.castShadow = true
      box.position.x = x * 1.8
      box.position.z = z * 1.8
      boxGrid.add(box)
    }
  }
  boxGrid.position.y = boxGrid.children[0].geometry.parameters.height * 0.5
  scene.add(boxGrid)

  camera.position.x = 8
  camera.position.y = 4
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
  renderer.setClearColor('rgb(205, 205, 205)')
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

