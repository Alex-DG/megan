import { chunk, uniqueStrings } from './array'

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
  const allLines = data.split(/\r\n|\n/)

  /**
   * [boneAnimationSequence] array of:
   *
   * {
   *    boneName,
   *    transform: {
   *        translation,
   *        rotation,
   *        scale
   *    }
   * }
   *
   */
  let boneAnimationSequence = []

  let frameRate, bones

  // Reading line by line
  allLines.forEach((line, index) => {
    switch (index) {
      case 0:
        // Line #1 contains the framerate of the animation.
        frameRate = Number(line)
        break
      case 1:
        // Line #2 contains bone animation channels
        const names = line.split(',')
        bones = uniqueStrings(names)
        break
      default:
        // Line #(index+1) animation values (comma separated) for the channels

        /**
         * {Step 1} - Generate an array with all animations values
         */
        const animationValues = line.split(',')

        /**
         * {Step 2} - Generate arrays of all channels
         * [9 channels] = (tx, ty, tz for translation, rx, ry, rz for rotation, sx, sy, sz for scale)
         */
        const channels = chunk(animationValues, 9)

        /**
         * {Step 3} - Generate new bone objects <=> { bone name and 3d transform }
         * 1 bone = 9 channels = 3d transform
         */
        const newBoneNameWithTransform = channels.map((values, i) => {
          return {
            boneName: bones[i],
            transform: {
              translation: values.slice(0, 3),
              rotation: values.slice(3, 6),
              scale: values.slice(6, 9),
            },
          }
        })

        /**
         * {Step 4} - Finally update our bone animation sequence
         */
        boneAnimationSequence = [
          ...boneAnimationSequence,
          newBoneNameWithTransform,
        ]
    }
  })

  console.log('Results found 👍 -> bones data built with success! 🚀 ....')

  return { boneAnimationSequence, frameRate }
}
