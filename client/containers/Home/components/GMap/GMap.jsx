import React from 'react'

import inViewport from '../../../../lib/inViewport'

import Title from '../../../../components/Title'

import './GMap.css'

export default class GMap extends React.Component {
  state = {
    inView: false
  }

  componentDidMount() {
    this.check()
  }

  check() {
    if (inViewport(this.$el)) {
      this.setState({
        inView: true
      })

      return
    }

    this.timeout = setTimeout(() => this.check(), 100)
  }

  componentDidUnmout() {
    clearTimeout(this.timeout || 0)
  }

  render() {
    const styles = { border: 0 }

    return (
      <div className="a-gmap" ref={el => this.$el = el}>
        {this.state.inView &&
          <iframe id="map" width="100%" height="300" frameBorder="0" style={ styles } src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.671860359811!2d4.069313815101264!3d48.289928448517365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ee985568e4c74b%3A0x5a667248e9ced9f0!2sUTT+Arena!5e0!3m2!1sfr!2sfr!4v1481029759123" allowFullScreen></iframe>}
      </div>
    )
  }
}
