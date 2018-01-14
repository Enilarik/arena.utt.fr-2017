import webp from './webp'

const loadImg = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.src = src

    img.onload = () => resolve(src)
    img.onerror = reject
  })
}

export default (src) => {
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp')

  return webp()
    .then(() => loadImg(webpSrc))
    .catch(() => loadImg(src))
}
