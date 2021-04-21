export const playAction = (mixer, animations, name) => {
  const action = mixer.clipAction(animations.find((a) => a.name === name))
  action.play()
}
