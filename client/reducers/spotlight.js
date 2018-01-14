import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  spotlight: null,
  error: null,
  allSpotlights: null
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'LOGIN_SUCCESS') {
    if (action.payload.user.team) {
      newState = state.set('spotlight', action.payload.user.team.spotlightId)
    } else {
      // no team = no spotlight
      newState = state.set('spotlight', null)
    }
  }

  if (action.type === 'SPOTLIGHT_SUCCESS') {
    newState = state.set('spotlight', action.payload)
  }

  if (action.type === 'SPOTLIGHT_ERROR') {
    newState = state.set('error', action.payload)
  }

  if (action.type === 'CLEAR_SPOTLIGHT_ERROR') {
    newState = state.set('error', null)
  }

  if (action.type === 'SPOTLIGHT_STATUS_SUCCESS') {
    const byId = (a, b) => a.id - b.id
    newState = state.set('allSpotlights', Immutable.fromJS(action.payload.sort(byId)))
  }

  if (action.type === 'LOGOUT') {
    newState = state
      .set('spotlight', null)
      .set('error', null)
      .set('allSpotlights', null)
  }

  return newState
}
