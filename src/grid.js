export default function getGrid (size) {
  const length = Math.pow(size, 2)
  const offset = (size / 2) * -1

  const grid = Array.from({ length })
    .map((_, index, array) => {
      const row = Math.floor(index / size)
      const column = (index % size)

      const x = row + offset + 0.5
      const y = column + offset + 0.5
      const i = index + 1
      const r = array.length - index

      return { x, y, i, r, row, column }
    })

  return grid
}
