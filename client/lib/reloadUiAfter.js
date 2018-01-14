import {
  checkLoginStartup
} from '../actions'

export default (promise, dispatch) => {
  return promise
    .then((res) => {
      if (res.length === 0 || (res.length === 1 && res[0].type.endsWith('SUCCESS'))) {
        // No error, reload everything (avoid location.reload, avoid hard maths)
        dispatch(checkLoginStartup())
        return []
      }

      // error return error action
      return res
    })
}
