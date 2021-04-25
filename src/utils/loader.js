/**
 * Hide loading overlay
 */
export const hideLoading = () => {
  const container = document.getElementById('loading-container')

  if (container) {
    container.style.display = 'none'
  }
}

/**
 * Track loader progression
 *
 * @param {ProgressEvent<EventTarget>} xhr
 */
export const trackProgress = (xhr, label = '') => {
  if (xhr.total > 0) {
    const progress = (xhr.loaded / xhr.total) * 100 + '%'
    console.log(`⏱ ... Loading ${label} in progress ...`, `${progress} loaded`)
  } else {
    console.log(`⏱ ... Loading ${label} in progress ...`)
  }
}
