import CameraControls from 'camera-controls'
import * as THREE from 'three'

export const container = document.querySelector('main')
export const height = () => container.getBoundingClientRect().height
export const width = () => container.getBoundingClientRect().width

export const scene = new THREE.Scene()
export const clock = new THREE.Clock()
export const camera = new THREE.PerspectiveCamera(
  55,
  width() / height(),
  0.1,
  1000
)
export const renderer = new THREE.WebGLRenderer()

camera.position.x = 15
camera.position.y = 3
camera.position.z = 0

renderer.setSize(width(), height())
container.appendChild(renderer.domElement)

CameraControls.install({ THREE })
const cameraControls = new CameraControls(camera, container)

window.addEventListener('resize', () => {
  clearTimeout(window.___timeout)

  window.___timeout = setTimeout(() => {
    renderer.setSize(width(), height())
    camera.aspect = width() / height()
    camera.updateProjectionMatrix()
  }, 100)
})

export function render (callback) {
  cameraControls.update(clock.getDelta())

  const time = clock.getElapsedTime()

  if (typeof callback === 'function') callback(time)

  window.requestAnimationFrame(() => render(callback))
  renderer.render(scene, camera)
}
