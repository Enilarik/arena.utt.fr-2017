import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Button.css'

export default class Button extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(['white', 'orange', 'blue', 'success', 'error']),
    size: PropTypes.oneOf(['normal', 'medium', 'big']),
    onClick: PropTypes.func
  }

  static defaultProps = {
    theme: 'white',
    size: 'normal'
  }

  render() {
    const classes = classNames({
      'a-button': true,
      [`a-button--${this.props.theme}`]: true,
      [`a-button--${this.props.size}`]: true
    })

    return (
      <button className={ classes } onClick={this.props.onClick}>
        { this.props.children }
      </button>
    )
  }
}
