import GUI from 'lil-gui'
import * as THREE from 'three'

export function getEnvironment3D ({ container: { el, width, height } }) {
  const scene = new THREE.Scene()
  const cameraSettings = [55, width() / height(), 0.0001, 10000]
  const camera = new THREE.PerspectiveCamera(...cameraSettings)
  const clock = new THREE.Clock()
  const gui = new GUI()

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width(), height())
  renderer.shadowMap.enabled = true
  el.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    clearTimeout(window.___resizerTimeout)

    window.___resizerTimeout = setTimeout(() => {
      camera.aspect = width() / height()
      camera.updateProjectionMatrix()
      renderer.setSize(width(), height())
    }, 500)
  })

  function render (callback) {
    renderer.render(scene, camera)

    if (typeof callback === 'function') {
      callback(clock.getElapsedTime())
    }

    window.requestAnimationFrame(() => render(callback))
  }

  return {
    gui,
    scene,
    camera,
    clock,
    renderer,
    render
  }
}
