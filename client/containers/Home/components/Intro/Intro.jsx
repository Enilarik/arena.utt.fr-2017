import React from 'react'

import loadImage from '../../../../lib/loadImage'

import Title from '../../../../components/Title'
import LazyImg from '../../../../components/LazyImg'

import './Intro.css'

/* hard-coded tournaments */
import logo from '../../../../assets/ua17_logo.png'
import csgo from '../../../../assets/csgo.jpg'
import hearthstone from '../../../../assets/hearthstone.jpg'
import lol from '../../../../assets/lol.jpg'
import overwatch from '../../../../assets/overwatch.jpg'

import '../../../../assets/ua17_logo.webp'
import '../../../../assets/csgo.webp'
import '../../../../assets/hearthstone.webp'
import '../../../../assets/lol.webp'
import '../../../../assets/overwatch.webp'

const colors = [
  '#221322',
  '#2c2a45',
  '#2c3b4c',
  '#181321'
]

export default class Intro extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      src0: null,
      src1: null,
      src2: null,
      src3: null
    }
  }

  componentDidMount() {
    loadImage(hearthstone).then((src) => this.setState({ src0: src }))
    loadImage(lol).then((src) => this.setState({ src1: src }))
    loadImage(csgo).then((src) => this.setState({ src2: src }))
    loadImage(overwatch).then((src) => this.setState({ src3: src }))
  }

  render() {
    const imgs = [ hearthstone, lol, csgo, overwatch ].map((img, i) => {
      if (this.state[`src${i}`]) {
        return {
          backgroundImage: `url(${this.state[`src${i}`]})`,
          backgroundPosition: 'center'
        }
      } else {
        return {
          backgroundColor: colors[i]
        }
      }
    })

    // Lol image should be right aligned
    imgs[1].backgroundPosition = 'right'

    return (
      <div className="a-intro">
        <div className="a-intro__images">
          <div className="a-intro__images__image" style={ imgs[0] }></div>
          <div className="a-intro__images__image" style={ imgs[1] }></div>
          <div className="a-intro__images__image" style={ imgs[2] }></div>
          <div className="a-intro__images__image" style={ imgs[3] }></div>
        </div>
        <div className="a-intro__logo">
          <LazyImg color="transparent" src={logo} height="200" width="200" alt="UTT ARENA 2017"/>
        </div>
        <div className="a-intro__title">
          <Title theme="white" size="h1">UTT ARENA 2017</Title>
        </div>
      </div>
    )
  }
}
