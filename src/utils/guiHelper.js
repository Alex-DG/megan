export const guiPosition = (folder, scene) => {
  folder
    .add(scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation')

  folder
    .add(scene.position, 'x')
    .min(-4)
    .max(4)
    .step(0.01)
    .onFinishChange((value) => {
      scene.position.set(value, 0, 0)
    })
    .name('position X')

  folder
    .add(scene.position, 'y')
    .min(-4)
    .max(4)
    .step(0.01)
    .onFinishChange((value) => {
      scene.position.set(0, value, 0)
    })
    .name('position Y')

  folder
    .add(scene.position, 'z')
    .min(-4)
    .max(4)
    .step(0.01)
    .onFinishChange((value) => {
      scene.position.set(0, 0, value)
    })
    .name('position Z')
}

export const guiDirectionalLight = (folder, light) => {
  folder
    .add(light, 'intensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name(`direct intensity`)
  folder
    .add(light.position, 'x')
    .min(-5)
    .max(5)
    .step(0.001)
    .name(`direct lightX`)
  folder
    .add(light.position, 'y')
    .min(-5)
    .max(5)
    .step(0.001)
    .name(`direct lightY`)
  folder
    .add(light.position, 'z')
    .min(-5)
    .max(5)
    .step(0.001)
    .name(`direct lightZ`)
}
