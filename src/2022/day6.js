import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const FILEPATH = '2022/day6.csv'

async function one() {
  const lines = await fileLines(FILEPATH)
  const data = lines[0]
  const uniqLength = 4

  for (let i = 0; i < (data.length - uniqLength); i++) {
    let uniq = [...new Set(data.slice(i, i+uniqLength))]

    if (uniq.length === uniqLength) {
      console.log(i + uniqLength)
      break
    }
  }
}

async function two() {
  const lines = await fileLines(FILEPATH)
  const data = lines[0]
  const uniqLength = 14

  for (let i = 0; i < (data.length - uniqLength); i++) {
    let uniq = [...new Set(data.slice(i, i+uniqLength))]

    if (uniq.length === uniqLength) {
      console.log(i + uniqLength)
      break
    }
  }
}

(async function () {
  await one()
  await two()
})()
