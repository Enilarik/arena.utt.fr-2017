import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  teams: []
})

export default (state = initialState, action) => {
  let newState = state

  if (action.type === 'LOGIN_SUCCESS') {
    newState = state.set('teams', Immutable.fromJS(action.payload.teams))
  }

  if (action.type === 'CREATE_TEAM_SUCCESS') {
    newState = state.set('teams',
      state.get('teams').push(Immutable.fromJS(action.payload))
    )
  }

  return newState
}
