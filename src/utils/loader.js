export const hideLoading = () => {
  const container = document.getElementById('loading-container')

  if (container) {
    container.style.display = 'none'
  }
}

export const trackProgress = (xhr) => {
  // if (...) check on total just a quick fix as I'm testing out netlify with threejs model and loading
  // static content (megan = 15mb) for some reason xhr.total is equal to 0 once on netlify.
  // TODO: figure out why!? I think there is a way to optimise static content import with Webpack (or Netlify?) and I'm not doing it right atm
  if (xhr.total !== 0) {
    const progress = (xhr.loaded / xhr.total) * 100 + '%'
    console.log(`Loading in progress...`, `${progress} loaded`)
  } else {
    console.log(`Loading in progress...`)
  }
}
