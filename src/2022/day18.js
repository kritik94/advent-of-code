import { fileLines, fileLinesBy, RESOURCES } from '../index.js';
import readline from 'node:readline'

const FILEPATH = '2022/day18.csv'
const FILEPATH_TEST = '2022/day18.test.csv'

function createDefaultGetProxy(def) {
  return {
    get: function(target, name) {
      return target.hasOwnProperty(name) ? target[name] : def
    }
  }
}

function findOuterFlats(cubes) {
  const cnt = new Proxy({}, createDefaultGetProxy(0))

  cubes.forEach(([x, y, z]) => {
    cnt[`${x}.${y}.${z}.x`]++
    cnt[`${x}.${y}.${z}.y`]++
    cnt[`${x}.${y}.${z}.z`]++
    cnt[`${x+1}.${y}.${z}.x`]++
    cnt[`${x}.${y+1}.${z}.y`]++
    cnt[`${x}.${y}.${z+1}.z`]++
  })

  return Object.entries(cnt).filter(([_, c]) => c === 1).map(([flat]) => flat)
}

async function one() {
  const lines = await fileLines(FILEPATH)

  const cubes = lines.map(l => l.split(',').map(i => parseInt(i)))
  const outerFlats = findOuterFlats(cubes)
  console.log(outerFlats.length)
}

function diff(a, b) {
  return a.filter(i => !b.includes(i))
}

const pp = (x, y, z, d) => `${x}.${y}.${z}.${d}`
const ss = (s) => {
  const [x, y, z, d] = s.split('.')
  return [parseInt(x), parseInt(y), parseInt(z), d]
}

async function two() {
  const lines = await fileLines(FILEPATH)

  const cubes = lines.map(l => l.split(',').map(i => parseInt(i)))
  const outerFlats = findOuterFlats(cubes)

  let [mx, my, mz] = [0, 0, 0]
  cubes.forEach(([x, y, z]) => {
    mx = Math.max(x, mx)
    my = Math.max(y, my)
    mz = Math.max(z, mz)
  })

  let checked = new Set(cubes.map(i => i.join('.')))
  let free = new Set(['0.0.0'])
  let queue = ['0.0.0']

  while (queue.length > 0) {
    const current = queue.shift()
    const [x, y, z] = current.split('.').map(i => parseInt(i))

    const nearby = Array.from(new Set([
      `${Math.max(x-1, 0)}.${y}.${z}`,
      `${Math.min(x+1, mx+1)}.${y}.${z}`,
      `${x}.${Math.max(y-1, 0)}.${z}`,
      `${x}.${Math.min(y+1, my+1)}.${z}`,
      `${x}.${y}.${Math.max(z-1, 0)}`,
      `${x}.${y}.${Math.min(z+1, mz+1)}`,
    ]))

    const notChecked = nearby.filter(n => !checked.has(n))
    notChecked.forEach(n => {
      if (!queue.includes(n)) {
        queue.push(n)
      }
      if (free.has(current)) {
        free.add(n)
      }
    })

    checked.add(current)
  }

  const inner = []
  for (let x = 0; x <= mx; x++) {
    for (let y = 0; y <= my; y++) {
      for (let z = 0; z <= mz; z++) {
        const current = `${x}.${y}.${z}`
        if (!checked.has(current)) {
          inner.push(current)
        }
      }
    }
  }

  const innerFlats = findOuterFlats(inner.map(i => i.split('.').map(n => parseInt(n))))

  console.log(outerFlats.length - innerFlats.length)
}

(async function () {
  // await one()
  await two()
})()
