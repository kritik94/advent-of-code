import { fileLines, fileLinesBy, RESOURCES } from '../index.js';
import createGraph from 'ngraph.graph'
import path from 'ngraph.path'

const FILEPATH = '2022/day16.csv'
const FILEPATH_TEST = '2022/day16.test.csv'

function parse(line) {
  const match = line.match(/Valve (?<name>\w+).+rate=(?<rate>\d+).+valves? (?<next>[A-Z, ]+)/)
  return {
    name: match.groups.name,
    rate: parseInt(match.groups.rate),
    next: match.groups.next.split(', '),
  }
}

function diff(a, b) {
  return a.filter(i => !b.includes(i))
}

function calcPath(valveMap, a, b) {
  if (a === b) {
    return 0
  }

  let distance = Object.fromEntries(Object.keys(valveMap).map(k => [k, -1]))
  distance[a] = 0
  let queue = [a]

  while (true) {
    const current = queue.shift()
    const notVisited = valveMap[current].next.filter(n => distance[n] === -1)

    notVisited.forEach(v => {
      distance[v] = distance[current] + 1
      queue.push(v)
    })

    if (notVisited.includes(b)) {
      return distance[b]
    }
  }
}

function memo(fn, ...def) {
  const mem = {}

  return (...args) => {
    const argsHash = JSON.stringify([...def, ...args])

    if (!(argsHash in mem)) {
      mem[argsHash] = fn(...def, ...args)
    }

    return mem[argsHash]
  }
}

async function one() {
  const lines = await fileLines(FILEPATH_TEST)

  const valves = lines.map(parse)
  const valveMap = Object.fromEntries(valves.map(({name, ...valve}) => [name, valve]))

  const memoPath = memo(calcPath, valveMap)

  function iter(current, opened, dis, acc) {
    const possible = opened.map(n => [n, memoPath(current, n)]).filter(([_, cost]) => cost < dis)

    if (possible.length === 0) {
      return [...acc, current].join('|')
    }

    const res = possible.flatMap(([next, cost]) => iter(
      next,
      diff(opened, [next]),
      dis - cost - 1,
      [...acc, current]
    ))

    return res
  }

  const opened = valves.filter(({rate}) => rate > 0).map(({name}) => name)
  const paths = iter('AA', opened, 30, [])

  let max = 0
  let maxPath = ""
  paths.forEach(path => {
    const vs = path.split('|')

    let acc = 0
    let rate = 0
    let time = 30
    for (let i = 0; i < vs.length - 1; i++) {
      const [a, b] = [vs[i], vs[i+1]]
      const cost = memoPath(a, b)
      acc += rate * (cost + 1)
      rate += valveMap[b].rate
      time -= cost + 1
    }

    acc += rate * time

    if (acc > max) {
      max = acc
      maxPath = path
    }
  })

  console.log(max)
  console.log(maxPath)
}

function lastBy(arr, cb) {
  const keys = []
  const res = []

  for (let i = arr.length-1; i>=0; i--) {
    const key = cb(arr[i])
    if (keys.includes(key)) {
      continue
    }
    keys.push(key)
    res[keys.indexOf(key)] = arr[i]
  }

  return res.reverse();
}

async function two() {
  const lines = await fileLines(FILEPATH_TEST)

  const valves = lines.map(parse)
  const valveMap = Object.fromEntries(valves.map(({name, ...valve}) => [name, valve]))

  const memoPath = memo(calcPath, valveMap)

  let count = 0

  function iter(opened, acc) {
    const lastes = lastBy(acc, i => i.who).sort((a, b) => a.time - b.time)
    const last = lastes[0]

    if (acc.some(i => i.time > 26)) {
      return [acc.filter(i => i.time <= 26)]
    }

    if (opened.length === 0) {
      return [acc]
    }

    const res = opened.map(next => {
      const cost = memoPath(last.current, next) + 1

      return iter(
        diff(opened, [next]),
        [...acc, {who: last.who, current: next, time: last.time+cost}]
      )
    })

    return res.flat(1)
  }

  const opened = valves.filter(({rate}) => rate > 0).map(({name}) => name)
  const paths = iter(opened, [{who: 'E', current: 'AA', time: 0}, {who: 'H', current: 'AA', time: 0}])

  console.log(paths.length)
  let max = 0
  let maxPath
  paths.map(path => {
    const rates = path.map(({current, time}) => valveMap[current].rate * (26-time)).reduce((acc, i) => acc + i, 0)
    if (rates > max) {
      max = rates
      maxPath = path
    }
  })

  console.log(max)
  console.log(maxPath)
  return
}

(async function () {
  // await one()
  await two()
})()
