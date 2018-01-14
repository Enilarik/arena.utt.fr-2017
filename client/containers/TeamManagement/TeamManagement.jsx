import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import reloadUiAfter from '../../lib/reloadUiAfter'
import teamStatus from '../../lib/teamStatus'

import {
  allowPlayer,
  refusePlayer,
  kickPlayer,
  checkLoginStartup
} from '../../actions'

import Title from '../../components/Title'
import StatusBadge from '../../components/StatusBadge'
import ListItem from '../../components/ListItem'
import Text from '../../components/Text'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import TeamTable from './components/TeamTable'

import './TeamManagement.css'

const mapStateToProps = (state) => {
  return {
    team: state.user.getIn(['user', 'team']),
    spotlight: state.user.getIn(['user', 'team', 'spotlight']),
    teamStatus: teamStatus(state),
    askingPlayers: state.teams
      .get('teams')
      .find(team => team.get('id') === state.user.getIn(['user', 'team', 'id']))
      .get('askingUsers'),
    isCaptain: state.user.getIn(['user', 'team', 'captainId']) === state.user.getIn(['user', 'id']),
    selfId: state.user.getIn(['user', 'id']),
    kickPlayers: state.user
      .getIn(['user', 'team', 'users'])
      .filter((user) => user.get('id') !== state.user.getIn(['user', 'id']))
      .map((user) => ({ label: user.get('name'), value: user.get('id') }))
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    allowPlayer(player) {
      dispatch(
        reloadUiAfter(allowPlayer(player), dispatch)
      )
    },
    refusePlayer(player) {
      dispatch(
        reloadUiAfter(refusePlayer(player), dispatch)
      )
    },
    kickPlayer(player) {
      // return to get promise
      return dispatch(
        reloadUiAfter(kickPlayer(player), dispatch)
      )
    },
    backToDashboard() {
      dispatch(push('/dashboard'))
    }
  }
}

class TeamManagement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      kick: ''
    }

    this.renderAskingPlayer = this.renderAskingPlayer.bind(this)
    this.allowPlayer = this.allowPlayer.bind(this)
    this.refusePlayer = this.refusePlayer.bind(this)
    this.kickPlayer = this.kickPlayer.bind(this)
    this.selfKick = this.selfKick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  allowPlayer(player) {
    return () => {
      this.props.allowPlayer(player.get('id'))
    }
  }

  refusePlayer(player) {
    return () => {
      this.props.refusePlayer(player.get('id'))
    }
  }

  kickPlayer() {
    this.props.kickPlayer(this.state.kick)
  }

  selfKick() {
    this.props.kickPlayer(this.props.selfId)
      .then(() => this.props.backToDashboard())
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  renderAskingPlayer(player, i) {
    return (
      <ListItem key={i} withArrow={false} clickable={false}>
        <Text className="a-teammanagement__asking-name">{player.get('name')}</Text>
        <Text className="a-teammanagement__asking-message">{player.get('askingMessage')}</Text>
        {this.props.isCaptain && (
          <Text className="a-teammanagement__asking-link">
            <span onClick={this.allowPlayer(player)}>Accepter</span>
            <span onClick={this.refusePlayer(player)}>Refuser</span>
          </Text>
        )}
      </ListItem>
    )
  }

  render() {
    return (
      <div className="a-teammanagement">
        <Header arrow="/dashboard"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">{this.props.team.get('name')}</Title>
          {this.props.team.get('soloTeam') && <Text className="a-teammanagement__solo">Équipe mono-joueur</Text>}
          <StatusBadge theme={this.props.teamStatus.theme}>Status: {this.props.teamStatus.status}</StatusBadge>
          <Text className="a-teammanagement__warning">
            <span className="a-teammanagement__warning__sign">&#9888; Attention</span>
            <strong>Tous les membres de l'équipe</strong> doivent avoir payé leur place pour valider l'inscription au spotlight (5 personnes ayant payé leur place pour s'inscrire au tournoi LoL, etc.).
          </Text>
          <TeamTable
            players={this.props.team.get('users')}
            spotlight={this.props.spotlight}></TeamTable>
          <Title size="h3">Demandes</Title>
          {!this.props.askingPlayers.size && <Text className="a-text--center-aligned">Aucune demande en cours</Text>}
          {this.props.askingPlayers.map(this.renderAskingPlayer)}

          {/* Kick */}
          {this.props.isCaptain && <Title>Kick</Title>}
          {this.props.isCaptain && this.props.kickPlayers.size > 0 && (
            <div className="a-teammanagement__kick">
              <Select
                onChange={this.handleInputChange}
                options={this.props.kickPlayers}
                name="kick"
              ></Select>
              <Button theme="error" onClick={this.kickPlayer}>Kick !</Button>
            </div>
          )}
          {this.props.isCaptain && this.props.kickPlayers.size === 0 && (
            <div className="a-teammanagement__kick">
              Personne à kick :&lt;
            </div>
          )}

          {/* Leave */}
          {!this.props.isCaptain && <Title>Kick</Title>}
          {!this.props.isCaptain && (
            <div className="a-teammanagement__kick">
              <Button onClick={this.selfKick} theme="error">Quitter l'équipe</Button>
            </div>
          )}
        </main>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(TeamManagement)
