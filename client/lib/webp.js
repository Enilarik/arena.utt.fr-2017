let webp = null

function testImage(src) {
  const img = new Image()

  return new Promise((resolve, reject) => {
    img.src = src

    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        resolve()
      } else {
        reject()
      }
    }

    img.onerror = reject
  })
}

export default () => {
  if (webp !== null) {
    return webp ? Promise.resolve() : Promise.reject()
  }

  const tests = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
  }

  return Promise
    .all([
      testImage(`data:image/webp;base64,${tests.lossy}`),
      testImage(`data:image/webp;base64,${tests.lossless}`)
    ])
    .then(() => {
      webp = true
    })
    .catch(() => {
      webp = false

      return Promise.reject()
    })
}
