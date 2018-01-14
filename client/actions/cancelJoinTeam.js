import post from '../lib/post'
import token from '../lib/token'

export const cancelJoinTeam = async (team, userId) => {
  const res = await post('/cancelJoinTeam', { team }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return []
  }

  return {
    type: 'CANCEL_JOIN_TEAM_ERROR',
    payload: body.error
  }
}
