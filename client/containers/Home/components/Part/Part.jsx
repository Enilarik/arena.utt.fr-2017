import React from 'react'

import './Part.css'

export default class Part extends React.Component {
  render() {
    return (
      <div className="a-part">
        <div className="a-part__content">
          { this.props.children }
        </div>
      </div>
    )
  }
}
