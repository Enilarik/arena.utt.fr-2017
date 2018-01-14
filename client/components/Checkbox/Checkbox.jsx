import React from 'react'
import PropTypes from 'prop-types'
import randomstring from 'randomstring'

import './Checkbox.css'

export default class Checkbox extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        name: e.target.name,
        value: e.target.checked
      })
    }
  }

  render() {
    const id = `${randomstring.generate(5)}-${this.props.name}`

    return (
      <div className="a-checkbox">
        <input className="a-checkbox__input" type="checkbox" name={this.props.name} id={id} onChange={this.onChange} value={this.value} />
        <label className="a-checkbox__label" htmlFor={id}>
          {this.props.children}
        </label>
      </div>
    )
  }
}
