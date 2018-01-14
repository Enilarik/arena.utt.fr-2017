import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'

import './Header.css'

import logo from '../../assets/icon.small.png'

const mapActionsToProps = (dispatch) => {
  return {
    back(e) {
      e && e.preventDefault()
      dispatch(goBack())
    },
    to(to) {
      dispatch(push(to))
    }
  }
}

class Header extends React.Component {
  static propTypes = {
    arrow: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.back = this.props.back.bind(this)
    this.to = (to) => this.props.to.bind(this, to)
  }

  render() {
    let click
    if (this.props.arrow === 'back') {
      click = this.back
    } else {
      click = this.to(this.props.arrow)
    }

    let returnArrow = this.props.arrow && (
      <div className="a-header__arrow-container" onClick={click}>
        <div className="a-header__arrow-container__arrow"></div>
      </div>
    )

    return (
      <div className="a-header">
        {returnArrow}
        <div className="a-header__background">
          <div className="a-header__background__mask"></div>
          <div className="a-header__background__inner"></div>
        </div>
        <div className="a-header__logo">
          <img src={logo} alt="UA 2017 Logo" height="150" width="150"/>
        </div>
      </div>
    )
  }
}

export default connect(null, mapActionsToProps)(Header)
