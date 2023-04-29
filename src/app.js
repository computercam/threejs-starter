import * as THREE from 'three'

import { getEnvironment3D } from './environment-3d'
import {
  configCamera,
  configFog,
  configGround,
  configLights,
  configSkyBox,
  configSphere,
  configTexture,
  getContainer
} from './helpers'

const textureLoader = new THREE.TextureLoader()

const container = getContainer()
const environment3D = getEnvironment3D({ container })

configCamera({
  ...environment3D,
  position: {
    x: 0,
    y: 6,
    z: 25
  },
  rotation: {
    x: -0.25,
    y: 3.14,
    z: 0
  },
  guiOnChangeCallback ({ camera }) {
    camera.lookAt(sphere.position)
  }
})

// configFog({
//   ...environment3D,
//   color: 0x000000,
//   density: 0
// })

const skybox = configSkyBox({
  ...environment3D,
  cubeMapUrls: [
    'textures/warehouse/px.jpg',
    'textures/warehouse/nx.jpg',
    'textures/warehouse/py.jpg',
    'textures/warehouse/ny.jpg',
    'textures/warehouse/pz.jpg',
    'textures/warehouse/nz.jpg'
  ],
  hdriUrl: 'textures/warehouse/warehouse_diffuse.jpg'
})

configLights({
  ...environment3D,
  lights: [
    { x: 100, y: 100, z: 100, intensity: 0.25, color: 0xffffff },
    { x: -100, y: 100, z: 100, intensity: 2, color: 0x7f7f7f },
    { x: 0, y: 100, z: -100, intensity: 1, color: 0xffffff }
  ]
})

const groundTexture = configTexture({
  map: textureLoader.load('textures/checker/checker_diffuse.jpg')
})
  .map((texture) => (texture.wrapS = THREE.RepeatWrapping))
  .map((texture) => (texture.wrapT = THREE.RepeatWrapping))
  .map((texture) => texture.repeat.set(50, 50))
  .map((texture) => (texture.magFilter = THREE.NearestFilter))
  .getValue()

// const groundMaterial = new THREE.MeshStandardMaterial({
//   ...groundTexture,
//   color: 'rgb(70, 70, 70)',
//   wireframe: false,
//   transparent: false,
//   opacity: 1,
//   side: THREE.DoubleSide
// })

// configGround({
//   ...environment3D,
//   size: 1000,
//   material: groundMaterial
// })

const sphereTexture = configTexture({
  roughnessMap: textureLoader.load('textures/pipes/pipes_roughness.jpg'),
  map: textureLoader.load('textures/pipes/pipes_diffuse.jpg'),
  metalnessMap: textureLoader.load('textures/pipes/pipes_metallic.jpg'),
  normalMap: textureLoader.load('textures/pipes/pipes_normal.jpg'),
  aoMap: textureLoader.load('textures/pipes/pipes_ambientOcclusion.jpg')
})
  .map((texture) => (texture.wrapS = THREE.RepeatWrapping))
  .map((texture) => (texture.wrapT = THREE.RepeatWrapping))
  .map((texture) => texture.repeat.set(8, 4))
  .getValue()

const sphereMaterial = new THREE.MeshStandardMaterial({
  ...sphereTexture,
  envMap: skybox.envMap,
  color: 0xffffff,
  wireframe: false,
  transparent: false,
  opacity: 1,
  metalness: 0.5,
  side: THREE.FrontSide
})

const sphere = configSphere({
  ...environment3D,
  material: sphereMaterial
})

environment3D.render((time) => {
  sphere.rotation.x = time * 0.2
  sphere.rotation.y = time * 0.2
  sphere.position.y = Math.sin(time) + 8
})
