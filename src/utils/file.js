/**
 * Parse a blob file
 *
 * @param {Blob} file
 */
export const fileReader = (file) => {
  const reader = new FileReader()

  reader.onload = (event) => {
    const file = event.target.result

    // File
    console.log(file)

    const allLines = file.split(/\r\n|\n/)

    // Reading line by line
    allLines.forEach((line) => {
      //   console.log(line)
    })
  }

  reader.onerror = (event) => {
    alert(event.target.error.name)
  }

  reader.readAsText(file)
}
