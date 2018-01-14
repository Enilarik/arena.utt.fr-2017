import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import error from '../../lib/error'

import {
  payment
} from '../../actions'

import Title from '../../components/Title'
import Text from '../../components/Text'
import ListItem from '../../components/ListItem'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import './Payment.css'

/* hard-coded prices */
const prices = {
  plusone: 6,
  partner: 10,
  base: 15,
  ethernet: 7,
  shirt: 11
}

/* hard-coded partner emails */
const isPartner = (str) => {
  return str.endsWith('@utt.fr') ||
    str.endsWith('@utc.fr') ||
    str.endsWith('@utbm.fr')
}

const shirtGenders = [
  { label: 'Homme', value: 'M' },
  { label: 'Femme', value: 'F' }
]

const shirtSizes = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' }
]

const mapStateToProps = (state) => {
  return {
    hasPaid: state.user.getIn(['user', 'paid']),
    isPartner: isPartner(state.user.getIn(['user', 'email']))
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    payment(body) {
      return dispatch(payment(body))
    }
  }
}

class Payment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      plusone: false,
      ethernet: false,
      shirt: false,
      shirtGender: 'M',
      shirtSize: 'M',
      firstname: '',
      lastname: ''
    }

    this.switchToPlayer = this.switchToPlayer.bind(this)
    this.switchToPlusone = this.switchToPlusone.bind(this)
    this.toggleEthernet = this.toggleEthernet.bind(this)
    this.toggleShirt = this.toggleShirt.bind(this)
    this.calcSum = this.calcSum.bind(this)
    this.payment = this.payment.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  payment(e) {
    e.preventDefault()

    const basket = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      plusone: this.state.plusone,
      ethernet: this.state.ethernet
    }

    if (this.state.shirt) {
      basket.shirtGender = this.state.shirtGender
      basket.shirtSize = this.state.shirtSize
    }


    if (this.state.firstname.length < 2 || this.state.lastname.length < 2) {
      alert('Vous devez remplir votre prénom ainsi que votre nom')
      return
    }

    this.props.payment(basket)
  }

  calcSum() {
    const ticket = this.props.isPartner ? prices.partner : prices.base

    let sum = this.state.plusone ? prices.plusone : ticket

    if (this.state.shirt) {
      sum += prices.shirt
    }

    if (this.state.ethernet) {
      sum += prices.ethernet
    }

    return sum
  }

  switchToPlayer() {
    this.setState({
      plusone: false
    })
  }

  switchToPlusone() {
    this.setState({
      plusone: true
    })
  }

  toggleEthernet() {
    this.setState({
      ethernet: !this.state.ethernet
    })
  }

  toggleShirt() {
    this.setState({
      shirt: !this.state.shirt
    })
  }

  handleInputChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  render() {
    const playerClass = !this.state.plusone ? 'a-payment__item--selected' : ''
    const plusoneClass = this.state.plusone ? 'a-payment__item--selected' : ''
    const ethernetClass = this.state.ethernet ? 'a-payment__item--selected' : ''
    const shirtClass = this.state.shirt ? 'a-payment__item--selected' : ''

    const playerPrice = this.props.isPartner ? prices.partner : prices.base

    return (
      <div className="a-payment">
        <Header arrow="/dashboard"></Header>
        <main className="a-dashboard__content">
          <Title size="h2">Paiement</Title>
          <Text className="a-payment__intro">
            Toutes les places vous donne accès à l’ensemble du Festival des Jeux et de la LAN, et permet de rester à l'UTT Arena et ce même en dehors des horaires d'ouverture du Festival. Vous êtes d'une école partenaire et le prix n'est pas réduit ? Vérifiez votre e-mail dans <Link to="/dashboard/user">vos infos</Link>.
            <br/>
            <br/>
            Le paiement se déroule sur un site sécurisé
          </Text>
          {!this.props.hasPaid && (
            <form>
              <ListItem price={playerPrice} withArrow={false} className={playerClass} onClick={this.switchToPlayer}>
                <Title theme="white" size="h4">Place joueur</Title>
                <Text>Place joueur (tournoi ou hors tournoi)</Text>
              </ListItem>
              <ListItem price={prices.plusone} withArrow={false} className={plusoneClass} onClick={this.switchToPlusone}>
                <Title theme="white" size="h4">Place visiteur</Title>
                <Text>Réservé aux accompagnateurs•rices non-joueurs</Text>
              </ListItem>
              <div className="a-payment__separator"></div>
              <ListItem price={prices.ethernet} withArrow={false} className={ethernetClass} onClick={this.toggleEthernet}>
                <Title theme="white" size="h4">Câble ethernet</Title>
                <Text>Un câble (<strong>5m</strong>) est requis pour se brancher au switchs de tables</Text>
              </ListItem>
              <ListItem price={prices.shirt} withArrow={false} className={shirtClass} onClick={this.toggleShirt}>
                <Title theme="white" size="h4">T-Shirt UA 2017</Title>
                <Text>Un t-shirt souvenir de cette LAN de folie</Text>
                <Select
                  onChange={this.handleInputChange}
                  value={this.state.shirtGender}
                  options={shirtGenders}
                  name="shirtGender"></Select>
                <Select
                  onChange={this.handleInputChange}
                  value={this.state.shirtSize}
                  options={shirtSizes}
                  name="shirtSize"></Select>
              </ListItem>

              <div className="a-payment__separator"></div>

              <div className="a-payment__name">
                <label>
                  <div className="a-payment__firstname">Prénom :</div>
                  <Input
                    onChange={this.handleInputChange}
                    value={this.state.firstname}
                    required={true}
                    pattern=".{2,}"
                    name="firstname"/>
                </label>
                <label>
                  <div className="a-payment__lastname">Nom :</div>
                  <Input
                    onChange={this.handleInputChange}
                    value={this.state.lastname}
                    required={true}
                    pattern=".{2,}"
                    name="lastname"/>
                </label>
              </div>

              <Button theme="success" onClick={this.payment}>Payer {this.calcSum()}€</Button>
            </form>
          )}
          {this.props.hasPaid && (
            <div className="a-payment__already-paid">
              <Text>Vous avez déjà payé votre place</Text>
              <Link to="/dashboard">Retour au dashboard</Link>
            </div>
          )}
        </main>
        <div className="a--space"></div>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Payment)
