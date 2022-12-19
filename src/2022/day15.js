import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day15.csv'
const FILEPATH_TEST = '2022/day15.test.csv'

function parseSensor(line) {
  const match = line.match(/x=(-?\d+), y=(-?\d+).+x=(-?\d+), y=(-?\d+)/)
  const x = parseInt(match[1])
  const y = parseInt(match[2])
  const beaconX = parseInt(match[3])
  const beaconY = parseInt(match[4])

  return {
    x,
    y,
    beaconX,
    beaconY,
    distance: Math.abs(x - beaconX) + Math.abs(y - beaconY),
    check: function (x, y, without = true) {
      if (without && x === this.beaconX && y === this.beaconY) {
        return false
      }
      return (Math.abs(x - this.x) + Math.abs(y - this.y)) <= this.distance
    }
  }
}

async function one() {
  const lines = await fileLines(FILEPATH)

  const sensors = lines.map(parseSensor)

  const minX = Math.min(...sensors.map(({x, distance}) => x - distance))
  const maxX = Math.max(...sensors.map(({x, distance}) => x + distance))

  const y = 2000000
  let result = 0
  for (let x = minX; x <= maxX; x++) {
    if (sensors.some(beacon => beacon.check(x, y))) {
      result++
    }
  }

  console.log(result)
}

async function two() {
  const lines = await fileLines(FILEPATH)
  const sensors = lines.map(parseSensor)

  const min = 0
  const max = 4000000

  const result = (function() {
    for (let y = min; y <= max; y++) {
      const ranges = sensors.map(sensor => {
        const dis = Math.abs(sensor.y - y)
        if (dis > sensor.distance) {
          return null
        }

        const other = sensor.distance - dis

        return [sensor.x - other, sensor.x + other]
      }).filter(i => i).sort(([a], [b]) => a - b)

      let rangeMax = ranges[0][1]

      for (let i = 0; i < ranges.length; i++) {
        const [a, b] = ranges[i]
        if (a > rangeMax) {
          return {x: rangeMax+1, y}
        }
        if (b > rangeMax) {
          rangeMax = b
        }
      }
    }
  })()

  console.log(result)
  console.log(result.x * 4000000 + result.y)
}

(async function () {
  await one()
  await two()
})()
