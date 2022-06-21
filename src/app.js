import * as THREE from 'three'
import { getDimensions, getGrid, getLight, getMeshGrid, hslRotate } from './helpers'
import { render, renderer, scene } from './scene'

renderer.setClearColor('rgb(0, 0, 0)')
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.1,
    metalness: 0,
    side: THREE.DoubleSide
  })
)

plane.rotation.x = THREE.MathUtils.degToRad(90)
plane.scale.x = 1000
plane.scale.y = 1000
scene.add(plane)

const grid = getGrid(12)
const boxGrid = getMeshGrid({
  grid,
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0
  })
})

boxGrid.position.z = -2
boxGrid.position.y = 2.5
boxGrid.rotation.x = THREE.MathUtils.degToRad(-22.5)

scene.add(boxGrid)

const { rectLight, spotLight } = getLight({
  scene,
  position: [-5, 5, 5],
  color: 'rgb(0,255,255)'
})

const { rectLight: rectLight2, spotLight: spotLight2 } = getLight({
  scene,
  position: [0, 5, 5],
  color: 'rgb(255,255,0)'
})

const { rectLight: rectLight3, spotLight: spotLight3 } = getLight({
  scene,
  position: [5, 5, 5],
  color: 'rgb(255,0,255)'
})

const hemLight = new THREE.HemisphereLight('rgb(255,0,255)', 'rgb(0,255,255)', 0)
scene.add(hemLight)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
plane.receiveShadow = true
boxGrid.children.forEach(box => {
  box.castShadow = true
  box.receiveShadow = true
})

render((time) => {
  grid.forEach(({ i, r, x, y }, index) => {
    const box = boxGrid.children[index]
    const wave = (Math.sin(
      time * // elapsed time
      0.75 + // frequency
      ((x * 0.1) * (y * 0.75)) * // multiplier based on position in the grid
      0.5 // wavelength
    ) * 1) + 1 // amplitude

    box.scale.x = (wave * 0.25) + 0.15
    box.scale.y = (wave * 0.25) + 0.15
    box.scale.z = (wave * 0.25) + 0.15
    box.position.y = wave + (getDimensions(box).y * 0.5)
    box.rotation.x = wave
    box.rotation.y = wave * 0.25
  })

  const lightOffset = Math.abs(Math.cos(time * 0.05))
  rectLight.intensity = lightOffset + 5
  rectLight2.intensity = lightOffset + 5
  rectLight3.intensity = lightOffset + 5
  spotLight.intensity = lightOffset
  spotLight2.intensity = lightOffset
  spotLight3.intensity = lightOffset
  hemLight.intensity = lightOffset

  hslRotate({ obj: rectLight })
  hslRotate({ obj: rectLight2 })
  hslRotate({ obj: rectLight3 })
  hslRotate({ obj: spotLight })
  hslRotate({ obj: spotLight2 })
  hslRotate({ obj: spotLight3 })
  hslRotate({ obj: hemLight })
  hslRotate({ obj: hemLight, colorProp: 'groundColor' })
})
