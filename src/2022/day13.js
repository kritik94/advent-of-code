import { fileLines, fileLinesBy, fileLinesGroupBy, RESOURCES } from '../index.js';
import util from 'node:util'

const FILEPATH = '2022/day13.csv'
const FILEPATH_TEST = '2022/day13.test.csv'

function compare(left, right) {
  for (let i = 0; i <left.length; i++) {
    const [a, b] = [left[i], right[i]]
    if (right[i] === undefined) {
      return 1
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      const inner = compare(a, b)
      if (inner !== 0) {
        return inner
      }
      continue
    }

    if (Array.isArray(a)) {
      const inner = compare(a, [b])
      if (inner !== 0) {
        return inner
      }
      continue
    }

    if (Array.isArray(b)) {
      const inner = compare([a], b)
      if (inner !== 0) {
        return inner
      }
      continue
    }

    if (a < b) {
      return -1
    } else if (a > b) {
      return 1
    }
  }

  if (left.length < right.length) {
    return -1
  }

  return 0
}

async function one() {
  const lines = await fileLinesGroupBy(FILEPATH, line => line.length === 0)

  const pairs = lines.map(([left, right]) => [JSON.parse(left), JSON.parse(right)])

  const compairs = pairs.map((pair, idx) => compare(...pair) === -1 ? idx + 1: 0).filter(i => i)
  console.log(compairs.reduce((acc, i) => acc + i, 0))
}

async function two() {
  const lines = await fileLinesGroupBy(FILEPATH, line => line.length === 0)

  const pairs = lines.flatMap(([left, right]) => [JSON.parse(left), JSON.parse(right)])
  const allPairs = [...pairs, [[2]], [[6]]]

  const sorted = allPairs.sort(compare)

  const dividersIdx = sorted.reduce((acc, pair, i) => {
    const json = JSON.stringify(pair)
    if (json === '[[2]]' || json === '[[6]]') {
      return [...acc, i+1]
    }
    return acc
  })

  console.log(dividersIdx[0] * dividersIdx[1])
}

(async function () {
  await one()
  await two()
})()
