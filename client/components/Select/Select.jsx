import PropTypes from 'prop-types'
import { Iterable } from 'immutable'
import React from 'react'

import './Select.css'

export default class Select extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
          label: PropTypes.string
        })
      ),
      PropTypes.instanceOf(Iterable)
    ]),
    value: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        name: e.target.name,
        value: e.target.value
      })
    }
  }

  componentWillMount() {
    if (this.props.value) {
      return
    }

    const size = this.props.options.size || this.props.options.length

    if (typeof this.props.onChange === 'function' && size > 0) {
      this.props.onChange(this._getValue())
    }
  }

  _getValue() {
    const name = this.props.name
    let value

    if (typeof this.props.options.get === 'function') {
      value = this.props.options.get(0).value
    } else {
      value = this.props.options[0].value
    }

    return { name, value }
  }

  render() {
    return (
      <select
        className="a-input a-select"
        name={this.props.name}
        value={this.props.value}
        onChange={this.onChange}>
        {this.props.options.map((option, i) => (
          <option value={option.value} key={i}>{option.label}</option>
        ))}
      </select>
    )
  }
}
