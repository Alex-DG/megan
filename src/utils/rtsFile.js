import { chunk } from './array'

/**
 * Parse a blob file
 *
 * @param {Blob} file
 */
export const getRtsFileData = (file) => {
  const reader = new FileReader()

  console.log(
    ':::::::::::: RTS File: Building << Bone Animation Sequence >> ... 🛠 :::::::::::::::'
  )

  reader.onload = ({ target: { result } }) => {
    // Result = File
    const allLines = result.split(/\r\n|\n/)

    console.log('Number of Lines:', allLines.length)

    /**
     * { boneAnimationSequence }
     * is an object where you can find all the bones, all the values and the frame rate
     * provided in the RTS file
     */
    let boneAnimationSequence = {
      frameRate: 0,
      bones: [],
      values: [],
    }

    // Reading line by line
    allLines.forEach((line, index) => {
      switch (index) {
        case 0:
          // Line #1 contains the framerate of the animation.
          //   console.log(`Line #1 -> Frame Rate = ${line}`)

          boneAnimationSequence = {
            ...boneAnimationSequence,
            frameRate: Number(line),
          }
          break
        case 1:
          // Line #2 contains bone animation channels
          const allBones = line.split(',')
          const bones = chunk(allBones, 9)
          //   console.log('Line #2 -> channels', { channels })

          boneAnimationSequence = {
            ...boneAnimationSequence,
            bones,
          }

          break
        default:
          // Lines #(1+x) contains the animation values
          const allchannelsValues = line.split(',')

          // Each chunk in newValues represents: [ x1, y1, z1, x2, y2, z2, x3, y3, z3 ] for each channels
          const newValues = chunk(allchannelsValues, 9)

          // console.log(`Line #${index + 1} -> values`, { values })

          boneAnimationSequence = {
            ...boneAnimationSequence,
            values: [...boneAnimationSequence.values, newValues],
          }
      }
    })

    console.log('Results found 👍 .... please see below ....')
    console.log({
      ...boneAnimationSequence,
    })

    /**
     * Now if you want the bone 1, <boneName1> "all values" => values = boneAnimationSequence.values[0][0]
     * test: console.log({ test: boneAnimationSequence.values[0][0] })
     *
     * Now if you want the bone 1, animation channel 1 value => value = boneAnimationSequence.values[0][0][0]
     * test: console.log({ test: boneAnimationSequence.values[0][0][0] })
     */

    console.log(
      ':::::::::::: RTS File: results built with success! 🚀 :::::::::::::::'
    )
  }

  reader.onerror = (event) => {
    alert(event.target.error.name)
  }

  reader.readAsText(file)
}
