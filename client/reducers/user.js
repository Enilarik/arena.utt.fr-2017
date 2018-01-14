import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  user: null,
  token: null,
  canLogin: false,
  modal: 'none',
  registerError: null,
  loginError: null
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'SET_USER') {
    newState = state.set('user', action.payload)
  }

  if (action.type === 'SHOW_LOGIN_MODAL') {
    newState = state.set('modal', 'login')
  }

  if (action.type === 'SHOW_REGISTER_MODAL') {
    newState = state.set('modal', 'register')
  }

  if (action.type === 'CLOSE_LOGIN_MODAL') {
    newState = state.set('modal', 'none')
  }

  if (action.type === 'REGISTER_ERROR') {
    newState = state.set('registerError', action.payload)
  }

  if (action.type === 'LOGIN_ERROR') {
    newState = state.set('loginError', action.payload)
  }

  if (action.type === 'CAN_LOGIN') {
    newState = state.set('canLogin', action.payload)
  }

  if (action.type === 'LOGIN_SUCCESS') {
    newState = state
      .set('user', Immutable.fromJS(action.payload.user))
      .set('token', action.payload.token)
      .set('modal', 'none')

    localStorage.setItem('arena-login-token', action.payload.token)
  }

  if (action.type === 'LOGOUT') {
    newState = state
      .set('user', null)
      .set('token', null)
      .set('modal', 'none')

    localStorage.removeItem('arena-login-token')
  }

  if (action.type === 'SET_USER_TEAM') {
    newState = state.setIn(['user', 'team'], Immutable.fromJS(action.payload))
  }

  return newState
}
