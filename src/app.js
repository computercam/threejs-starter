import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { getDimensions, getGrid, getMeshGrid } from './helpers'
import { render, renderer, scene } from './scene'

renderer.setClearColor('rgb(205, 205, 205)')

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshStandardMaterial({
    color: 0x909090,
    side: THREE.DoubleSide,
    roughness: 0,
    metalness: 0
  })
)

plane.rotation.x = THREE.MathUtils.degToRad(90)
plane.scale.x = 1000
plane.scale.y = 1000
scene.add(plane)

const grid = getGrid(6)
const boxGrid = getMeshGrid({
  grid,
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    roughness: 0,
    metalness: 0
  })
})

scene.add(boxGrid)

const light = new THREE.DirectionalLight('rgb(255, 255, 255)', 0.3)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
)
light.add(sphere)

light.position.set(-15, 15, -5)
light.shadow.bias = 0.00001
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048
light.shadow.radius = 4

light.shadow.camera.top = 15
light.shadow.camera.bottom = -15
light.shadow.camera.left = -15
light.shadow.camera.right = 15

light.lookAt(0, 0, 0)

const helper = new THREE.CameraHelper(light.shadow.camera)
scene.add(light)
scene.add(helper)

RectAreaLightUniformsLib.init()

const rectLight = new THREE.RectAreaLight('rgb(0,255,255)', 4, 8, 32)
const rectLightHelper = new RectAreaLightHelper(rectLight)
rectLight.position.set(-12, 16, 0)
rectLight.lookAt(25, 16, 0)
rectLight.add(rectLightHelper)
scene.add(rectLight)

const rectLight2 = new THREE.RectAreaLight('rgb(255,255,0)', 4, 8, 32)
const rectLightHelper2 = new RectAreaLightHelper(rectLight2)
rectLight2.position.set(-12, 16, -12)
rectLight2.lookAt(25, 16, 0)
rectLight2.add(rectLightHelper2)
scene.add(rectLight2)

const rectLight3 = new THREE.RectAreaLight('rgb(255,0,255)', 4, 8, 32)
const rectLightHelper3 = new RectAreaLightHelper(rectLight3)
rectLight3.position.set(-12, 16, 12)
rectLight3.lookAt(25, 16, 0)
rectLight3.add(rectLightHelper3)
scene.add(rectLight3)

const hemLight = new THREE.HemisphereLight('rgb(120,0,120)', 'rgb(255,230,0)', 1)
scene.add(hemLight)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.castShadow = true

plane.receiveShadow = true
boxGrid.children.forEach(box => {
  box.castShadow = true
  box.receiveShadow = true
})

render((time) => {
  grid.forEach(({ z, r }, i) => {
    const offset = z * 0.3
    const box = boxGrid.children[i]
    const factor = time * offset
    box.rotation.y = Math.sin(factor)
    box.scale.y = Math.cos(factor) + r * 0.1 + 1
    box.position.y = getDimensions(box).y * 0.5

    const lightOffset = Math.sin(time * 2) + 3
    rectLight.intensity = lightOffset
    rectLight2.intensity = lightOffset
    rectLight3.intensity = lightOffset
  })
})
