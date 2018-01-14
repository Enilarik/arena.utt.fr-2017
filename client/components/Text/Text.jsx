import React from 'react'
import classNames from 'classnames'

import './Text.css'

export default class Text extends React.Component {
  render() {
    const classes = classNames('a-text', this.props.className);

    return (
      <p className={classes}>
        { this.props.children }
      </p>
    )
  }
}
