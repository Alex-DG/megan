export const hideLoading = () => {
  const container = document.getElementById('loading-container')

  if (container) {
    container.style.display = 'none'
  }
}
