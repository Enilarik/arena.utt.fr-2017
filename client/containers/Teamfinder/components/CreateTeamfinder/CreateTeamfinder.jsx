import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  createTeamfinder
} from '../../../../actions'

import Input from '../../../../components/Input'
import Title from '../../../../components/Title'
import Button from '../../../../components/Button'

import error from '../../../../lib/error'

import './CreateTeamfinder.css'

const mapActionsToProps = (dispatch) => {
  return {
    createTeamfinder(e) {
      e.preventDefault()
      dispatch(createTeamfinder(this.state.lookingFor))
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
      lookingFor: ''
    }

    this.createTeamfinder = this.props.createTeamfinder.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    return (
      <form className="a-create-teamfinder">
        <Title theme="blue" size="h4">Rechercher</Title>
        <Input
          value={this.state.lookingFor}
          onChange={this.handleInputChange}
          name="lookingFor"
          placeholder="[LoL] Mid Plat II xoxo"
          autofocus={true}></Input>
          {this.props.error && <div className="a--error">
            {error(this.props.error)}
          </div>}
        <Button onClick={this.createTeamfinder}>Créer</Button>
      </form>
    )
  }
}

export default connect(null, mapActionsToProps)(CreateTeam)
