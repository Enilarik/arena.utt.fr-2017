import React from 'react'
import PropTypes from 'prop-types'

import './Input.css'

export default class Input extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    autofocus: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any,
    disableReturn: PropTypes.bool,
    required: PropTypes.bool,
    pattern: PropTypes.string
  }

  static defaultProps = {
    placeholder: '',
    type: 'text',
    disableReturn: false,
    required: false,
    pattern: undefined
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        name: e.target.name,
        value: e.target.value
      })
    }
  }

  onKeyDown(e) {
    if (this.props.disableReturn && e.which === 13) {
      e.preventDefault()
    }
  }

  render() {
    return (
      <input
        className="a-input"
        placeholder={this.props.placeholder}
        type={this.props.type}
        name={this.props.name}
        autoFocus={this.props.autofocus}
        value={this.props.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        autoComplete={this.props.name}
        required={this.props.required}
        pattern={this.props.pattern}/>
    )
  }
}
