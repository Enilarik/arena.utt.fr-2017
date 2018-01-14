import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import reloadUiAfter from '../../lib/reloadUiAfter'
import teamStatus from '../../lib/teamStatus'

import error from '../../lib/error'

import {
  spotlight,
  spotlightStatus,
  clearSpotlightError,
  unregisterSpotlight
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import StatusBadge from '../../components/StatusBadge'
import Confirm from '../../components/Confirm'
import Modal from '../../components/Modal'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import csgo from '../../assets/csgo.jpg'
import hearthstone from '../../assets/hearthstone.jpg'
import lol from '../../assets/lol.jpg'
import overwatch from '../../assets/overwatch.jpg'

import './Spotlight.css'

const mapStateToProps = (state) => {
  return {
    spotlight: state.spotlight.get('spotlight'),
    spotlightError: state.spotlight.get('error'),
    spotlights: state.spotlight.get('allSpotlights'),
    hasTeam: !!state.user.getIn(['user', 'team']) && !state.user.getIn(['user', 'team', 'soloTeam']),
    teamStatus: teamStatus(state)
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    register(tournament) {
      dispatch(clearSpotlightError())
      dispatch(reloadUiAfter(spotlight(tournament), dispatch))
    },
    unregister(tournament) {
      dispatch(clearSpotlightError())
      dispatch(reloadUiAfter(unregisterSpotlight(), dispatch))
    },
    spotlightStatus() {
      dispatch(spotlightStatus())
    }
  }
}

class Spotlight extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      confirmLeave: null,
      confirmLeaveId: null
    }

    this.register = this.register.bind(this)
    this.cancelLeave = this.cancelLeave.bind(this)
    this.confirmLeave = this.confirmLeave.bind(this)
  }

  componentWillMount() {
    this.props.spotlightStatus()
  }

  register(tournament, confirmUnregister) {
    return () => {
      if (this.props.spotlight === tournament) {
        this.setState({
          confirmLeave: this.props.spotlights.getIn([tournament - 1, 'name']),
          confirmLeaveId: tournament
        })
      } else {
        this.props.register(tournament)
      }
    }
  }

  cancelLeave() {
    this.setState({
      confirmLeave: null,
      confirmLeaveId: null
    })
  }

  confirmLeave() {
    this.props.unregister(this.state.confirmLeaveId)
    this.setState({
      confirmLeave: null,
      confirmLeaveId: null
    })
  }

  render() {
    const imgs = [ hearthstone, lol, csgo, overwatch ].map(img => ({
      backgroundImage: `url(${img})`,
      backgroundPosition: 'center'
    }))

    const classes = [ hearthstone, lol, csgo, overwatch ].map((_, i) => classNames({
      'a-spotlight__tournaments__image': true,
      // selected is i + 1 because first AUTO_INCREMENT in db will be 1
      'a-spotlight__tournaments__image--selected': (i + 1) === this.props.spotlight,
      // only hearthstone is allowed without team
      'a-spotlight__tournaments__image--require-team': (i !== 0) && !this.props.hasTeam,
      'a-spotlight__tournaments__image--full': this.props.spotlights && this.props.spotlights.get(i).get('isFull')
    }))

    // Lol image should be right aligned
    imgs[1].backgroundPosition = 'right'

    return (
      <div className="a-spotlight">
        <Header arrow="/dashboard"></Header>
        {this.state.confirmLeave && (
          <Modal opened={true}>
            <Confirm onCancel={this.cancelLeave} onConfirm={this.confirmLeave}>
              Quitter le tournoi {this.state.confirmLeave} ?
            </Confirm>
          </Modal>
        )}
        <main className="a-dashboard__content">
          <Title size="h2">Tournois</Title>
          <Text className="a-spotlight__intro">
            Inscrivez-vous aux tournois en cliquant sur l'image correspondante pour tenter de remporter les lots. Si vous ne souhaitez pas vous inscrire à un tournoi, pas de soucis, vous pourrez toujours jouer à vos jeux préférés pendant tout l’événement avec la partie « Libre » !
          </Text>
          <StatusBadge theme={this.props.teamStatus.theme}>Statut: {this.props.teamStatus.status}</StatusBadge>
          {this.props.spotlightError && (
            <div className="a--error">{error(this.props.spotlightError)}</div>
          )}
        </main>
        <div className="a-spotlight__tournaments">
          {/* hard-coded tournaments */}
          <div className={ classes[0] } onClick={this.register(1)} style={ imgs[0] }></div>
          <div className={ classes[1] } onClick={this.register(2)} style={ imgs[1] }></div>
          <div className={ classes[2] } onClick={this.register(3)} style={ imgs[2] }></div>
          <div className={ classes[3] } onClick={this.register(4)} style={ imgs[3] }></div>
        </div>
        <div className="a--space"></div>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Spotlight)
