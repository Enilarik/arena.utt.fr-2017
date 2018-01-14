import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import reloadUiAfter from '../../../../lib/reloadUiAfter'

import {
  createTeam
} from '../../../../actions'

import Input from '../../../../components/Input'
import Title from '../../../../components/Title'
import Button from '../../../../components/Button'

import error from '../../../../lib/error'

import './CreateTeam.css'

const mapActionsToProps = (dispatch) => {
  return {
    createTeam(e) {
      e.preventDefault()
      dispatch(createTeam(this.state.teamName))
        .then(() => reloadUiAfter(Promise.resolve([]), dispatch))
    }
  }
}

class CreateTeam extends React.Component {
  static propTypes = {
    error: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      teamName: ''
    }

    this.createTeam = this.props.createTeam.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    return (
      <form className="a-create-team">
        <Title theme="blue" size="h4">Créer une équipe</Title>
        <Input
          value={this.state.teamName}
          onChange={this.handleInputChange}
          name="teamName"
          placeholder="Nom de l'équipe"
          autofocus={true}></Input>
          {this.props.error && <div className="a--error">
            {error(this.props.error)}
          </div>}
        <Button onClick={this.createTeam}>Créer</Button>
      </form>
    )
  }
}

export default connect(null, mapActionsToProps)(CreateTeam)
