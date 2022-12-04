import { fileLines, fileLinesBy, RESOURCES } from '../index.js';

const intersection = (x, ...rest) => {
  return rest.reduce((y, res) => res.filter(i => y.includes(i)), x)
    .reduce((i, uniq) => uniq.includes(i) ? uniq : [...uniq, i], [])
}

async function one() {
  const lines = await fileLines('2022/day3.csv')

  const items = lines
    .map(line => [line.slice(0, line.length / 2), line.slice(line.length / 2)])
    .map(([x, y]) => intersection(x.split(''), y.split('')))

  const priority = items.map(
    ([char, ...rest]) => char.charCodeAt() - (char >= 'a' ? 96 : 38)
  ).reduce((i, acc) => acc + i, 0)
  console.log(priority)
}

async function two() {
  const groupLines = await fileLinesBy('2022/day3.csv', 3)
  const items = groupLines
    .map(lines => intersection(...lines.map(l => l.split(''))))

  const priority = items.map(
    ([char, ...rest]) => char.charCodeAt() - (char >= 'a' ? 96 : 38)
  ).reduce((i, acc) => acc + i, 0)
  console.log(priority)
}

(async function () {
  await one()
  await two()
})()
