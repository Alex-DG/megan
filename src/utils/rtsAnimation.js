import { chunk } from './array'
import * as THREE from 'three'

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
 * Convert RTS data to animation clip!
 *
 * @param {FileReader.result} data
 */
export const buildAnimationClip = (data) => {
  const allLines = data.split(/\r\n|\n/)

  let frameRate

  let allBones // an array of `boneName.channel` => i.e: [ "Root_jnt.position", ... ]
  let allChannelsValues = [] // an array of all `channels` => [ [ 0,0,0  1,-1,1  0,1,0 ], ... ]

  // Reading line by line
  allLines.forEach((line, index) => {
    switch (index) {
      case 0:
        // Line #1 contains the framerate of the animation.
        frameRate = Number(line)
        break
      case 1:
        // Line #2 contains bone animation channels
        const boneNameValues = line.split(',')

        allBones = chunk(boneNameValues, 3).reduce((res, boneChannels) => {
          const nameChannel1 = boneChannels[0].split('.')
          const channel = nameChannel1[1],
            name = nameChannel1[0]

          switch (channel) {
            case 'tx':
              return [...res, `${name}.position`]

            case 'rx':
              return [...res, `${name}.rotation`]

            case 'sx':
              return [...res, `${name}.scale`]

            default:
              return res
          }
        }, [])
        break
      default:
        // Line #(index+1) animation values (comma separated) for the channels

        /**
         * {Step 1} - Generate an array with all animations values
         */
        const values = line.split(',')

        /**
         * {Step 2} - Generate arrays of all channels
         * [9 channels] = (tx, ty, tz for translation, rx, ry, rz for rotation, sx, sy, sz for scale)
         */
        const channels = chunk(values, 9)
        allChannelsValues = [...allChannelsValues, channels]
    }
  })

  /**
   * For now I'm using random values for each KeyFrameTrack
   * Testing if I can load the clip generated within Megan (seems ok 👍)
   *
   * see example: https://github.com/mrdoob/three.js/blob/master/examples/misc_animation_keys.html
   */

  // Build tracks => an array of KeyframeTracks
  const tracks = allBones.reduce((res, boneChannel) => {
    const bone = boneChannel.split('.')
    const channel = bone[1]

    switch (channel) {
      case 'position':
        // https://threejs.org/docs/?q=VectorKeyframeTrack#api/en/animation/tracks/VectorKeyframeTrack
        const positionKeyFrame = new THREE.VectorKeyframeTrack(
          boneChannel,
          [0, 1, 2],
          [0, 0, 0, 30, 0, 0, 0, 0, 0]
        )
        return [...res, positionKeyFrame]

      case 'rotation':
        // https://threejs.org/docs/?q=QuaternionKeyframeTrack#api/en/animation/tracks/QuaternionKeyframeTrack
        const xAxis = new THREE.Vector3(1, 0, 0)

        const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
        const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI)
        const quaternionKeyFrame = new THREE.QuaternionKeyframeTrack(
          boneChannel,
          [0, 1, 2],
          [
            qInitial.x,
            qInitial.y,
            qInitial.z,
            qInitial.w,
            qFinal.x,
            qFinal.y,
            qFinal.z,
            qFinal.w,
            qInitial.x,
            qInitial.y,
            qInitial.z,
            qInitial.w,
          ]
        )

        return [...res, quaternionKeyFrame]

      case 'scale':
        const scaleKeyFrame = new THREE.VectorKeyframeTrack(
          boneChannel,
          [0, 1, 2],
          [1, 1, 1, 2, 2, 2, 1, 1, 1]
        )
        return [...res, scaleKeyFrame]

      default:
        return res
    }
  }, [])

  // Create an animation sequence with tracks
  // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
  // https://threejs.org/docs/#api/en/animation/AnimationClip
  const clip = new THREE.AnimationClip('rts', -1, tracks)

  console.log('RTS AnimationClip found 👍 -> built with success! 🚀 ....', {
    clip,
  })

  return { clip, frameRate }
}
