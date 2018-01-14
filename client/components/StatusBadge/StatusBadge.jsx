import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './StatusBadge.css'

export default class StatusBadge extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(['success', 'warning', 'error'])
  }

  static defaultProps = {
    theme: 'success'
  }

  render() {
    const classes = classNames({
      'a-status-badge': true,
      [`a-status-badge--${this.props.theme}`]: true
    })

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}
