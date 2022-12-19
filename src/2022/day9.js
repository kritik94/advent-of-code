import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day9.csv'
const moveHead = ({x, y}, d) => {
  switch (d) {
    case "U":
      return {x, y: y + 1}
    case "D":
      return {x, y: y - 1}
    case "R":
      return {x: x + 1, y}
    case "L":
      return {x: x - 1, y}
  }
}
const moveTail = (tail, head) => {
  const dx = head.x - tail.x
  const dy = head.y - tail.y

  if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
    return {x: tail.x + (dx / 2), y: tail.y + (dy / 2)}
  }
  if (Math.abs(dx) === 2 && Math.abs(dy) === 1) {
    return {x: tail.x + (dx / 2), y: tail.y + dy}
  }
  if (Math.abs(dx) === 1 && Math.abs(dy) === 2) {
    return {x: tail.x + dx, y: tail.y + (dy / 2)}
  }
  if (Math.abs(dx) === 2 && dy === 0) {
    return {x: tail.x + (dx / 2), y: tail.y}
  }
  if (dx === 0 && Math.abs(dy) === 2) {
    return {x: tail.x, y: tail.y + (dy / 2)}
  }

  return tail
}

async function one() {
  const lines = await fileLines(FILEPATH)
  let head = {x: 0, y: 0}
  let tail = {x: 0, y: 0}
  const tailPositions = new Set()

  const moves = lines.map(line => line.split(' '))

  moves.forEach(([dir, size]) => {
    Array(parseInt(size)).fill(0).forEach(_ => {
      head = moveHead(head, dir)
      tail = moveTail(tail, head)
      tailPositions.add(`${tail.x}:${tail.y}`)
    })
  })

  console.log(tailPositions.size)
}

async function two() {
  const lines = await fileLines(FILEPATH)
  // const lines = [
  //   'R 5',
  //   'U 8',
  //   'L 8',
  //   'D 3',
  //   'R 17',
  //   'D 10',
  //   'L 25',
  //   'U 20',
  // ]
  let rope = Array(10).fill({x: 0, y: 0})
  const tailPositions = new Set()

  const moves = lines.map(line => line.split(' '))

  let c = 999999999999
  moves.forEach(([dir, size]) => {
    Array(parseInt(size)).fill(0).forEach(_ => {
      rope[0] = moveHead(rope[0], dir)
      for (let i=1; i < rope.length; i++) {
        rope[i] = moveTail(rope[i], rope[i-1])
      }
      // if (c-- > 0) print(rope, 15, 15)
      tailPositions.add(`${rope[rope.length - 1].x}:${rope[rope.length - 1].y}`)
    })
  })
  console.log(rope)

  console.log(tailPositions.size)
}

function print(rope, mx = 44, my = 44) {
  for (let y = my; y >= -my; y--) {
    let line = []
    for (let x = -mx; x <= mx; x++) {
      let sym = '.'
      rope.forEach(({x: rx, y: ry}, i) => {
        if (rx === x && ry === y) {
          sym = i
        }
      })

      line.push(sym)
    }

    process.stdout.write(line.join('') + '\n')
  }
}

(async function () {
  await one()
  await two()
})()
