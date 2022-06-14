import GUI from 'lil-gui'
import * as THREE from 'three'
// const textureLoader = new THREE.TextureLoader()

function getContainer () {
  const el = document.querySelector('main')
  const height = () => el.getBoundingClientRect().height
  const width = () => el.getBoundingClientRect().width
  return { el, height, width }
}

function configLights ({ scene, camera, lights, gui }) {
  const guiLightControls = gui
    ? gui.addFolder('Light Controls')
    : null

  function createAmbientLight (intesity, color, guiFolder, scene) {
    const params = { color }

    const light = new THREE.AmbientLight(params.color, 0)

    if (guiFolder) {
      const folder = guiFolder.addFolder('Ambient')
      folder.add(light, 'intensity', 0, 5, 0.1)

      folder.addColor(params, 'color').onChange(color =>
        light.color.set(color))
    }

    scene.add(light)
  }

  function createPointLight (x, y, z, intensity, color, guiFolder, scene) {
    const params = { color }

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 24, 24),
      new THREE.MeshBasicMaterial({ color: params.color })
    )

    const light = new THREE.PointLight(params.color, 1)
    light.intensity = intensity
    light.position.x = x
    light.position.y = y
    light.position.z = z
    light.castShadow = true
    light.shadow.mapSize.width = 4096
    light.shadow.mapSize.height = 4096
    light.add(sphere)

    scene.add(light)

    if (guiFolder) {
      const amt = guiFolder.folders.length + 1
      const folder = guiFolder.addFolder(`Light ${amt}`)

      folder.add(light, 'intensity', 0, 5, 0.1)
      folder.addColor(params, 'color').onChange(color => {
        light.color.set(color)
        sphere.material.color.set(color)
      })

      folder.add(light.position, 'x', -100, 100, 0.1, scene)
      folder.add(light.position, 'y', 0, 100, 0.1, scene)
      folder.add(light.position, 'z', -100, 100, 0.1, scene)
    }
  }

  createAmbientLight(0, 0x000000, guiLightControls, scene)

  lights.forEach((light) => {
    createPointLight(
      light.x,
      light.y,
      light.z,
      light.intensity,
      light.color,
      guiLightControls,
      scene
    )
  })
}

function configFog ({ scene, renderer, color, density, gui }) {
  renderer.setClearColor(color)
  scene.fog = new THREE.FogExp2(color, density)

  if (gui) {
    const guiSceneControls = gui
      .addFolder('Scene Controls')

    guiSceneControls
      .addColor(scene.fog, 'color')
      .name('Fog Color')
      .onChange(color => {
        scene.fog.color.set(color)
        renderer.setClearColor(color)
      })

    guiSceneControls
      .add(scene.fog, 'density', 0, 0.15, 0.001)
      .name('Fog Density')
  }
}

function configGround ({ scene, size, material, gui }) {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial(material)
  )

  plane.name = 'plane'
  plane.receiveShadow = true
  plane.rotation.x += THREE.MathUtils.degToRad(-90)
  scene.add(plane)

  if (gui) {
    const guiMaterialControls = gui.addFolder('Ground Controls')

    guiMaterialControls.addColor(material, 'color')
      .onChange(color => plane.material.color.set(color))

    guiMaterialControls.add(plane.material, 'roughness', 0, 1, 0.001)
    guiMaterialControls.add(plane.material, 'metalness', 0, 1, 0.001)
  }
}

function configCamera ({ camera, scene, position, rotation, gui }) {
  const pitch = new THREE.Group()
  const yaw = new THREE.Group()

  pitch.add(camera)
  yaw.add(pitch)
  scene.add(yaw)
  camera.position.x = position.x
  camera.position.y = position.y
  camera.position.z = position.z
  pitch.rotation.x = rotation.x
  yaw.rotation.y = rotation.y
  camera.rotation.z = rotation.z

  if (gui) {
    const guiCameraControls = gui
      .addFolder('Camera Controls')

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

function configTorus ({ scene, material, gui }) {
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3.5, 1, 100, 16),
    new THREE.MeshStandardMaterial({
      color: material.color,
      roughness: material.roughness,
      metalness: material.metalness
    })
  )

  torus.castShadow = true
  torus.name = 'torus'
  torus.position.y += torus.geometry.parameters.radius * 2
  scene.add(torus)

  if (gui) {
    const guiMaterialControls = gui.addFolder('Object Controls')

    guiMaterialControls.addColor(material, 'color')
      .onChange(() =>
        torus.material.color.set(material.color))

    guiMaterialControls.add(torus.material, 'roughness', 0, 1, 0.001)
    guiMaterialControls.add(torus.material, 'metalness', 0, 1, 0.001)
  }
}

function configScene ({ gui, scene, camera, renderer }) {
  configLights({
    scene,
    camera,
    gui,
    lights: [
      { x: 100, y: 100, z: 100, intensity: 1.5, color: 0xffffff },
      { x: -100, y: 100, z: 100, intensity: 1, color: 0xffffff },
      { x: 0, y: 100, z: -100, intensity: 0.5, color: 0xffffff }
    ]
  })

  configCamera({
    camera,
    scene,
    gui,
    position: {
      x: 0,
      y: 6,
      z: 25
    },
    rotation: {
      x: -0.25,
      y: 3.14,
      z: 0
    }
  })

  configGround({
    scene,
    gui,
    size: 1000,
    material: {
      color: 'rgb(70, 70, 70)',
      side: THREE.DoubleSide,
      roughness: 0.75,
      metalness: 0.25
    }
  })

  configTorus({
    scene,
    gui,
    material: {
      color: 0xafafaf,
      roughness: 0.5,
      metalness: 0.75
    }
  })

  configFog({
    scene,
    renderer,
    gui,
    color: 0x000000,
    density: 0.025
  })
}

function init ({
  container: { el, width, height },
  configScene
}) {
  const gui = new GUI()
  const scene = new THREE.Scene()
  const cameraSettings = [55, width() / height(), 0.1, 1000]
  const camera = new THREE.PerspectiveCamera(...cameraSettings)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width(), height())
  renderer.shadowMap.enabled = true

  window.addEventListener('resize', () => {
    clearTimeout(window.___resizerTimeout)

    window.___resizerTimeout = setTimeout(() => {
      camera.aspect = width() / height()
      camera.updateProjectionMatrix()
      renderer.setSize(width(), height())
    }, 500)
  })

  return {
    gui,
    scene,
    camera,
    renderer
  }
}

function render ({ scene, camera, renderer }) {
  renderer.render(scene, camera)

  const torus = scene.getObjectByName('torus')

  torus.rotation.x += 0.005
  torus.rotation.y += 0.005

  window.requestAnimationFrame(() =>
    render({ scene, camera, renderer }))
}

const container = getContainer()
const environment3d = init({ container, configScene })
configScene(environment3d)
container.el.appendChild(environment3d.renderer.domElement)
render(environment3d)
