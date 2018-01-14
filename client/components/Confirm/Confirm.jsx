import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'

import './Confirm.css'

class CreateTeam extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    confirmTheme: PropTypes.oneOf(['white', 'orange', 'blue', 'success', 'error'])
  }

  static defaultProps = {
    confirmTheme: 'orange'
  }

  constructor(props) {
    super(props)

    this.onConfirm = this.onConfirm.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  onConfirm(e) {
    e.preventDefault()
    this.props.onConfirm()
  }

  onCancel(e) {
    e.preventDefault()
    this.props.onCancel()
  }

  render() {
    return (
      <form className="a-confirm">
        <div className="a-confirm__content">
          {this.props.children}
        </div>
        <div className="a-confirm__buttons">
          <Button onClick={this.onCancel}>Annuler</Button>
          <div className="a--space"></div>
          <Button onClick={this.onConfirm} theme={this.props.confirmTheme}>Confirmer</Button>
        </div>
      </form>
    )
  }
}

export default CreateTeam
