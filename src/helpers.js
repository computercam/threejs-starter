import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

export function getMeshGrid ({ grid, geometry, material }) {
  return grid.reduce((pre, cur, i, arr) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.x = 1
    mesh.scale.y = 1
    mesh.scale.z = 1
    mesh.position.y += getDimensions(mesh).y * 0.5
    mesh.position.x = cur.x
    mesh.position.z = cur.y
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
    const y = column + offset + 0.5
    const i = index + 1
    const r = array.length - index

    return { x, y, i, r, row, column }
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

export function getLight ({
  scene,
  position: [x, y, z],
  color
}) {
  const spotLightAngle = THREE.MathUtils.degToRad(11.25)
  const spotLightArgs = [color, 1, 0, spotLightAngle, 0.5]
  const spotLight = new THREE.SpotLight(...spotLightArgs)

  // const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  const spotLightTarget = new THREE.Object3D()
  scene.add(spotLight)
  // scene.add(spotLightHelper)
  scene.add(spotLightTarget)

  spotLight.position.set(x, y, z + 30)
  spotLightTarget.position.set(z, y, -1000)
  spotLight.target = spotLightTarget

  spotLight.shadow.bias = 0.00001
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.radius = 4

  spotLight.castShadow = true

  const rectLight = new THREE.RectAreaLight(color, 5, 4, 10)
  const rectLightHelper = new RectAreaLightHelper(rectLight)
  rectLight.add(rectLightHelper)
  scene.add(rectLight)

  rectLight.position.set(x, y, z)

  return { rectLight, spotLight }
}

export function hslRotate ({ obj, colorProp = 'color', amount = 0.001 }) {
  const { h, s, l } = obj[colorProp].getHSL(obj[colorProp])
  obj[colorProp].setHSL((h + amount % 1), s, l)
}
