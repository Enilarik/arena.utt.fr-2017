import post from '../lib/post'
import token from '../lib/token'

export const joinTeam = async (team, joinTeamFinderMessage) => {
  const bodyToSend = joinTeamFinderMessage ? { team, joinTeamFinderMessage } : { team }

  const res = await post('/joinTeam', bodyToSend, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return []
  }

  return {
    type: 'JOIN_TEAM_ERROR',
    payload: body.error
  }
}

export const clearJoin = () => {
  return [
    {
      type: 'CLEAR_JOIN_TEAM_SUCCESS'
    }
  ]
}
