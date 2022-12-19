import { fileLines, fileLinesBy, fileLinesGroupBy, RESOURCES } from '../index.js';
import readline from 'node:readline'

const FILEPATH = '2022/day11.csv'
const FILEPATH_TEST = '2022/day11.test.csv'

function writeWaiting(str) {
  readline.clearLine();
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`waiting: ${str}`);
}

function parse(lines) {

  let monkey = {inspect: 0}

  const itemMatch = lines[1].match(/Starting items: ([0-9, ]+)/)
  monkey.items = itemMatch[1].split(', ').map(i => parseInt(i))

  const operationMatch = lines[2].match(/Operation: new = old (?<op>[*+]) (?<val>\w+)/)
  const op = operationMatch.groups.op
  const val = operationMatch.groups.val

  monkey.operation = (item) => {
    if (val === 'old') {
      switch (op) {
        case '*': return item * item
        case '+': return item + item
      }
    }

    switch (op) {
      case '*': return item * parseInt(val)
      case '+': return item + parseInt(val)
    }
  }

  const dividerMatch = lines[3].match(/Test: divisible by (\d+)/)
  const trueMonkeyMatch = lines[4].match(/If true: throw to monkey (\d+)/)
  const falseMonkeyMatch = lines[5].match(/If false: throw to monkey (\d+)/)
  const dividedBy = parseInt(dividerMatch[1])
  const trueMonkey = parseInt(trueMonkeyMatch[1])
  const falseMonkey = parseInt(falseMonkeyMatch[1])

  monkey.throw = (item) => item % dividedBy === 0 ? trueMonkey : falseMonkey

  return monkey
}

function monkeysPrint(monkeys) {
  const lines = monkeys.map(({items}, i) => {
    return `Moneky ${i}: ` + items.join(', ')
  })

  process.stdout.write(lines.join('\n') + '\n')
}

function inspectedPrint(monkeys) {
  const lines = monkeys.map(({inspect}, i) => {
    return `Moneky ${i} inspected ${inspect}`
  })

  process.stdout.write(lines.join('\n') + '\n')
}

async function one() {
  const groupLines = await fileLinesGroupBy(FILEPATH, line => line.length === 0)

  const monkeys = groupLines.map(parse)

  Array(20).fill(0).forEach(_ => {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const worry = Math.floor(monkey.operation(item) / 3)
        monkeys[monkey.throw(worry)].items.push(worry)
      })

      monkey.inspect += monkey.items.length
      monkey.items = []
    }) 
  })

  const inspects = monkeys.map(({inspect}) => inspect).sort((a, b) => b - a)
  const result = inspects[0] * inspects[1]
  console.log(result)
}

async function two() {
  const groupLines = await fileLinesGroupBy(FILEPATH, line => line.length === 0)

  const monkeys = groupLines.map(parse)

  Array(10000).fill(0).forEach(_ => {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const worry = monkey.operation(item) % (2*7*3*11*17*5*13*19)
        monkeys[monkey.throw(worry)].items.push(worry)
      })

      monkey.inspect += monkey.items.length
      monkey.items = []
    })
  })

  const inspects = monkeys.map(({inspect}) => inspect).sort((a, b) => b - a)
  const result = inspects[0] * inspects[1]

  console.log(result)
}

(async function () {
  await one()
  await two()
})()
