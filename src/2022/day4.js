import { fileLines, fileLinesBy, RESOURCES } from '../index.js';


async function one() {
  const lines = await fileLines('2022/day4.csv')
  const sections = lines.map(a => a.split(','))
    .map(a => a.flatMap(i => i.split('-')))
    .map(a => a.map(i => parseInt(i)))
  
  const fully = sections.filter(([a, b, x, y]) => {
    return (a >= x && b <= y)
      || (a <= x && b >= y)
  })

  console.log(fully.length)
}

async function two() {
  const lines = await fileLines('2022/day4.csv')
  const sections = lines.map(a => a.split(','))
    .map(a => a.flatMap(i => i.split('-')))
    .map(a => a.map(i => parseInt(i)))
  
  const fully = sections.filter(([a, b, x, y]) => {
    return (b >= x && a <= y) || (a <= y && b >= x)
  })

  console.log(fully.length)
}

(async function () {
  await one()
  await two()
})()
