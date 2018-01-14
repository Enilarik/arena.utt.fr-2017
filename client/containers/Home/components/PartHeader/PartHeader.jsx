import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import loadImage from '../../../../lib/loadImage'

import Title from '../../../../components/Title'

import './PartHeader.css'

import cat1 from '../../../../assets/cat1.jpg'
import cat2 from '../../../../assets/cat2.jpg'
import cat3 from '../../../../assets/cat3.jpg'
import cat4 from '../../../../assets/cat4.jpg'

import '../../../../assets/cat1.webp'
import '../../../../assets/cat2.webp'
import '../../../../assets/cat3.webp'
import '../../../../assets/cat4.webp'

const catImgs = { cat1, cat2, cat3, cat4 }

export default class PartHeader extends React.Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      src: null
    }
  }

  componentDidMount() {
    setTimeout(() => {
      loadImage(catImgs[this.props.image])
        .then((src) => {
          this.setState({
            src: `url(${src})`
          })
        })
    })
  }

  render() {
    const styles = this.state.src ? { backgroundImage: this.state.src } : { backgroundColor: this.props.color }

    const classes = classNames({
      'a-part-header': true,
      [`a-part-header-${this.props.id}`]: true
    })

    return (
      <div className={ classes } style={ styles }>
        <div className="a-part-header__title">
          <Title theme="orange" size="h2">{ this.props.children }</Title>
        </div>
      </div>
    )
  }
}
