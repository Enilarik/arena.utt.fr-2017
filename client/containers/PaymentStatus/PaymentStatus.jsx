import React from 'react'
import { Link } from 'react-router-dom'

import Title from '../../components/Title'
import Text from '../../components/Text'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

import './PaymentStatus.css'

class PaymentStatus extends React.Component {
  render() {
    let el

    if (location.pathname.startsWith('/dashboard/payment/success')) {
      el = (
        <main className="a-dashboard__content">
          <Title>Paiement effectué avec succès !</Title>
          <Text>
            Le paiement a abouti. Vous recevrez d'ici quelques minutes un e-mail contenant votre place. Contactez <a href="mailto:arena@utt.fr">arena@utt.fr</a> pour tout soucis concernant le paiement.
          </Text>
          <br/>
          <Link to="/dashboard">Retour au dashboard</Link>
        </main>
      )
    } else {
      el = (
        <main className="a-dashboard__content">
          <Title>Paiement refusé</Title>
          <Text>
            Le paiement n'a pas abouti. Vous n'avez pas été débité. Si cela n'est pas le comportement voulu, veuillez contacter <a href="mailto:arena@utt.fr">arena@utt.fr</a>.
          </Text>
          <br/>
          <Link to="/dashboard">Retour au dashboard</Link>
        </main>
      )
    }

    return (
      <div className="a-payment-status">
        <Header arrow="/dashboard"></Header>
        {el}
        <div className="a--space"></div>
        <Footer showCopy={false}></Footer>
      </div>
    )
  }
}

export default PaymentStatus
