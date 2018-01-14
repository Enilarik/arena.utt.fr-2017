import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ListItem.css'

export default class ListItem extends React.Component {
  static propTypes = {
    withArrow: PropTypes.bool,
    clickable: PropTypes.bool,
    price: PropTypes.number,
    onClick: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    clickable: true,
    price: null,
    withArrow: true
  }

  render() {
    let content

    const classes = classNames('a-list-item', {
      'a-list-item--with-arrow': this.props.withArrow,
      'a-list-item--with-price': this.props.price,
      'a-list-item--clickable': this.props.clickable
    }, this.props.className)

    if (this.props.withArrow) {
      content = (
        <div className={classes} onClick={this.props.onClick}>
          <div className="a-list-item__content">
            {this.props.children}
          </div>
          <div className="a-list-item__arrow-container">
            <div className="a-list-item__arrow-container__arrow"></div>
          </div>
        </div>
      )
    } else if (this.props.price) {
      content = (
        <div className={classes} onClick={this.props.onClick}>
          <div className="a-list-item__content">
            {this.props.children}
          </div>
          <div className="a-list-item__price a-title">
            {this.props.price}€
          </div>
        </div>
      )
    } else {
      content = (
        <div className={classes} onClick={this.props.onClick}>
          {this.props.children}
        </div>
      )
    }

    return content
  }
}
