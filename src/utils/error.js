import { hideLoading } from './loader'

export const showError = (error) => {
  // Hide overlay
  hideLoading()

  alert(error.message)
}
