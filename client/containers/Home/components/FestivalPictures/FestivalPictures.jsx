import React from 'react'

import './FestivalPictures.css'

import LazyImg from '../../../../components/LazyImg'

import picture1 from '../../../../assets/pic1.jpg'
import picture2 from '../../../../assets/pic2.jpg'
import picture3 from '../../../../assets/pic3.jpg'
import '../../../../assets/pic1.webp'
import '../../../../assets/pic2.webp'
import '../../../../assets/pic3.webp'

export default class FestivalPictures extends React.Component {
  render() {
    return (
      <div className="a-festival-pictures">
        <div className="a-festival-pictures__row">
          <LazyImg src={picture1} color="#17141c" alt="Photo UA 1" />
        </div>
        <div className="a-festival-pictures__row">
          <LazyImg src={picture2} color="#d3cec6" alt="Photo UA 2" />
        </div>
        <div className="a-festival-pictures__row">
          <LazyImg src={picture3} color="#232632" alt="Photo UA 3" />
        </div>
      </div>
    )
  }
}
