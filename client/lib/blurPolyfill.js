export const supports = () => {
  return true
  const div = document.createElement('div')

  return div.style.backdropFilter || div.style.webkitBackdropFilter
}

export const updateBackgroundPosition = ($header) => {
  if (!$header) {
    return
  }

  let yPos = document.documentElement.scrollTop / (document.documentElement.offsetHeight - 60) * 100

  yPos = Math.min(yPos, 100)

  $header.style.backgroundPositionY = `${yPos}%`

  requestAnimationFrame(() => updateBackgroundPosition($header))
}

export const polyfill = ($header) => {
  updateBackgroundPosition($header)
}
