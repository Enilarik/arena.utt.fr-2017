module.exports = () => {
  if (!localStorage.hasOwnProperty('arena-login-token')) {
    return Promise.reject()
  }

  return fetch('/user', { headers: { token: localStorage.getItem('arena-login-token') } })
    .then((res) => res.json())
    .then((body) => {
      if (body.user && body.token) {
        return body
      }

      return Promise.reject()
    })
}
