import { AnimationMixer } from 'three'

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
 * @param {AnimationMixer} name - action
 * @param {Number} duration - fade in timer
 * @param {Boolean} play
 */
export const fadeToAction = (action, duration, play) => {
  previousAction = activeAction
  activeAction = action

  if (previousAction !== activeAction) {
    previousAction?.fadeOut(duration)
  }

  // Play or Stop action
  switch (play) {
    case false:
      // GUI uncheck box <=> stop action  :(
      activeAction?.fadeOut(duration)
      break
    default:
      // GUI check box <=> play action :D
      activeAction
        ?.reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play()
  }
}
