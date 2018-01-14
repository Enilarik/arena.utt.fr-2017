import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Title.css'

export default class Title extends React.Component {
  static propTypes = {
    size: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
    center: PropTypes.bool,
    theme: PropTypes.oneOf(['orange', 'white', 'blue'])
  }

  static defaultProps = {
    size: 'h4',
    center: false,
    theme: 'orange'
  }

  render() {
    const classes = classNames({
      'a-title': true,
      'a-title--center': this.props.center,
      [`a-title--${this.props.theme}`]: true
    })

    switch (this.props.size) {
      case 'h1': return <h1 className={classes}>{ this.props.children }</h1>
      case 'h2': return <h2 className={classes}>{ this.props.children }</h2>
      case 'h3': return <h3 className={classes}>{ this.props.children }</h3>
      case 'h4': return <h4 className={classes}>{ this.props.children }</h4>
    }
  }
}
