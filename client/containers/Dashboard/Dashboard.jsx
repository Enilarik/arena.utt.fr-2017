import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import {
  logout
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import ListItem from '../../components/ListItem'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Modal from '../../components/Modal'
import CreateTeam from './components/CreateTeam'
import JoinTeam from './components/JoinTeam'

import './Dashboard.css'

const mapStateToProps = (state) => {
  return {
    team: state.user.get('user').get('team'),
    createTeamSuccess: state.createTeam.get('success'),
    createTeamError: state.createTeam.get('error'),
    joinTeamSuccess: state.joinTeam.get('success'),
    joinTeamError: state.joinTeam.get('error')
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    logout() {
      dispatch(logout())
    },
    openTeamfinder() {
      dispatch(push('/dashboard/teamfinder'))
    },
    openTeamManagement() {
      dispatch(push('/dashboard/team'))
    },
    openRequestedTeams() {
      dispatch(push('/dashboard/requests'))
    },
    openSpotlight() {
      dispatch(push('/dashboard/tournaments'))
    },
    openUserInfos() {
      dispatch(push('/dashboard/user'))
    },
    openPayment() {
      dispatch(push('/dashboard/payment'))
    }
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      createTeamModal: false,
      joinTeamModal: false
    }

    this.logout = this.props.logout.bind(this)
    this.openCreateTeamModal = this.openCreateTeamModal.bind(this)
    this.openJoinTeamModal = this.openJoinTeamModal.bind(this)
    this.clearModalState = this.clearModalState.bind(this)
    this.openTeamfinder = this.props.openTeamfinder.bind(this)
    this.openTeamManagement = this.props.openTeamManagement.bind(this)
    this.openRequestedTeams = this.props.openRequestedTeams.bind(this)
    this.openSpotlight = this.props.openSpotlight.bind(this)
    this.openUserInfos = this.props.openUserInfos.bind(this)
    this.openPayment = this.props.openPayment.bind(this)
  }

  openCreateTeamModal() {
    this.setState({
      createTeamModal: true
    })
  }

  openJoinTeamModal() {
    this.setState({
      joinTeamModal: true
    })
  }

  clearModalState() {
    this.setState({
      createTeamModal: false,
      joinTeamModal: false
    })
  }

  render() {
    return (
      <div className="a-dashboard">
        <Header arrow="/"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">Dashboard</Title>
          <Title theme="white">Équipe</Title>
          <Modal opened={this.state.createTeamModal && !this.props.createTeamSuccess} onHide={this.clearModalState}>
            <CreateTeam error={this.props.createTeamError}></CreateTeam>
          </Modal>
          <Modal opened={this.state.joinTeamModal && !this.props.joinTeamSuccess} onHide={this.clearModalState}>
            <JoinTeam error={this.props.joinTeamError}></JoinTeam>
          </Modal>
          {!this.props.team && (
            <ListItem onClick={this.openCreateTeamModal}>
              <Title>Créer une équipe</Title>
              <Text>
                Crée ton équipe et invite tes amis à te rejoindre pour participez aux tournois !
              </Text>
            </ListItem>
          )}
          {!this.props.team && (
            <ListItem onClick={this.openJoinTeamModal}>
              <Title>Rejoindre une équipe</Title>
              <Text>
                Rejoins ton équipe de compétiteurs pour vous inscrire aux tournois !
              </Text>
            </ListItem>
          )}
          {this.props.team && (
            <ListItem onClick={this.openTeamManagement}>
              <Title>Mon équipe</Title>
              <Text>
                Gère ton équipe, ses membres et vérifie son status d'inscription !
              </Text>
            </ListItem>
          )}
          <ListItem onClick={this.openTeamfinder}>
            <Title>Teamfinder</Title>
            <Text>
              Tu n'as pas d'équipe ? Il vous manque un coéquipier ? Le teamfinder est fait pour vous !
            </Text>
          </ListItem>
          {!this.props.team && (
            <ListItem onClick={this.openRequestedTeams}>
              <Title>Mes demandes</Title>
              <Text>
                La liste des demandes d'équipe que tu as faite
              </Text>
            </ListItem>
          )}
          <Title theme="white">Tournoi</Title>
          <ListItem onClick={this.openSpotlight}>
            <Title>Rejoindre un tournoi</Title>
            <Text>
              Inscription dans l'un des tournois de l'UTT Arena
            </Text>
          </ListItem>
          <Title theme="white">Mon compte</Title>
          <ListItem onClick={this.openPayment}>
            <Title>Payer ma place</Title>
            <Text>
              Paye ta place et récupère ton billet d'entrée ! Obligatoire pour les tournois
            </Text>
          </ListItem>
          <ListItem onClick={this.openUserInfos}>
            <Title>Éditer mes infos</Title>
            <Text>
              Accède à ton profil et modifie tes informations si besoin
            </Text>
          </ListItem>
          <ListItem onClick={this.logout}>
            <Title>Déconnexion</Title>
          </ListItem>
        </main>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Dashboard)
