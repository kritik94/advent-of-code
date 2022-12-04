import { open } from 'node:fs/promises'
import path from 'node:path';
import { fileLines, RESOURCES } from '../index.js';

async function one() {
  const file = await open(`${RESOURCES}/2022/day1.csv`)

  const {current, elfs} = (await fileLines('2022/day1.csv'))
    .reduce(({current, elfs}, line) => {
      if (line.length === 0) {
        return {
          current: 0,
          elfs: [...elfs, current],
        }
      }

      return {
        current: current + parseInt(line),
        elfs,
      }
    },
    {current: 0, elfs: []}
  )

  elfs.push(current)

  const maxInv = Math.max(...elfs)
  console.log(maxInv)
}

async function two() {
  const file = await open(path.resolve(`${RESOURCES}/2022/day1.csv`))
  let elfs = [];
  let current = []

  for await (const line of file.readLines()) {
    if (line.length === 0) {
      elfs.push(current.reduce((i, acc) => acc + i, 0))
      current = []
      continue;
    }

    current.push(parseInt(line))
  }

  elfs.sort((a, b) => b - a)
  console.log(elfs[0] + elfs[1] + elfs[2])
}

(async function () {
  await one()
  await two()
})()
