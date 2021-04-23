/**
 * Create an array of chunk
 * The chunk size is defined by the size parameter
 *
 * @param {*} array
 * @param {Number} size
 * @returns [ [chunk1], [chunk2], ....]
 */
export const chunk = (array, size) => {
  return array?.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array?.slice(i, i + size))
    return acc
  }, [])
}

/**
 * Create an array with no string duplicates
 *
 * @param {String[]} array
 * @returns [ 'str1', 'str2', 'str3', ....]
 */
export const uniqueStrings = (array) => {
  return array?.reduce((acc, label) => {
    const values = label.split('.')
    const boneName = values[0]

    const isThere = acc.find((val) => val === boneName)
    if (!isThere) {
      return [...acc, boneName]
    }
    return acc
  }, [])
}
