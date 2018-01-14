import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  success: false,
  error: null
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'CREATE_TEAMFINDER_SUCCESS') {
    newState = state.set('success', true)
  }

  if (action.type === 'CREATE_TEAMFINDER_ERROR') {
    newState = state.set('error', action.payload)
  }

  return newState
}
