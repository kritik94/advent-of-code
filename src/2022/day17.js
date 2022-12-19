import { fileLines, fileLinesBy, RESOURCES } from '../index.js';
import readline from 'node:readline'

const FILEPATH = '2022/day17.csv'
const FILEPATH_TEST = '2022/day17.test.csv'

function* createLoop(arr, count = Infinity) {
  for (let i = 0; i < count; i++) {
    yield arr[i % arr.length]
  }
}

const patterns = {
  "HLINE": [['#','#','#','#']],
  "CROSS": [['.','#','.'], ['#','#','#'], ['.','#','.']],
  "L": [['.','.','#'],['.','.','#'],['#','#','#']],
  "VLINE": [['#'],['#'],['#'],['#']],
  "SQUARE": [['#','#'],['#','#']],
};

function createRock(type, x, y) {
  const pattern = patterns[type]

  return {
    type,
    x,
    y,
    info: function() {
      return {type: this.type, x: this.x, y: this.y}
    },
    xy: function() {
      return {x: this.x, y: this.y}
    },
    left: function(map, log = false) {
      const leftX = pattern.map(line => line.indexOf('#')).reverse()
      log && console.log(leftX)
      log && console.log(leftX.map((x, y) => [this.x + x - 1, this.y + y]))
      if (leftX.every((x, y) => map.isFree(this.x + x - 1, this.y + y))) {
        this.x--
        return true
      }
      return false
    },
    right: function(map) {
      const rightX = pattern.map(line => line.lastIndexOf('#')).reverse()
      if (rightX.every((x, y) => map.isFree(this.x + x + 1, this.y + y))) {
        this.x++
        return true
      }
      return false
    },
    down: function(map, log = false) {
      let rev = pattern.map(i => i).reverse()
      const downY = rev.reduce((acc, line, y) => {
        line.forEach((ch, x) => {
          if (ch === '#' && acc[x] === -1) {
            acc[x] = y
          }
        })

        return acc
      }, Array(pattern[0].length).fill(-1))

      log && console.log(downY)
      log && console.log(downY.map((x, y) => [this.x + x, this.y + y - 1]))
      if (downY.every((y, x) => map.isFree(this.x + x, this.y + y - 1))) {
        this.y--
        return true
      }

      return false
    },
    full: function() {
      let rev = pattern.map(i => i).reverse()

      let result = []
      rev.forEach((line, y) => {
        line.forEach((ch, x) => {
          if (ch !== '#') return
          result.push(`${this.x+x}.${this.y+y}`)
        })
      })

      return result
    }
  }
}

function createMap() {
  return {
    size: 0,
    rocks: new Set(),
    isFree: function(x, y) {
      if (x < 0 || x > 6 || y < 0) {
        return false
      }
      return !this.rocks.has(`${x}.${y}`)
    },
    getMaxY: function() {
      let max = -1
      this.rocks.forEach(i => max = Math.max(max, parseInt(i.split('.')[1])))
      return max
    },
    add: function(positions) {
      this.size++
      positions.forEach(p => this.rocks.add(p))
    },
    print: function(p = null) {
      const pset = new Set(p !== null ? p.full() : [])
      const maxY = this.getMaxY()

      let lines = []
      for (let y = maxY + 4; y >= 0; y--) {
        let line = []
        for (let x = 0; x < 7; x++) {
          if (this.rocks.has(`${x}.${y}`)) {
            line.push('#')
          } else if (pset.has(`${x}.${y}`)) {
            line.push('@')
          } else {
            line.push('.')
          }
        }
        lines.push(line.join(''))
        line = []
      }

      return lines.join('\n')
    }
  }
}

async function one() {
  const lines = await fileLines(FILEPATH)

  const map = createMap()
  const jetLoop = createLoop(lines[0].split(''))
  const patterLoop = createLoop(Object.keys(patterns))

  let move
  let p = createRock(patterLoop.next().value, 2, map.getMaxY() + 4)
  while (map.size < 2022) {
    move = jetLoop.next().value
    if (move === '<') {
      p.left(map)
    } else {
      p.right(map)
    }

    if (p.down(map)) {
      continue
    }

    map.add(p.full())
    p = createRock(patterLoop.next().value, 2, map.getMaxY() + 4)
    writeWaiting(`${map.size} / 2022`)
  }
  console.log()
  console.log(map.getMaxY()+1)
}

function writeWaiting(str) {
  readline.clearLine();
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`waiting: ${str}`);
}

async function two() {
  const lines = await fileLines(FILEPATH_TEST)

  const map = createMap()
  const jetLoop = createLoop(lines[0].split(''))
  const patterLoop = createLoop(Object.keys(patterns))

  let move
  let p = createRock(patterLoop.next().value, 2, map.getMaxY() + 4)
  while (map.size < 1000000000000) {
    move = jetLoop.next().value
    if (move === '<') {
      p.left(map)
    } else {
      p.right(map)
    }

    if (p.down(map)) {
      continue
    }

    map.add(p.full())
    p = createRock(patterLoop.next().value, 2, map.getMaxY() + 4)
    writeWaiting(`${map.size} / 1000000000000`)
  }
  console.log(map.getMaxY()+1)
}

(async function () {
  await one()
  // await two()
})()
