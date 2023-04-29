import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

export function getContainer () {
  const el = document.querySelector('main')
  const height = () => el.getBoundingClientRect().height
  const width = () => el.getBoundingClientRect().width
  return { el, height, width }
}

export function configGUIMaterialControls ({ mesh, gui }) {
  gui.addColor(mesh.material, 'color')
  gui.add(mesh.material, 'wireframe')
  gui.add(mesh.material, 'transparent')
  gui.add(mesh.material, 'opacity', 0, 1, 0.01)
  gui.add(mesh.material, 'side', {
    FrontSide: THREE.FrontSide,
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide
  })
}

export function createAmbientLight ({
  intensity = 0,
  color1 = 0xffffff,
  color2 = 0xffffff,
  guiFolder,
  scene
}) {
  const params = {
    colorSky: color1,
    colorGround: color2
  }

  const light = new THREE.HemisphereLight(
    params.colorSky,
    params.colorGround,
    intensity
  )

  if (guiFolder) {
    const folder = guiFolder.addFolder('Hemisphere')
    folder.add(light, 'intensity', 0, 5, 0.1)

    folder
      .addColor(params, 'colorSky')
      .onChange((color) => light.color.set(color))

    folder
      .addColor(params, 'colorGround')
      .onChange((color) => light.groundColor.set(color))

    folder.close()
  }

  if (scene) scene.add(light)

  return light
}

export function createPointLight ({
  x = 0,
  y = 0,
  z = 0,
  intensity = 1,
  color = 0xffffff,
  guiFolder,
  scene
}) {
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

  if (scene) scene.add(light)

  if (guiFolder) {
    const amt = guiFolder.folders.length
    const folder = guiFolder.addFolder(`PointLight ${amt}`)

    folder.add(light, 'intensity', 0, 5, 0.1)
    folder.addColor(params, 'color').onChange((color) => {
      light.color.set(color)
      sphere.material.color.set(color)
    })

    folder.add(light.position, 'x', -100, 100, 0.1, scene)
    folder.add(light.position, 'y', 0, 100, 0.1, scene)
    folder.add(light.position, 'z', -100, 100, 0.1, scene)
    folder.close()
  }

  return light
}

export function configLights ({ scene, camera, lights, gui }) {
  const guiFolder = gui ? gui.addFolder('Light Controls') : null

  createAmbientLight({
    intensity: 0,
    color: 0x000000,
    guiFolder,
    scene
  })

  return lights.map((light) =>
    createPointLight({
      ...light,
      guiFolder,
      scene
    })
  )
}

export function configFog ({ scene, renderer, color, density, gui }) {
  renderer.setClearColor(color)
  scene.fog = new THREE.FogExp2(color, density)

  if (gui) {
    const guiSceneControls = gui.addFolder('Scene Controls')

    guiSceneControls
      .addColor(scene.fog, 'color')
      .name('Fog Color')
      .onChange((color) => {
        scene.fog.color.set(color)
        renderer.setClearColor(color)
      })

    guiSceneControls
      .add(scene.fog, 'density', 0, 0.15, 0.001)
      .name('Fog Density')

    guiSceneControls.close()
  }

  return scene.fog
}

export function configCamera ({
  camera,
  scene,
  position,
  rotation,
  gui,
  guiOnChangeCallback
}) {
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
    const guiCameraControls = gui.addFolder('Camera Controls')

    guiCameraControls
      .add(camera.position, 'x', -100, 100, 0.001)
      .name('Left/Right')
      .onChange(
        () =>
          typeof guiOnChangeCallback === 'function' &&
          guiOnChangeCallback({ camera })
      )

    guiCameraControls
      .add(camera.position, 'y', -100, 100, 0.001)
      .name('Down/Up')
      .onChange(
        () =>
          typeof guiOnChangeCallback === 'function' &&
          guiOnChangeCallback({ camera })
      )

    guiCameraControls
      .add(camera.position, 'z', -100, 100, 0.001)
      .name('Forward/Back')
      .onChange(
        () =>
          typeof guiOnChangeCallback === 'function' &&
          guiOnChangeCallback({ camera })
      )

    guiCameraControls
      .add(pitch.rotation, 'x', -Math.PI, Math.PI, 0.0001)
      .name('Pitch')
      .onChange(
        () =>
          typeof guiOnChangeCallback === 'function' &&
          guiOnChangeCallback({ camera })
      )

    guiCameraControls
      .add(yaw.rotation, 'y', -Math.PI, Math.PI, 0.0001)
      .name('Yaw')
      .onChange(
        () =>
          typeof guiOnChangeCallback === 'function' &&
          guiOnChangeCallback({ camera })
      )

    guiCameraControls
      .add(camera.rotation, 'z', -Math.PI, Math.PI, 0.0001)
      .name('Rotate')
      .onChange((z) => {
        if (typeof guiOnChangeCallback === 'function') {
          guiOnChangeCallback({ camera })
        }
        camera.rotation.z = z
      })

    guiCameraControls.close()
  }

  return camera
}

export function configSphere ({ scene, material, gui }) {
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(6, 36, 36), material)

  sphere.castShadow = true
  sphere.name = 'sphere'
  sphere.position.y += sphere.geometry.parameters.radius * 2
  scene.add(sphere)

  if (gui) {
    const guiMaterialControls = gui.addFolder('Object Controls')

    configGUIMaterialControls({
      mesh: sphere,
      gui: guiMaterialControls
    })

    guiMaterialControls.add(sphere.material, 'roughness', 0, 1, 0.001)
    guiMaterialControls.add(sphere.material, 'metalness', 0, 1, 0.001)
    guiMaterialControls.close()
  }

  return sphere
}

export function configGround ({ scene, size, material, gui }) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material)

  plane.name = 'plane'
  plane.receiveShadow = true
  plane.rotation.x += THREE.MathUtils.degToRad(-90)
  scene.add(plane)

  if (gui) {
    const guiMaterialControls = gui.addFolder('Ground Controls')

    configGUIMaterialControls({
      mesh: plane,
      gui: guiMaterialControls
    })

    guiMaterialControls.add(plane.material, 'roughness', 0, 1, 0.001)
    guiMaterialControls.add(plane.material, 'metalness', 0, 1, 0.001)
    guiMaterialControls.close()
  }

  return plane
}

export const configTexture = (textureObj) => ({
  getValue: () => textureObj,
  map: (callback) => {
    Object.values(textureObj).forEach((value) => callback(value))

    return configTexture(textureObj)
  }
})

export function configSkyBox ({ cubeMapUrls, hdriUrl, scene }) {
  const diffuseArray = cubeMapUrls.map(
    (url) =>
      new THREE.MeshBasicMaterial({
        map: textureLoader.load(url),
        side: THREE.BackSide
      })
  )

  const diffuse = textureLoader.load(hdriUrl)
  const envMap = cubeTextureLoader.load(cubeMapUrls)

  // // Skybox with scene background
  scene.background = envMap

  /// / Skybox with sphere geometry
  // const skyboxGeometry = new THREE.SphereGeometry(10000, 25, 25)
  // const skyboxMaterial = new THREE.MeshBasicMaterial({
  //   map: diffuse,
  //   side: THREE.BackSide
  //  })
  // const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial)
  // scene.add(skyboxMesh)

  // // Skybox with box geometry
  // const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000)
  // const skyboxMesh = new THREE.Mesh(skyboxGeometry, diffuseArray)
  // scene.add(skyboxMesh)

  return {
    envMap,
    diffuse,
    diffuseArray
  }
}
