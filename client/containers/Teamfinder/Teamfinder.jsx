import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import reloadUiAfter from '../../lib/reloadUiAfter'

import {
  joinTeam
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import Button from '../../components/Button'
import ListItem from '../../components/ListItem'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import Confirm from '../../components/Confirm'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import CreateTeamfinder from './components/CreateTeamfinder'

import error from '../../lib/error'

import './Teamfinder.css'

const mapStateToProps = (state) => {
  return {
    team: state.user.getIn(['user', 'team']),
    isCaptain: state.user.getIn(['user', 'team', 'captainId']) === state.user.getIn(['user', 'id']),
    entries: state.teamfinders.get('teamfinders'),
    createTeamfinderSuccess: state.createTeamfinder.get('success'),
    createTeamfinderError: state.createTeamfinder.get('error'),
    joinTeamSuccess: state.joinTeam.get('success'),
    joinTeamError: state.joinTeam.get('error')
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    joinTeam(teamId, msg) {
      dispatch(
        reloadUiAfter(joinTeam(teamId, msg), dispatch)
      )
      .then(() => dispatch(push('/dashboard/requests')))
    }
  }
}

class Teamfinder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      createTeamfinderModal: false,
      joinTeamfinderModal: false,
      teamToJoin: null,
      teamToJoinName: '',
      joinTeamFinderMessage: ''
    }

    this.renderListItem = this.renderListItem.bind(this)
    this.joinTeam = this.joinTeam.bind(this)
    this.openCreateTeamfinderModal = this.openCreateTeamfinderModal.bind(this)
    this.clearModalState = this.clearModalState.bind(this)
    this.openJoinTeamfinderModal = this.openJoinTeamfinderModal.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  joinTeam(e) {
    e && e.preventDefault()
    this.props.joinTeam(this.state.teamToJoin, this.state.joinTeamFinderMessage)
  }

  openCreateTeamfinderModal() {
    this.setState({
      createTeamfinderModal: true
    })
  }

  openJoinTeamfinderModal(entry) {
    return () => {
      this.setState({
        joinTeamfinderModal: true,
        teamToJoin: entry.getIn(['team', 'id']),
        teamToJoinName: entry.getIn(['team', 'name'])
      })
    }
  }

  clearModalState() {
    this.setState({
      createTeamfinderModal: false,
      joinTeamfinderModal: false,
      teamToJoin: null,
      teamToJoinName: null,
      joinTeamFinderMessage: ''
    })
  }

  renderListItem(entry, i) {
    const teamLess = !this.props.team

    const clickEvent = teamLess ? this.openJoinTeamfinderModal(entry) : null

    return (
      <ListItem key={i} clickable={teamLess} withArrow={teamLess} onClick={clickEvent}>
        <Title theme="blue">{entry.get('team').get('name')}</Title>
        <Text>{entry.get('lookingFor')}</Text>
      </ListItem>
    )
  }

  render() {
    const teamLess = !this.props.team
    const isCaptain = this.props.isCaptain

    return (
      <div className="a-teamfinder">
        <Header arrow="/dashboard"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">Teamfinder</Title>
          <Modal
            opened={this.state.createTeamfinderModal && !this.props.createTeamfinderSuccess}
            onHide={this.clearModalState}>
            <CreateTeamfinder error={this.props.createTeamfinderError}></CreateTeamfinder>
          </Modal>
          <Modal
            opened={this.state.joinTeamfinderModal && !this.props.joinTeamSuccess}
            onHide={this.clearModalState}>
            <Confirm onConfirm={this.joinTeam} onCancel={this.clearModalState}>
              <Title theme="white">Rejoindre l'équipe {this.state.teamToJoinName} ?</Title>
              <Input
                value={this.state.joinTeamFinderMessage}
                onChange={this.handleInputChange}
                name="joinTeamFinderMessage"
                placeholder="je sui tré bon mid"
                disableReturn={true}
                autofocus={true}></Input>
              {this.props.joinTeamError && <div className="a--error">
                {error(this.props.joinTeamError)}
              </div>}
            </Confirm>
          </Modal>
          <div className="a-teamfinder__list">
            {!teamLess && isCaptain && (
              <div className="a-teamfinder__button-container">
                <Button onClick={this.openCreateTeamfinderModal} theme="success">Rechercher un joueur</Button>
              </div>
            )}
            {this.props.entries.size === 0 && (
              <Text>Aucune recherche pour le moment</Text>
            )}
            {this.props.entries.map(this.renderListItem)}
          </div>
        </main>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Teamfinder)
