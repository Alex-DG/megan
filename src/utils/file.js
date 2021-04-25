/**
 * Read file blob
 *
 * @param {Blob} file
 */
export const readRtsFile = (file) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = (event) => {
      alert(event.target.error.name)
    }

    reader.readAsText(file)
  })
}
