import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day10.csv'
const FILEPATH_TEST = '2022/day10.test.csv'

const between = (x, a, b) => x >= a ? x <= b ? true : false : false

async function one() {
  const lines = await fileLines(FILEPATH)

  const commands = lines.map(line => {
    const m = line.match(/(?<command>\w+)( (?<argument>.+))?/)

    if (m.groups.command === 'addx') {
      return {...m.groups, argument: parseInt(m.groups.argument)}
    }

    return {...m.groups}
  })

  let x = 1
  let cycle = 1
  let signal = []
  commands.forEach(({command, argument}) => {
    if ((cycle + 20) % 40 === 0) {
      signal.push(x * cycle)
    }

    cycle++
    if (command === 'noop') {
      return
    }

    if ((cycle + 20) % 40 === 0) {
      signal.push(x * cycle)
    }

    if (command === 'addx') {
      x += argument
    }

    cycle++
  })

  const result = signal.reduce((acc, i) => acc + i, 0)
  console.log(result)
}

async function two() {
  const lines = await fileLines(FILEPATH)

  const commands = lines.map(line => {
    const m = line.match(/(?<command>\w+)( (?<argument>.+))?/)

    if (m.groups.command === 'addx') {
      return {...m.groups, argument: parseInt(m.groups.argument)}
    }

    return {...m.groups}
  })

  let x = 1
  let cycle = 1
  let signal = []
  commands.forEach(({command, argument}) => {
    signal.push(between((cycle - 1) % 40, x-1, x+1) ? '#' : '.')
    cycle++

    if (command === 'noop') {
      return
    }


    signal.push(between((cycle - 1) % 40, x-1, x+1) ? '#' : '.')
    if (command === 'addx') {
      x += argument
    }

    cycle++
  })

  const display = []
  for (let i = 0; i < signal.length; i += 40) {
    display.push(signal.slice(i, i+40).join(''))
  }

  console.log(display)
}

(async function () {
  await one()
  await two()
})()
