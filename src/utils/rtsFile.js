import { chunk } from './array'

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

/**
 * Convert RTS data into usable bones animation sequence data
 * for Megan!
 *
 * @param {FileReader.result} data
 */
export const buildBoneAnimationSequence = (data) => {
  // Result = File
  const allLines = data.split(/\r\n|\n/)

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

  console.log('Results found 👍 -> bones data built with success! 🚀 ....')

  // About the results read the text below:

  /**
   * | If you want the bone 1, <boneName1> "all values" => values = boneAnimationSequence.values[0][0]
   *
   *    console.log({ bone1_All_Values: boneAnimationSequence.values[0][0] })
   *    i.e: ["0.000000", "0.000000", "0.000000", "0.000000", "-0.000000", "0.000000", "1.000000", "1.000000", "1.000000"]
   *
   * * * *
   *
   * | If you want the bone 1, animation channel 1 (tx) value => value = boneAnimationSequence.values[0][0][0]
   *
   *    console.log({ bone1_channel1_value: boneAnimationSequence.values[0][0][0] })
   *    i.e: Root_jnt.tx: 0.000000
   *
   * * * *
   *
   * | Finally if you are looking to get the specific values for translation, rotation and scale do as below:
   *
   *    console.log({ translation: boneAnimationSequence.values[0][0].slice(0, 3) })
   *    i.e: (tx, ty, tz) for translation
   *
   *    console.log({ rotation: boneAnimationSequence.values[0][0].slice(3, 6) })
   *    i.e: (rx, ry, rz) for rotation
   *
   *    console.log({ scale: boneAnimationSequence.values[0][0].slice(6, 9) })
   *    i.e: (sx, sy, sz) for scale
   */

  return boneAnimationSequence
}
