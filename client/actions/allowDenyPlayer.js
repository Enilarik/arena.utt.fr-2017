import post from '../lib/post'
import token from '../lib/token'

export const allowPlayer = async (user) => {
  const res = await post('/acceptOrDeny', { user, verdict: 'accept' }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return []
  }

  return {
    type: 'ALLOW_PLAYER_ERROR',
    payload: body.error
  }
}

export const refusePlayer = async (user) => {
  const res = await post('/acceptOrDeny', { user, verdict: 'refuse' }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return []
  }

  return {
    type: 'REFUSE_PLAYER_ERROR',
    payload: body.error
  }
}
