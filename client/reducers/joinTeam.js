import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  success: false,
  error: null
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'JOIN_TEAM_SUCCESS') {
    newState = state.set('success', true)
  }

  if (action.type === 'JOIN_TEAM_ERROR') {
    newState = state.set('error', action.payload)
  }

  if (action.type === 'CLEAR_JOIN_TEAM_SUCCESS') {
    newState = state.set('success', false)
  }

  return newState
}
