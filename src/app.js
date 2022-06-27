import * as THREE from 'three'

import { getEnvironment3D } from './environment-3d'
import {
  configBox,
  configCamera,
  configFog,
  configGround,
  configLights,
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
    camera.lookAt(box.position)
  }
})

configFog({
  ...environment3D,
  color: 0x000000,
  density: 0.025
})

configLights({
  ...environment3D,
  lights: [
    { x: 100, y: 100, z: 100, intensity: 2, color: 0xffffff },
    { x: -100, y: 100, z: 100, intensity: 2, color: 0xffffff },
    { x: 0, y: 100, z: -100, intensity: 2, color: 0xffffff }
  ]
})

const ground = configGround({
  ...environment3D,
  size: 1000,
  material: new THREE.MeshStandardMaterial({
    color: 'rgb(70, 70, 70)',
    wireframe: false,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    map: textureLoader.load('textures/ground/ground_diffuse.jpg')
  })
})

console.log(ground)

const box = configBox({
  ...environment3D,
  material: new THREE.MeshStandardMaterial({
    color: 0xafafaf,
    wireframe: false,
    transparent: true,
    opacity: 1,
    side: THREE.FrontSide,
    map: textureLoader.load('textures/metal/metal_diffuse.jpg')
  })
})

environment3D.render((time) => {
  box.rotation.x = time * 0.2
  box.rotation.y = time * 0.2
  box.position.y = Math.sin(time) + 8
})
