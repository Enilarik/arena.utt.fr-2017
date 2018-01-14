import post from '../lib/post'
import token from '../lib/token'

export const editUserInfos = async (newInfos) => {
  const res = await post('/editUser', newInfos, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    return [
      {
        type: 'EDIT_USER_SUCCESS',
        payload: body
      }
    ]
  }

  return {
    type: 'EDIT_USER_ERROR',
    payload: body.error
  }
}

export const clearUserInfosSuccess = () => {
  return {
    type: 'CLEAR_USER_SUCCESS'
  }
}

export const clearUserInfosError = () => {
  return {
    type: 'EDIT_USER_ERROR',
    payload: null
  }
}
