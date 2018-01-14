import React from 'react'

import LazyImg from '../../../../components/LazyImg'
import Text from '../../../../components/Text'

import './Contact.css'

import facebook from '../../../../assets/facebook.png'
import twitter from '../../../../assets/twitter.png'
import discord from '../../../../assets/discord.png'
import youtube from '../../../../assets/youtube.png'
import '../../../../assets/facebook.webp'
import '../../../../assets/twitter.webp'
import '../../../../assets/discord.webp'
import '../../../../assets/youtube.webp'

export default class Contact extends React.Component {
  render() {
    return (
      <div className="a-contact">
        <Text>
          Retrouvez-nous sur les différents réseaux sociaux nous contacter et pour partager l’événement !
        </Text>
        <div className="a-contact__icons">
          <a target="_blank" rel="noopener" href="https://facebook.com/UTTArena">
            <LazyImg color="#49659F" src={ facebook } height="120" width="120" alt="UTT Arena Facebook"/>
          </a>
          <a target="_blank" rel="noopener" href="https://twitter.com/UTTArena">
            <LazyImg color="#3498DB" src={ twitter } height="120" width="120" alt="UTT Arena Twitter"/>
          </a>
          <a target="_blank" rel="noopener" href="https://www.youtube.com/user/UTTNetGroup">
            <LazyImg color="#EA3517" src={ youtube } height="120" width="120" alt="UTT Arena Twitter"/>
          </a>
          <a target="_blank" rel="noopener" href="https://discordapp.com/invite/Ad4Tcwv">
            <LazyImg color="#FFF" src={ discord } height="118" width="120" alt="UTT Arena Discord"/>
          </a>
        </div>
        <Text>
          Vous pouvez aussi nous envoyer un mail à <a href="mailto:arena@utt.fr"><mark><strong>arena@utt.fr</strong></mark></a> ou nous appeler au <a href="tel:+33325718550">+33 3 25 71 85 50</a>
        </Text>
      </div>
    )
  }
}
