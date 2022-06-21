import GUI from 'lil-gui'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { getCamera } from './camera'

export const gui = new GUI()
const cameraSettings = { type: 'Perspective' }
gui
  .add(cameraSettings, 'type', ['Perspective', 'Orthographic'])
  .name('Camera Type')

export const container = document.querySelector('main')
export const height = () => container.getBoundingClientRect().height
export const width = () => container.getBoundingClientRect().width

export const scene = new THREE.Scene()
export const clock = new THREE.Clock()

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding

renderer.setSize(width(), height())
container.appendChild(renderer.domElement)
RectAreaLightUniformsLib.init()

window.addEventListener('resize', () => {
  clearTimeout(window.___timeout)
  window.___timeout = setTimeout(() => {
    renderer.setSize(width(), height())
  }, 100)
})

export function render (callback) {
  const time = clock.getElapsedTime()

  if (typeof callback === 'function') callback(time)

  window.requestAnimationFrame(() => render(callback))
  const camera = getCamera({ scene, type: cameraSettings.type })
  renderer.render(scene, camera)
}
