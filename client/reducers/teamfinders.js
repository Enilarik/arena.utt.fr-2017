import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  teamfinders: []
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'LOGIN_SUCCESS') {
    newState = state.set('teamfinders', Immutable.fromJS(action.payload.teamfinders))
  }

  if (action.type === 'CREATE_TEAMFINDER_SUCCESS') {
    newState = state.set('teamfinders', state.get('teamfinders').push(Immutable.fromJS(action.payload)))
  }

  return newState
}
