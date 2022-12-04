import { fileLines, RESOURCES } from '../index.js';



async function one() {
  const handScore = {
    'X': 1,
    'Y': 2,
    'Z': 3,
  }

  const winScore = {
    'A': {
      'X': 3,
      'Y': 6,
      'Z': 0,
    },
    'B': {
      'X': 0,
      'Y': 3,
      'Z': 6,
    },
    'C': {
      'X': 6,
      'Y': 0,
      'Z': 3,
    },
  }
  const lines = (await fileLines('2022/day2.csv'))

  const scores = lines
    .map(line => line.split(' '))
    .map(([elf, me]) => {
        return handScore[me] + winScore[elf][me]
    })
  
  const result = scores.reduce((acc, x) => acc + x, 0)
  
  console.log(result)
}

async function two() {
  const handScore = {
    'A': {
      'X': 3,
      'Y': 1,
      'Z': 2,
    },
    'B': {
      'X': 1,
      'Y': 2,
      'Z': 3,
    },
    'C': {
      'X': 2,
      'Y': 3,
      'Z': 1,
    },
  }

  const winScore = {
    'X': 0,
    'Y': 3,
    'Z': 6,
  }
  const lines = (await fileLines('2022/day2.csv'))

  const scores = lines
    .map(line => line.split(' '))
    .map(([elf, me]) => {
        return handScore[elf][me] + winScore[me]
    })
  
  console.log(lines)
  console.log(scores)
  const result = scores.reduce((acc, x) => acc + x, 0)
  
  console.log(result)
}

(async function () {
  await one()
  await two()
})()
