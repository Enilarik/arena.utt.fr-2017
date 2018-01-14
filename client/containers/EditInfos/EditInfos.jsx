import React from 'react'
import { connect } from 'react-redux'
import reloadUiAfter from '../../lib/reloadUiAfter'

import error from '../../lib/error'

import {
  editUserInfos,
  clearUserInfosSuccess,
  clearUserInfosError
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import './EditInfos.css'

const mapStateToProps = (state) => {
  return {
    user: state.user.get('user'),
    success: state.userEdit.get('success'),
    error: state.userEdit.get('error')
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    editUserInfos(newUser) {
      dispatch(clearUserInfosSuccess())
      dispatch(editUserInfos(newUser)).then(() => {
        // trick : we don't want reloadUiAfter to mute EDIT_USER_SUCCESS
        return reloadUiAfter(Promise.resolve([]), dispatch)
      })
    }
  }
}

class EditInfos extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: this.props.user.get('name'),
      password: '',
      passwordConfirmation: '',
      email: this.props.user.get('email'),
      error: null
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.editUserInfos = this.editUserInfos.bind(this)
  }

  editUserInfos(e) {
    e.preventDefault()

    const newUser = {
      id: this.props.user.get('id'),
      name: this.state.username,
      email: this.state.email
    }

    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({
        error: 'PASSWORD_MISMATCH'
      })

      return
    }

    if (this.state.password !== '' && this.state.passwordConfirmation !== '') {
      newUser.password = this.state.password
    }

    this.props.editUserInfos(newUser)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    const err = this.props.error || this.state.error

    return (
      <div className="a-editinfos">
        <Header arrow="/dashboard"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">{this.props.user.get('name')}</Title>
          <Text>
            Changez ici vos informations personnelles. Vous recevrez votre place par e-mail. Si vous êtes membres d'une école partenaire, pensez à mettre votre e-mail associée pour profiter des tarifs préférentiels.<br/>
            Si vous ne souhaitez pas changer votre mot de passe, laissez les champs vides.
          </Text>
          <div className="a-editinfos__form-container">
            <form className="a-editinfos__form">
              <label>
                <div className="a-editinfos__form__label">Pseudo :</div>
                <Input
                  onChange={this.handleInputChange}
                  value={this.state.username}
                  autofocus
                  name="username"/>
              </label>
              <label>
                <div className="a-editinfos__form__label">Mot de passe :</div>
                <Input
                  onChange={this.handleInputChange}
                  value={this.state.password}
                  type="password"
                  name="password"/>
              </label>
              <label>
                <div className="a-editinfos__form__label">Confirmation :</div>
                <Input
                  onChange={this.handleInputChange}
                  value={this.state.passwordConfirmation}
                  type="password"
                  name="passwordConfirmation"/>
              </label>
              <label>
                <div className="a-editinfos__form__label">E-mail :</div>
                <Input
                  onChange={this.handleInputChange}
                  value={this.state.email}
                  name="email"/>
              </label>
              {err && <div className="a--error">
                {error(err)}
              </div>}
              <Button theme="blue" onClick={this.editUserInfos}>Valider</Button>
              {this.props.success && <div className="a--success">Informations enregistrées</div>}
            </form>
          </div>
        </main>
        <div className="a--space"></div>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(EditInfos)
