import React from 'react'
import { connect } from 'react-redux'
import reloadUiAfter from '../../lib/reloadUiAfter'

import {
  cancelJoinTeam
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import ListItem from '../../components/ListItem'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import './RequestedTeams.css'

const mapStateToProps = (state) => {
  const userId = state.user.getIn(['user', 'id'])

  return {
    userId,
    teams: state.teams.get('teams').filter((team) => {
      return team.get('askingUsers').find(user => user.get('id') === userId)
    })
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    cancelRequest(askingTeam) {
      dispatch(
        reloadUiAfter(cancelJoinTeam(askingTeam.get('id')), dispatch)
      )
    }
  }
}

class RequestedTeams extends React.Component {
  constructor(props) {
    super(props)

    this.renderListItem = this.renderListItem.bind(this)
    this.cancelRequest = this.cancelRequest.bind(this)
  }

  cancelRequest(askingTeam) {
    return () => {
      this.props.cancelRequest(askingTeam, this.props.userId)
    }
  }

  renderListItem(askingTeam, i) {
    const userMessage = askingTeam
      .get('askingUsers')
      .find(user => user.get('id') === this.props.userId)
      .get('askingMessage')

    return (
      <ListItem key={i} clickable={false} withArrow={false}>
        <Text className="a-requested-teams__team">{askingTeam.get('name')}</Text>
        <Text className="a-requested-teams__user-message">{userMessage}</Text>
        <Text>
          <span className="a-requested-teams__link" onClick={this.cancelRequest(askingTeam)}>
            Annuler la demande
          </span>
        </Text>
      </ListItem>
    )
  }

  render() {
    return (
      <div className="a-requestedteams">
        <Header arrow="/dashboard"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">Mes demandes</Title>
          {!this.props.teams.size && <Text>Aucune demande en cours</Text>}
          {this.props.teams.map(this.renderListItem)}
        </main>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(RequestedTeams)
