import { fileLines, fileLinesBy, fileLinesGroupBy, RESOURCES } from '../index.js';
import readline from 'node:readline'
import { privateDecrypt } from 'node:crypto';

const FILEPATH = '2022/day19.csv'
const FILEPATH_TEST = '2022/day19.test.csv'

function multipleRange(from, to, ...keys) {
  if (keys.length === 0) {
    return Array(to-from+1).fill(0).map((_, i) => i + from)
  }

  const [head, ...tail] = keys
  if (tail.length === 0) {
    return multipleRange(from, to).map(n => ({[head]: n}))
  }

  const headRange = multipleRange(from, to, head)
  const tailRange = multipleRange(from, to, ...tail)

  return headRange.flatMap(h => tailRange.map(t => ({...h, ...t})))
}

function simulate(strategi, blueprint, time = 23) {
  let storage = {ore: 0, clay: 0, obsidian: 0, geode: 0}
  let robots = {ore: 1, clay: 0, obsidian: 0, geode: 0}

  for (let t = 0; t < time; t++) {
    let building = null

    Object.entries(blueprint).reverse().map(([robot, req]) => {
      if (building || robots[robot] >= strategi[robot]) {
        return
      }

      if (Object.entries(req).every(([ore, cnt]) => storage[ore] >= cnt)) {
        Object.entries(req).forEach(([ore, cnt]) => storage[ore] -= cnt)
        building = robot
      }
    })

    Object.entries(robots).forEach(([robot, cnt]) => storage[robot] += cnt)

    if (building) {
      robots[building] += 1
    }

    console.log({t: t+1, storage, robots})
  }

  return {storage, robots}
}

async function one() {
  const groupLines = await fileLinesGroupBy(FILEPATH_TEST, line => line.length === 0)

  const blueprints = groupLines.map(lines => {
    const blueprintParts = lines.map(line => {
      if (line.startsWith("Blueprint")) {
        return
      }

      const match = line.match(/Each (?<robot>\w+).+costs (?<prices>.+)\./)
      const prices = match.groups.prices.split(' and ').map(price => {
        const priceMatch = price.match(/(\d+) (\w+)/)

        return [priceMatch[2], parseInt(priceMatch[1])]
      })

      return [match.groups.robot, Object.fromEntries(prices)]
    }).filter(i => i)

    return Object.fromEntries(blueprintParts)
  })

  console.log(blueprints)
  const strategies = multipleRange(1, 3, "geode", "obsidian", "clay", "ore")

  console.log(simulate({ore: 1, clay: 4, obsidian: 2, geode: 2}, blueprints[0]))

}

async function two() {
  const lines = await fileLines(FILEPATH_TEST)
}

(async function () {
  await one()
  await two()
})()
