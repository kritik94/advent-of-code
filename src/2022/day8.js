import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day8.csv'

async function one() {
  const lines = await fileLines(FILEPATH)
  const rows = lines.map(line => line.split('').map(i => parseInt(i)))
  const columns = lines[0].split('').map((_, i) => lines.map(line => parseInt(line[i])))
  const height = lines.length
  const width = lines[0].length

  let visible = (width + height) * 2 - 4
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const current = rows[y][x]
      const row = rows[y]
      const column = columns[x]
      const [left, right] = [row.slice(0, x), row.slice(x+1)]
      const [top, bottom] = [column.slice(0, y), column.slice(y+1)]

      const isVisible = [left, right, top, bottom].some(line => line.every(i => current > i))
      if (isVisible) {
        visible++
      }
    }
  }

  console.log(visible)
}

async function two() {
  const lines = await fileLines(FILEPATH)
  const rows = lines.map(line => line.split('').map(i => parseInt(i)))
  const columns = lines[0].split('').map((_, i) => lines.map(line => parseInt(line[i])))
  const height = lines.length
  const width = lines[0].length

  const countView = (line, current) => {
    return line.reduce(({count, stop = false}, i) => {
      if (stop) {
        return {count, stop}
      }

      if (i >= current) {
        return {count: count + 1, stop: true}
      }

      return {count: count + 1}
    }, {count: 0}).count
  }

  let scores = []
  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const current = rows[y][x]
      const row = rows[y]
      const column = columns[x]
      const [left, right] = [row.slice(0, x).reverse(), row.slice(x+1)]
      const [top, bottom] = [column.slice(0, y).reverse(), column.slice(y+1)]

      scores.push(
        countView(left, current)
        * countView(right, current)
        * countView(top, current)
        * countView(bottom, current)
      )
    }
  }

  console.log(Math.max(...scores))
}

(async function () {
  await one()
  await two()
})()
