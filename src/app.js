import * as THREE from 'three'

import { getEnvironment3D } from './environment-3d'
import {
  configCamera,
  configFog,
  configGround,
  configLights,
  configSphere,
  getContainer
} from './helpers'

// const textureLoader = new THREE.TextureLoader()

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

configGround({
  ...environment3D,
  size: 1000,
  material: new THREE.MeshStandardMaterial({
    color: 'rgb(70, 70, 70)',
    wireframe: false,
    transparent: false,
    opacity: 1,
    side: THREE.DoubleSide
  })
})

const sphere = configSphere({
  ...environment3D,
  material: new THREE.MeshStandardMaterial({
    color: 0xafafaf,
    wireframe: false,
    transparent: false,
    opacity: 1,
    side: THREE.FrontSide
  })
})

environment3D.render((time) => {
  sphere.rotation.x = time * 0.2
  sphere.rotation.y = time * 0.2
  sphere.position.y = Math.sin(time) + 8
})
