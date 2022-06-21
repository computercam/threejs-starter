import * as THREE from 'three'
import { gui, height, width } from './scene'

function getOrthographicCamera ({ scene }) {
  const settings = {
    zoom: 30,
    position: {
      x: 1,
      y: 0.1,
      z: -1
    }
  }

  const aspect = () => width() / height()
  const frustumSize = () => height() / settings.zoom
  const left = () => frustumSize() * aspect() / -2
  const right = () => frustumSize() * aspect() / 2
  const top = () => frustumSize() / 2
  const bottom = () => frustumSize() / -2
  const near = () => -1000
  const far = () => 1000

  const camera = new THREE.OrthographicCamera()

  function reset () {
    camera.left = left()
    camera.right = right()
    camera.top = top()
    camera.bottom = bottom()
    camera.near = near()
    camera.far = far()

    camera.position.set(
      settings.position.x,
      Math.abs(settings.position.y),
      settings.position.z
    )

    camera.updateProjectionMatrix()
    camera.lookAt(0, 0, 0)
  }

  const folder = gui.addFolder('Orthographic Camera')

  ;['x', 'y', 'z'].forEach(axis =>
    folder.add(settings.position, axis, -10, 10, 0.01)
      .name(`${axis.toUpperCase()} Position`)
      .onChange(reset))

  folder.add(settings, 'zoom', 10, 50, 1)
    .name('Zoom')
    .onChange(reset)

  window.addEventListener('resize', () => {
    clearTimeout(window.___cameratimeout)
    window.___cameratimeout = setTimeout(reset, 500)
  })

  reset()

  return { camera, folder }
}

function getPerspectiveCamera ({ scene }) {
  const settings = {
    fov: 55,
    aspect () {
      return width() / height()
    },
    near: 0.1,
    far: 1000,
    position: {
      x: 7.5,
      y: 5,
      z: -20
    },
    rotation: { z: Math.PI },
    yaw: { rotation: { y: 0 } },
    pitch: { rotation: { x: 0 } }
  }

  const camera = new THREE.PerspectiveCamera()
  const pitch = new THREE.Group()
  const yaw = new THREE.Group()

  pitch.add(camera)
  yaw.add(pitch)
  scene.add(yaw)

  function reset () {
    camera.fov = settings.fov
    camera.near = settings.near
    camera.far = settings.far
    camera.aspect = settings.aspect()

    pitch.rotation.x = settings.pitch.rotation.x
    yaw.rotation.y = settings.yaw.rotation.y
    camera.rotation.z = settings.rotation.z

    camera.position.set(
      settings.position.x,
      Math.abs(settings.position.y),
      settings.position.z
    )

    camera.updateProjectionMatrix()
  }

  const folder = gui.addFolder('Perspective Camera')

    ;['x', 'y', 'z'].forEach(axis =>
    folder.add(settings.position, axis, -40, 40, 0.001)
      .name(`${axis.toUpperCase()} Position`)
      .onChange(() => {
        reset()
        camera.lookAt(0, 3, 0)
      }))

  folder.add(settings.pitch.rotation, 'x', -Math.PI, Math.PI, 0.0001)
    .name('Pitch')
    .onChange(reset)

  folder.add(settings.yaw.rotation, 'y', -Math.PI, Math.PI, 0.0001)
    .name('Yaw')
    .onChange(reset)

  folder.add(settings.rotation, 'z', -Math.PI, Math.PI, 0.0001)
    .name('Roll')
    .onChange(reset)

  window.addEventListener('resize', () => {
    clearTimeout(window.___cameratimeout)
    window.___cameratimeout = setTimeout(reset, 500)
  })

  reset()
  camera.lookAt(0, 3, 0)

  return { camera, folder }
}

export function getCamera ({ type, scene }) {
  switch (type) {
    case 'Orthographic':
      if (!window.__OrthographicCamera) {
        window.__OrthographicCamera = getOrthographicCamera({ scene })
      }

      if (window?.__PerspectiveCamera?.folder) {
        window.__PerspectiveCamera.folder.close()
      }

      if (window?.__OrthographicCamera?.folder) {
        window.__OrthographicCamera.folder.open()
      }

      return window.__OrthographicCamera.camera
    case 'Perspective':
      if (!window.__PerspectiveCamera) {
        window.__PerspectiveCamera = getPerspectiveCamera({ scene })
      }

      if (window?.__OrthographicCamera?.folder) {
        window.__OrthographicCamera.folder.close()
      }

      if (window?.__PerspectiveCamera?.folder) {
        window.__PerspectiveCamera.folder.open()
      }

      return window.__PerspectiveCamera.camera
  }
}
