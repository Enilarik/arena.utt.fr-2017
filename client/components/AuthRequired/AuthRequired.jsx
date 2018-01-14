import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { push } from 'react-router-redux'

import auth from '../../lib/auth'

import Loading from '../Loading'

const mapActionsToProps = (dispatch) => {
  return {
    refreshLogin(body) {
      return dispatch({
        type: 'LOGIN_SUCCESS',
        payload: body
      })
    },
    failedLogin() {
      dispatch(push('/'))
    }
  }
}

class AuthRequired extends React.Component {
  state = {
    isLoggedIn: false,
    component: null
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      component: null
    })

    props
      .load()
      .then((cmp) => {
        this.setState({
          component: cmp.default ? cmp.default :  cmp
        })
      })
  }

  componentDidMount() {
    auth()
      .then((body) => {
        this.props.refreshLogin(body)
        this.setState({
          isLoggedIn: true
        })
      })
      .catch(() => {
        this.props.failedLogin()
      })
  }

  render() {
    if (!this.state.isLoggedIn || !this.state.component) {
      return <Loading></Loading>
    }

    return React.createElement(this.state.component)
  }
}

export default connect(null, mapActionsToProps)(AuthRequired)
