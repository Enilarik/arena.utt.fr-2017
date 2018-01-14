import post from '../lib/post'
import token from '../lib/token'

export const spotlight = async (tournament) => {
  const res = await post('/joinTournament', { tournament }, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'SPOTLIGHT_SUCCESS',
        payload: tournament
      }
    ]
  }

  return {
    type: 'SPOTLIGHT_ERROR',
    payload: body.error
  }
}

export const unregisterSpotlight = async () => {
  const res = await post('/leaveTournament', {}, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'SPOTLIGHT_SUCCESS',
        payload: null
      }
    ]
  }

  return {
    type: 'SPOTLIGHT_ERROR',
    payload: body.error
  }
}

export const spotlightStatus = async () => {
  const res = await fetch('/spotlightStatus')
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'SPOTLIGHT_STATUS_SUCCESS',
        payload: body
      }
    ]
  }

  return {
    type: 'SPOTLIGHT_STATUS_ERROR',
    payload: body.error
  }
}

export const clearSpotlightError = () => {
  return {
    type: 'CLEAR_SPOTLIGHT_ERROR'
  }
}
