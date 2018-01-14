import { combineReducers } from 'redux';

import user from './user'
import createTeam from './createTeam'
import joinTeam from './joinTeam'
import teams from './teams'
import teamfinders from './teamfinders'
import createTeamfinder from './createTeamfinder'
import spotlight from './spotlight'
import userEdit from './userEdit'

const reducers = combineReducers({
  user,
  createTeam,
  joinTeam,
  teams,
  teamfinders,
  createTeamfinder,
  spotlight,
  userEdit
})

export default reducers
