import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import {
  closeLoginModal,
  showRegisterModal,
  showLoginModal,
  canLogin,
  register,
  login
} from '../../../../actions'

import error from '../../../../lib/error'

import Title from '../../../../components/Title'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import Checkbox from '../../../../components/Checkbox'
import Modal from '../../../../components/Modal'

import './Login.css'

const mapStateToProps = (state) => {
  return {
    modal: state.user.get('modal'),
    canLogin: state.user.get('canLogin'),
    registerError: state.user.get('registerError'),
    loginError: state.user.get('loginError')
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    showLoginModal(e) {
      e && e.preventDefault()
      dispatch(showLoginModal())
    },
    showRegisterModal(e) {
      e && e.preventDefault()
      dispatch(showRegisterModal())
    },
    closeLoginModal(e) {
      e && e.preventDefault()
      dispatch(closeLoginModal())
    },
    seekCanLogin() {
      dispatch(canLogin())
    },
    register(user) {
      dispatch(register(user))
    },
    login(user) {
      dispatch(login(user))
    }
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.showLoginModal = this.props.showLoginModal.bind(this)
    this.closeLoginModal = this.props.closeLoginModal.bind(this)
    this.showRegisterModal = this.props.showRegisterModal.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = {
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: '',
      registerPasswordConfirmation: '',
      registerMail: '',
      error: null
    }
  }

  componentWillMount() {
    this.props.seekCanLogin()
  }

  login(e) {
    e.preventDefault()

    this.props.login({
      username: this.state.loginUsername,
      password: this.state.loginPassword
    })
  }

  register(e) {
    e.preventDefault()

    if (this.state.registerPassword !== this.state.registerPasswordConfirmation) {
      this.setState({
        error: 'PASSWORD_MISMATCH'
      })
      return
    }

    if (this.state.registerPassword.length < 6) {
      this.setState({
        error: 'PASSWORD_TOO_SHORT'
      })
      return
    }

    const user = {
      name: this.state.registerUsername,
      password: this.state.registerPassword,
      email: this.state.registerMail
    }

    this.setState({
      loginUsername: this.state.registerUsername
    })

    this.props.register(user)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    let el = null
    let err = this.props.registerError || this.state.error

    let loginModal = this.props.modal === 'login' && (
      <div className="a-login">
        <form className="a-login-form">
          <Title theme="blue">Connexion</Title>
          <Input
            value={this.state.loginUsername}
            onChange={this.handleInputChange}
            placeholder="Pseudo"
            name="loginUsername"
            autofocus></Input>
          <Input
            value={this.state.loginPassword}
            onChange={this.handleInputChange}
            type="password"
            name="loginPassword"
            placeholder="Mot de passe"></Input>
          {this.props.loginError && <div className="a--error">
            {error(this.props.loginError)}
          </div>}
          <div className="a-login-form__footer">
            <a href="#" className="a--blue" onClick={this.showRegisterModal}>
              Inscription
            </a>
            <div className="a--space"></div>
            <Button theme="blue" onClick={this.login}>Connexion</Button>
          </div>
        </form>
      </div>
    )

    let registerModal = this.props.modal === 'register' && this.props.canLogin && (
      <div className="a-register">
        <form className="a-register-form">
          <Title theme="blue">Inscription</Title>
          <Input
            value={this.state.registerUsername}
            onChange={this.handleInputChange}
            placeholder="Pseudo"
            name="registerUsername"
            autofocus></Input>
          <Input
            value={this.state.registerPassword}
            onChange={this.handleInputChange}
            type="password"
            name="registerPassword"
            placeholder="Mot de passe"></Input>
          <Input
            value={this.state.registerPasswordConfirmation}
            onChange={this.handleInputChange}
            type="password"
            name="registerPasswordConfirmation"
            placeholder="Confirmation"></Input>
          <Input
            value={this.state.registerMail}
            onChange={this.handleInputChange}
            type="mail"
            name="registerMail"
            placeholder="E-Mail"></Input>
          <div className="a-register-form__agree">
            En cliquant sur Inscription, vous acceptez nos conditions générales, les règles des tournois et indiquez avoir 16 ans ou plus.
          </div>
          {err && <div className="a--error">
            {error(err)}
          </div>}
          <div className="a-register-form__footer">
            <a href="#" className="a--blue" onClick={this.showLoginModal}>
              Connexion
            </a>
            <div className="a--space"></div>
            <Button theme="blue" onClick={this.register}>Inscription</Button>
          </div>
        </form>
      </div>
    )

    let registerDisabledModal = this.props.modal === 'register' && !this.props.canLogin && (
      <div className="a-register">
        <div className="a-register-form">
          <Title theme="blue">Inscription désactivée</Title>
          <p style={{ textAlign: 'center' }}>
            L'inscription est désactivée pour le moment.
          </p>
        </div>
      </div>
    )

    return (
      <div>
        <Modal opened={this.props.modal !== 'none'} onHide={this.closeLoginModal}>
          {loginModal}
          {registerModal}
          {registerDisabledModal}
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Login)
