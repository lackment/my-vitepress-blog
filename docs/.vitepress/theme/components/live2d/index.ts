const loadLive2d = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('modelId', '2')
  const live2D = document.createElement('script')
  live2D.src =
    'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js'
  document.body.appendChild(live2D)
}

export default loadLive2d
