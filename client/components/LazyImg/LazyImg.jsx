import React from 'react'
import PropTypes from 'prop-types'

import loadImage from '../../lib/loadImage'

export default class LazyImg extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    color: PropTypes.string,
    alt: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string
  }

  static defaultProps = {
    alt: '',
    height: '',
    width: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      blur: true,
      img: ''
    }
  }

  componentDidMount() {
    setTimeout(() => {
      loadImage(this.props.src)
        .then((src) => {
          this.setState({
            blur: false,
            img: src
          })
        })
    })
  }

  render() {
    const { height, width, alt } = this.props

    if (this.state.blur) {
      let styles = { display: 'block', width: '100%', height: '100%', backgroundColor: this.props.color }

      if (width && height) {
        styles.width = `${width}px`
        styles.height = `${height}px`
      }

      return <div style={styles} />
    }

    return <img src={ this.state.img } height={height} width={width} alt={alt} />
  }
}
