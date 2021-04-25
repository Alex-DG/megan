import { chunk } from './array'
import * as THREE from 'three'

/**
 * Actions
 * - active
 * - previous
 */
let activeAction, previousAction

/**
 * Smooth animation transition switching from
 * previous actions (if exits) to the current
 * active action.
 *
 * @param {THREE.AnimationMixer} name - action
 * @param {Number} duration - fade in timer
 */
export const fadeToAction = (action, duration) => {
  previousAction = activeAction
  activeAction = action

  if (previousAction !== activeAction) {
    previousAction?.fadeOut(duration)
  }

  activeAction
    ?.reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play()
}

/**
 * Convert RTS data to animation clip!
 *
 * @param {FileReader.result} fileContent - from .rts file
 */
export const buildAnimationClip = (fileContent) => {
  const lines = fileContent.split(/\r\n|\n/)

  console.log(`~~~~ 🛠 Building Animation Clip from .rts file 🛠 ~~~~`)

  //////////////////////////////////////////////////////////////
  // {STEP 1} - Convert rts file content to usable data for Megan
  // => Bone names, channels and values
  //////////////////////////////////////////////////////////////

  /**
   * Line #1 contains the framerate of the animation.
   */
  const frameRate = Number(lines[0])

  /**
   * Line #2 contains bone animation channels: [`boneName.channeName`, ...]
   */
  const boneAnimationChannels = lines[1].split(',')

  // current RTS content format `boneName.channelName` needs to be renamed to match Megan's skeleton values,
  // following this pattern: (tx, ty, tz) = `position`, (rx, ry, rz) = `rotation`, (sx, sy, sz) = `scale`
  const boneChannelNames = chunk(boneAnimationChannels, 3).reduce(
    (results, boneChannels) => {
      const nameChannel1 = boneChannels[0].split('.') // <boneName>.<animationChannelName>

      const channel = nameChannel1[1],
        name = nameChannel1[0]

      switch (channel) {
        case 'tx':
          return [...results, `${name}.position`]

        case 'rx':
          return [...results, `${name}.quaternion`]

        case 'sx':
          return [...results, `${name}.scale`]

        default:
          return results
      }
    },
    []
  )

  /**
   * Line #X => with X > 1 <=> 1 = `index` of [lines]
   * Each subsequent line contains the animation values for the channels of line #2 for a single frame of animation
   */

  const boneChannelValues = lines
    // we only need lines > 1 (we don't want the frame rate or the bones/channels' names)
    .filter((line, index) => index > 1 && line !== '')
    // each line contain values (comma separated) for the channels of line #2
    .map((line) => line.split(','))
    // the lines content is made of strings we have to convert them to float to be readable by Megan
    .map((valuesStr) => {
      return valuesStr.map((floatStr) => Number(floatStr))
    })

  console.log('Step 1 ✅ ', { boneChannelNames, boneChannelValues })

  /////////////////////////////////////////////////////////////////////////
  // {STEP 2} - Create KeyFrameTracks array
  // => https://threejs.org/docs/#api/en/animation/KeyframeTrack
  /////////////////////////////////////////////////////////////////////////

  /**
   * First I used random values for each KeyFrameTrack from a three.js repo example
   * see example: https://github.com/mrdoob/three.js/blob/master/examples/misc_animation_keys.html
   * To test if I could load the clip generated within Megan (seems ok 👍), the behaviour was not ok obviously (with random/wrong values), but no crash!
   */

  const tracks = boneChannelNames.reduce(
    (keyFrameTracks, boneChannel, index) => {
      const channelName = boneChannel.split('.')[1] // for reference: `boneName.ChannelName`

      const values = boneChannelValues[index] // we want to channels' values of the same matching boneChannelNames array

      switch (channelName) {
        // -> VectorKeyframeTrack
        // https://threejs.org/docs/?q=VectorKeyframeTrack#api/en/animation/tracks/VectorKeyframeTrack
        case 'position':
        case 'scale':
          const keyFrame = new THREE.VectorKeyframeTrack(
            boneChannel,
            [0, 1, 2],
            values // or for position something like `values.slice(0, 3)` and for scale `values.slice(6, 9)`
          )

          return [...keyFrameTracks, keyFrame]

        // -> QuaternionKeyframeTrack
        // https://threejs.org/docs/?q=QuaternionKeyframeTrack#api/en/animation/tracks/QuaternionKeyframeTrack
        case 'quaternion':
          //   const quaternionKeyFrame = new THREE.QuaternionKeyframeTrack(
          //     boneChannel,
          //     [0, 1, 2],
          //     values or values.slice(3, 6) // not working
          //   )
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

          return [...keyFrameTracks, quaternionKeyFrame]

        default:
          return keyFrameTracks
      }
    },
    []
  )

  console.log('Step 2 ✅ ', { tracks })

  //////////////////////////////////////////////////////////////
  // {STEP 3} - Animation sequence creation with tracks
  // => https://threejs.org/docs/#api/en/animation/AnimationClip
  //////////////////////////////////////////////////////////////

  // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
  const clip = new THREE.AnimationClip('WIP: RTS 🚧', -1, tracks)

  console.log('Step 3 ✅ ', { clip })

  console.log(`~~~~ 🚀 Animation Clip built with success 🚀 ~~~~`)

  return { clip, frameRate }
}
