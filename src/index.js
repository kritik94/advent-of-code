import { open } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const RESOURCES = resolve(
  fileURLToPath(import.meta.url),
  "../../resources"
)


Array.prototype.spl

export async function fileLines(filepath, cb = null) {
  if (cb === null) {
    cb = x => x
  }

  const file = await open(resolve(`${RESOURCES}/${filepath}`))
  const result = []

  for await (const line of file.readLines()) {
    result.push(cb(line))
  }

  return result
}

export async function fileLinesBy(filepath, count = 1) {
  const file = await open(resolve(`${RESOURCES}/${filepath}`))
  const result = []
  let current = []

  for await (const line of file.readLines()) {
    current.push(line)

    if (current.length >= count) {
      result.push(current)
      current = []
    }
  }

  if (current.length > 0) {
    result.push(current)
  }

  return result
}


export async function fileLinesGroupBy(filepath, splitCb) {
  const file = await open(resolve(`${RESOURCES}/${filepath}`))
  const result = []
  let current = []

  for await (const line of file.readLines()) {

    if (splitCb(line)) {
      result.push(current)
      current = []
      continue
    }

    current.push(line)
  }

  if (current.length > 0) {
    result.push(current)
  }

  return result
}
