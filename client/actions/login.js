import { push } from 'react-router-redux'
import post from '../lib/post'

export const showLoginModal = () => {
  return {
    type: 'SHOW_LOGIN_MODAL'
  }
}

export const showRegisterModal = () => {
  return {
    type: 'SHOW_REGISTER_MODAL'
  }
}

export const closeLoginModal = () => {
  return {
    type: 'CLOSE_LOGIN_MODAL'
  }
}

export const canLogin = async () => {
  const res = await fetch('/canLogin')
  const canLogin = await res.json()

  return {
    type: 'CAN_LOGIN',
    payload: canLogin.canLogin
  }
}

export const register = async (user) => {
  const res = await post('/register', user)
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'REGISTER_SUCCESS'
      },
      {
        type: 'SHOW_LOGIN_MODAL'
      }
    ]
  }

  return {
    type: 'REGISTER_ERROR',
    payload: body.error
  }
}

export const login = async (user) => {
  const res = await post('/login', user)
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'LOGIN_SUCCESS',
        payload: body
      },
      push('/dashboard')
    ]
  }

  return {
    type: 'LOGIN_ERROR',
    payload: body.error
  }
}

export const checkLoginStartup = async () => {
  if (!localStorage.hasOwnProperty('arena-login-token')) {
    return []
  }

  const res = await fetch('/user', { headers: { token: localStorage.getItem('arena-login-token') } })
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'LOGIN_SUCCESS',
        payload: body
      }
    ]
  }

  // If error, invalid token, clear it
  return [
    { type: 'LOGOUT' }
  ]
}

export const logout = () => {
  return [
    { type: 'LOGOUT' },
    push('/')
  ]
}
