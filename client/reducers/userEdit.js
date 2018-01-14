import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  success: null,
  error: null
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'EDIT_USER_SUCCESS') {
    newState = state.set('success', true)
  }

  if (action.type === 'CLEAR_USER_SUCCESS') {
    newState = state.set('success', null)
  }

  if (action.type === 'EDIT_USER_ERROR') {
    newState = state.set('success', null).set('error', action.payload)
  }

  return newState
}
