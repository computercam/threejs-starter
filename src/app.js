import * as THREE from 'three'
import { getDimensions, getGrid, getMeshGrid } from './helpers'
import { render, renderer, scene } from './scene'

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6),
  new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide
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
  material: new THREE.MeshBasicMaterial({
    color: 0x808080
  })
})

scene.add(boxGrid)

render((time) => {
  grid.forEach(({ z, r }, i) => {
    const offset = (z * 0.3)
    const box = boxGrid.children[i]
    const factor = time * offset
    box.rotation.y = Math.sin(factor)
    box.scale.y = (Math.cos(factor) + (r * 0.1)) + 1
    box.position.y = getDimensions(box).y * 0.5
  })
})
