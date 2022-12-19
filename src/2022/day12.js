import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day12.csv'
const FILEPATH_TEST = '2022/day12.test.csv'

function find(lines, sym) {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === sym) {
        return {x, y}
      }
    }
  }
}

function firstBy(arr, cb) {
  for (let i=0; i < arr.length; i++) {
    if (cb(arr[i])) {
      return arr[i]
    }
  }
}

function strToCoor(str) {
  const [x, y] = str.split(':').map(i => parseInt(i))
  return {x, y}
}

function coorToStr({x, y}) {
  return `${x}:${y}`
}

function code(sym) {
  if (sym === 'S') {
    return 0
  }
  if (sym === 'E') {
    return 27
  }
  return sym.charCodeAt() - 96
}

function findNear({x, y}, map) {
  const height = map.length
  const width = map[0].length
  const current = map[y][x]

  let result = []

  const check = (a, b) => code(b) - code(a) <= 1

  if (x > 0 && check(current, map[y][x-1])) {
    result.push({x: x-1, y})
  }
  if (x < width-1 && check(current, map[y][x+1])) {
    result.push({x: x+1, y})
  }
  if (y > 0 && check(current, map[y-1][x])) {
    result.push({x, y: y-1})
  }
  if (y < height-1 && check(current, map[y+1][x])) {
    result.push({x, y: y+1})
  }
  return result
}

function findPath(map, start, end) {
  const endStr = coorToStr(end)

  let paths = [[coorToStr(start)]]
  let explored = []

  while (true) {
    let newPaths = []
    let currentPath

    paths.forEach(path => {
      const last = strToCoor(path[path.length-1])
      const nears = findNear(last, map).map(coorToStr)
      nears.forEach(near => {
        if (explored.includes(near) || path.includes(near)) {
          return
        }
        if (near === endStr) {
          currentPath = [...path, near]
        }
        newPaths.push([...path, near])
        explored.push(near)
      })
    })

    if (newPaths.length === 0) {
      return
    }

    if (currentPath) {
      return currentPath
    }

    paths = newPaths
  }
}

async function one() {
  const lines = await fileLines(FILEPATH)

  const start = find(lines, 'S')
  const end = find(lines, 'E')

  const path = findPath(lines, start, end)
  console.log(path.length - 1)
}

async function two() {
  const lines = await fileLines(FILEPATH)

  const end = find(lines, 'E')

  const allA = []
  lines.forEach((line, y) => line.split('').forEach((sym, x) => {
    if (sym === 'a') {
      allA.push({x, y})
    }
  }))

  const paths = allA.map(a => findPath(lines, a, end)).filter(p => p)
  console.log(
    paths.map(path => path.length - 1).sort((a, b) => a - b)
  )
}

(async function () {
  await one()
  await two()
})()
