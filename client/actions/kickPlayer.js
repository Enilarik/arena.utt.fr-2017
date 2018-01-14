import post from '../lib/post'
import token from '../lib/token'

export const kickPlayer = async (user) => {
  const res = await post('/kickFromTeam', { user }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return []
  }

  return {
    type: 'KICK_ERROR',
    payload: body.error
  }
}
