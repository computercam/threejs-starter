import * as THREE from 'three'

export function getMeshGrid ({ grid, geometry, material }) {
  return grid.reduce((pre, cur, i, arr) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.x = 1
    mesh.scale.y = 1 + cur.r / 8
    mesh.scale.z = 1
    mesh.position.y += getDimensions(mesh).y * 0.5
    mesh.position.x = cur.x * 4
    mesh.position.z = cur.z * 4
    return pre.add(mesh)
  }, new THREE.Group())
}

export function getGrid (size) {
  const length = Math.pow(size, 2)
  const offset = (size / 2) * -1

  const grid = Array.from({ length }).map((_, index, array) => {
    const row = Math.floor(index / size)
    const column = index % size

    const x = row + offset + 0.5
    const z = column + offset + 0.5
    const i = index + 1
    const r = array.length - index

    return { x, z, i, r, row, column }
  })

  return grid
}

export function getDimensions ({ geometry, scale }) {
  return {
    y: geometry.parameters.height * scale.y,
    x: geometry.parameters.width * scale.x,
    z: geometry.parameters.depth * scale.z
  }
}
