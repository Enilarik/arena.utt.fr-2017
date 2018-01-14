import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './Footer.css'

export default class Footer extends React.Component {
  static propTypes = {
    showCopy: PropTypes.bool
  }

  static defaultProps = {
    showCopy: true
  }

  render() {
    return (
      <footer className="a-footer">
        {this.props.showCopy && <div>&copy; UTT Net Group</div>}
        {!this.props.showCopy && <a href="mailto:arena@utt.fr">arena@utt.fr</a>}
        <div className="a-footer__space"></div>
        <Link to="/legal">Mentions légales</Link>
      </footer>
    )
  }
}
