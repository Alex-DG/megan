import { hideLoading } from './loader'

/**
 * Three.js loader error manager
 *
 * @param {ErrorEvent} error
 */
export const showError = (error) => {
  // Hide overlay
  hideLoading()

  alert(error.message)
}
