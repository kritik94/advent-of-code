import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day14.csv'
const FILEPATH_TEST = '2022/day14.test.csv'

const ROCK = '#'
const SAND = 'o'
const EMPTY = '.'

function range(from, to) {
  const size = Math.abs(from - to) + 1
  const min = Math.min(from, to)

  let r = Array(size).fill(0).map((_, i) => i + min)

  if (from > to) {
    r.reverse()
  }
  return r
}

function createMap() {
  return {
    minY: null,
    maxY: 0,
    minX: null,
    maxX: 0,
    sands: 0,
    filled: function (x, y) {
      return `${x},${y}` in this
    },

    get: function  (x, y) {
      return this[`${x},${y}`]
    },

    set: function(x, y, val) {
      if (val === ROCK) {
        this.minX = this.minX || x
        this.minY = this.minY || y

        this.minX = Math.min(this.minX, x)
        this.maxX = Math.max(this.maxX, x)
        this.minY = Math.min(this.minY, y)
        this.maxY = Math.max(this.maxY, y)
      }

      if (val === SAND) {
        this.sands += 1
      }

      this[`${x},${y}`] = val
    },

    fillSand(fromX = 500, fromY = 0) {
      let [x, y] = [fromX, fromY]

      if (this.filled(x, y)) {
        return false
      }
      
      while (true) {
        if (y > this.maxY + 5) {
          return false
        }

        const [left, bottom, right] = [
          this.filled(x-1, y+1),
          this.filled(x, y+1),
          this.filled(x+1, y+1),
        ]

        if (left && bottom && right) {
          this.set(x, y, SAND)
          return true
        }

        y++
        if (!bottom) {
          continue
        }

        if (!left) {
          x--
          continue
        }

        if (!right) {
          x++
        }
      }
    },

    toPrint: function() {
      let lines = []
      for (let y = this.minY-2; y <= this.maxY+2; y++) {
        let line = []
        for (let x = this.minX-2; x <= this.maxX+2; x++) {
          line.push(this.get(x, y) || EMPTY)
        }
        lines.push(line.join(''))
      }

      return lines.join('\n')
    }
  }
}

async function one() {
  const lines = await fileLines(FILEPATH)

  const map = createMap()
  
  lines.forEach(line => {
    const coordinates = line.split(' -> ').map(c => c.split(',').map(i => parseInt(i)))

    const from = coordinates.slice(0, -1)
    const to = coordinates.slice(1)

    from.forEach((a, i) => {
      const b = to[i]

      const byX = range(a[0], b[0])
      const byY = range(a[1], b[1])

      byX.forEach(x => byY.forEach(y => map.set(x, y, ROCK)))
    })
  })

  while (map.fillSand()) {}
  console.log(map.toPrint())
  console.log(map.sands)
}

async function two() {
  const lines = await fileLines(FILEPATH)

  const map = createMap()
  map.filled = (function(x, y) {
    if (y >= this.maxY+2) {
      return true
    }

    return `${x},${y}` in this
  }).bind(map)

  lines.forEach(line => {
    const coordinates = line.split(' -> ').map(c => c.split(',').map(i => parseInt(i)))

    const from = coordinates.slice(0, -1)
    const to = coordinates.slice(1)

    from.forEach((a, i) => {
      const b = to[i]

      const byX = range(a[0], b[0])
      const byY = range(a[1], b[1])

      byX.forEach(x => byY.forEach(y => map.set(x, y, ROCK)))
    })
  })

  while (map.fillSand()) {}

  console.log(map.toPrint())
  console.log(map.sands)
}

(async function () {
  await one()
  await two()
})()
