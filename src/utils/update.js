/**
 * Three.js Object3D.traverse
 * https://threejs.org/docs/#api/en/core/Object3D.traverse
 */

/**
 * Update Materials
 * @param {*} scene
 * @param {*} callback
 */
export const updateAllMaterials = (scene, callback) => {
  scene.traverse((node) => {
    // Update materials on node type mesh
    if (node?.isMesh) {
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material]

      // Update material by sending back through the callback
      materials.forEach(callback)
    }
  })
}
