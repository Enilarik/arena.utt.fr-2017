import post from '../lib/post'
import token from '../lib/token'

export const createTeamfinder = async (lookingFor) => {
  const res = await post('/teamfinder', { lookingFor }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'CREATE_TEAMFINDER_SUCCESS',
        payload: body
      }
    ]
  }

  return {
    type: 'CREATE_TEAMFINDER_ERROR',
    payload: body.error
  }
}
