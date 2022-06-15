import CameraControls from 'camera-controls'
// import GUI from 'lil-gui'
import * as THREE from 'three'
import { getDimensions, getGrid } from './helpers'

const container = document.querySelector('main')
const height = () => container.getBoundingClientRect().height
const width = () => container.getBoundingClientRect().width

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(55, width() / height(), 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide
  })
)

const grid = getGrid(6)
const boxGrid = grid.reduce((pre, cur, i, arr) => {
  const hue = Math.round(cur.i * 256 / arr.length)

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({
      color: `hsl(${hue}, 75%, 50%)`
    })
  )

  box.scale.x = 1
  box.scale.y = 1 + (cur.r / 8)
  box.scale.z = 1
  box.position.y += getDimensions(box).y * 0.5
  box.position.x = cur.x * 4
  box.position.z = cur.z * 4
  box.name = `box-${cur.i}`

  return pre.add(box)
}, new THREE.Group())

const group = new THREE.Group()
group.add(plane)
group.add(boxGrid)
scene.add(group)

camera.position.x = 15
camera.position.y = 3
camera.position.z = 0

plane.rotation.x = THREE.MathUtils.degToRad(90)
plane.scale.x = 1000
plane.scale.y = 1000

renderer.setSize(width(), height())
container.appendChild(renderer.domElement)

CameraControls.install({ THREE })
const cameraControls = new CameraControls(camera, container)

function render () {
  cameraControls.update(clock.getDelta())

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
