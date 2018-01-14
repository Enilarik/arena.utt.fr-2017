import post from '../lib/post'
import token from '../lib/token'

export const createTeam = async (teamName) => {
  const res = await post('/createTeam', { teamName }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'CREATE_TEAM_SUCCESS',
        payload: body.team
      },
      {
        type: 'SET_USER_TEAM',
        payload: body.team
      }
    ]
  }

  return {
    type: 'CREATE_TEAM_ERROR',
    payload: body.error
  }
}
