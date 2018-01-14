import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import reloadUiAfter from '../../../../lib/reloadUiAfter'

import {
  joinTeam
} from '../../../../actions'

import Select from '../../../../components/Select'
import Title from '../../../../components/Title'
import Button from '../../../../components/Button'

import error from '../../../../lib/error'

import './JoinTeam.css'

const mapStateToProps = (state) => {
  return {
    teams: state.teams
      .get('teams')
      .filter(team => !team.get('soloTeam'))
      .map(team => ({ value: team.get('id').toString(), label: team.get('name') }))
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    joinTeam(e) {
      e.preventDefault()
      dispatch(
        reloadUiAfter(joinTeam(this.state.team), dispatch)
      ).then(() => dispatch(push('/dashboard/requests')))
    }
  }
}

class JoinTeam extends React.Component {
  static propTypes = {
    error: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      team: ''
    }

    this.joinTeam = this.props.joinTeam.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    return (
      <form className="a-join-team">
        <Title theme="blue" size="h4">Rejoindre une équipe</Title>
        <Select
          onChange={this.handleInputChange}
          options={this.props.teams}
          name="team"></Select>
          {this.props.error && <div className="a--error">
            {error(this.props.error)}
          </div>}
        <Button onClick={this.joinTeam}>Rejoindre</Button>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(JoinTeam)
