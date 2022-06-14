import * as THREE from 'three'

function getDimensions ({ geometry, scale }) {
  return {
    y: geometry.parameters.height * scale.y,
    x: geometry.parameters.width * scale.x,
    z: geometry.parameters.depth * scale.z
  }
}

const container = document.querySelector('main')
const height = () => container.getBoundingClientRect().height
const width = () => container.getBoundingClientRect().width

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, width() / height(), 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  })
)

const group = new THREE.Group()
group.add(box)
group.add(plane)
scene.add(group)

camera.position.x = 1
camera.position.y = 2
camera.position.z = 5
camera.lookAt(box.position)

box.scale.x = 1.8
box.scale.y = 1.8
box.scale.z = 1.8
box.position.y += getDimensions(box).y * 0.5

plane.rotation.x = THREE.MathUtils.degToRad(90)
plane.scale.x = 1000
plane.scale.y = 1000

renderer.setSize(width(), height())
container.appendChild(renderer.domElement)

function render () {
  box.rotation.y = clock.getElapsedTime()

  window.requestAnimationFrame(() => render())
  renderer.render(scene, camera)
}

render()

window.addEventListener('resize', () => {
  clearTimeout(window.___timeout)

  window.___timeout = setTimeout(() => {
    renderer.setSize(width(), height())
    camera.aspect = width() / height()
    camera.updateProjectionMatrix()
  }, 100)
})
