export default function inViewport (el) {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  )
}
