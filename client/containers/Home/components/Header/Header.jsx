import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import {
  showLoginModal
} from '../../../../actions'

import { polyfill } from '../../../../lib/blurPolyfill'

import Button from '../../../../components/Button'

import './Header.css'

const mapStateToProps = (state) => {
  return {
    hasUser: Boolean(state.user.get('user'))
  }
}

const mapActionsToProps = (dispatch) => {
  return {
    showLoginModal() {
      dispatch(showLoginModal())
    },
    toDashboard() {
      dispatch(push('/dashboard'))
    }
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props)

    // #2d2440

    this.addBackgroundImage = this.addBackgroundImage.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.showLoginModal = this.showLoginModal.bind(this)
  }

  addBackgroundImage(el) {
    polyfill(el)
  }

  showLoginModal() {
    if (this.props.hasUser) {
      return this.props.toDashboard()
    }

    this.props.showLoginModal()
  }

  scrollTo(part) {
    return () => {
      let $el

      if (part === 'event') {
        $el = document.querySelector('.a-part')
      } else {
        $el = document.querySelector(`.${part}`)
      }

      const headerSize = document.querySelector('.a-intro-header').getBoundingClientRect().height

      const top = $el.getBoundingClientRect().top
      const bodyTop = document.body.getBoundingClientRect().top
      const offset = top - bodyTop - headerSize

      window.scroll({ top: offset, behavior: 'smooth' });
    }
  }

  render() {
    let loginText = (this.props.hasUser) ? 'Dashboard' : 'Connexion'

    return (
      <header className="a-intro-header">
        <div className="a-intro-header__background" ref={this.addBackgroundImage}></div>
        <nav className="a-intro-header__nav">
          <Button onClick={this.scrollTo('event')}>L'événement</Button>
          <Button onClick={this.scrollTo('a-part-header-infos')}>Infos pratiques</Button>
          <Button size="medium" theme="orange" onClick={this.showLoginModal}>{loginText}</Button>
          <Button onClick={this.scrollTo('a-part-header-festival')}>Festival</Button>
          <Button onClick={this.scrollTo('a-part-header-partners')}>Partenaires</Button>
        </nav>
      </header>
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Header)
