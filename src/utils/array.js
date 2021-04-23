/**
 * Create an array of chunk
 * The chunk size is defined by the size parameter
 *
 * @param {Array} array
 * @param {Number} size
 * @returns [[chunk1],[chunk2], ....]
 */
export const chunk = (array, size) => {
  return array?.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array?.slice(i, i + size))
    return acc
  }, [])
}
