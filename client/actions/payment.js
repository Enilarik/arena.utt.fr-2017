import post from '../lib/post'
import token from '../lib/token'
import { push } from 'react-router-redux'

export const payment = async (basket) => {
  const res = await post('/payment', basket, token())
  const body = await res.json()

  if (res.status === 200 && !body.error) {
    location.href = body.url

    return []
  }

  return {
    type: 'PAYMENT_ERROR',
    payload: body.error
  }
}
