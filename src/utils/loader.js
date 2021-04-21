export const hideLoading = () => {
  const container = document.getElementById('loading-container')

  if (container) {
    container.style.display = 'none'
  }
}

export const trackProgress = (xhr) => {
  if (xhr.total !== 0) {
    const progress = (xhr.loaded / xhr.total) * 100 + '%'
    console.log(`Loading in progress...`, `${progress} loaded`)
  } else {
    console.log(`Loading in progress...`)
  }
}
