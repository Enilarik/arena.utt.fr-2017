import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './Modal.css'

export default class Modal extends React.Component {
  static propTypes = {
    opened: PropTypes.any,
    onHide: PropTypes.func
  }

  static defaultProps = {
    opened: false,
    onHide: function () {}
  }

  constructor(props) {
    super(props)

    this.state = {
      opened: this.props.opened
    }

    this.backdropClick = this.backdropClick.bind(this)
    this.checkEsc = this.checkEsc.bind(this)
    this.onHide = this.props.onHide.bind(this)
  }

  componentWillReceiveProps(props) {
    this.setState({
      opened: props.opened
    })
  }

  componentWillMount() {
    document.body.addEventListener('keyup', this.checkEsc)
  }

  componentWillUnmount() {
    document.body.removeEventListener('keyup', this.checkEsc)
  }

  checkEsc(e) {
    if (this.state.opened && e.which === 27) {
      this.backdropClick()
    }
  }

  backdropClick() {
    this.setState({
      opened: false
    })

    this.onHide()
  }

  render() {
    let modal = (
      <CSSTransition classNames="fade" timeout={{ enter: 225, exit: 225 }}>
        <div className="a-modal-container">
          <div className="a-modal">
            {this.props.children}
          </div>

          <div className="a-backdrop" onClick={this.backdropClick}></div>
        </div>
      </CSSTransition>
    )

    return (
      <TransitionGroup>
        {this.state.opened ? modal : null}
      </TransitionGroup>
    )
  }
}
