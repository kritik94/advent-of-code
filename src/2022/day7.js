import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day7.csv'

async function one() {
  const lines = await fileLines(FILEPATH)
  const dirs = {}
  let path = ""

  lines.forEach(line => {
    const cdMatch = line.match(/^\$ cd (?<path>.+)/)
    if (cdMatch) {
      const setPath = cdMatch.groups.path
      switch (setPath) {
        case '..':
          path = path.slice(0, path.lastIndexOf('/'))
          return
        case '/':
          path = '/'
          return
        default:
          path = `${path}${path == '/' ? '' : '/'}${setPath}`
          return
      }
    }

    if (!dirs.hasOwnProperty(path)) {
      dirs[path] = 0
    }

    const fileSizeMatch = line.match(/(?<size>\d+) \w+/)
    if (fileSizeMatch) {

      dirs[path] += parseInt(fileSizeMatch.groups.size)
    }
  })

  const trueSize = Object.fromEntries(Object.keys(dirs).map(path => {
    const subDirs = Object.keys(dirs).filter(
      subPath => subPath !== path && subPath.startsWith(path)
    )
    const fullSize = subDirs.reduce((acc, subPath) => acc + dirs[subPath], dirs[path])

    return [path, fullSize]
  }))

  const result = Object.entries(trueSize).filter(([_, size]) => size <= 100000)
    .reduce((acc, [_, size]) => acc + size, 0)

  console.log(result)
}

async function two() {
  const lines = await fileLines(FILEPATH)
  const dirs = {}
  let path = ""

  lines.forEach(line => {
    const cdMatch = line.match(/^\$ cd (?<path>.+)/)
    if (cdMatch) {
      const setPath = cdMatch.groups.path
      switch (setPath) {
        case '..':
          path = path.slice(0, path.lastIndexOf('/'))
          return
        case '/':
          path = '/'
          return
        default:
          path = `${path}${path == '/' ? '' : '/'}${setPath}`
          return
      }
    }

    if (!dirs.hasOwnProperty(path)) {
      dirs[path] = 0
    }

    const fileSizeMatch = line.match(/(?<size>\d+) \w+/)
    if (fileSizeMatch) {

      dirs[path] += parseInt(fileSizeMatch.groups.size)
    }
  })

  const trueSize = Object.fromEntries(Object.keys(dirs).map(path => {
    const subDirs = Object.keys(dirs).filter(
      subPath => subPath !== path && subPath.startsWith(path)
    )
    const fullSize = subDirs.reduce((acc, subPath) => acc + dirs[subPath], dirs[path])

    return [path, fullSize]
  }))

  const needSize = trueSize['/'] - 40000000

  const sorted = Object.entries(trueSize).sort(([_a, aSize], [_b, bSize]) => aSize - bSize)
    .filter(([_, size]) => size >= needSize)
  console.log(sorted)
}

(async function () {
  await one()
  await two()
})()
