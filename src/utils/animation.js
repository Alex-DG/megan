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
