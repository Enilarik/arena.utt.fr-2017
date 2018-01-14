import React from 'react'

import './Partners.css'

import LazyImg from '../../../../components/LazyImg'

import partner1 from '../../../../assets/bde.jpg'
import partner2 from '../../../../assets/c3.jpg'
import partner3 from '../../../../assets/compumsa.jpg'
import partner4 from '../../../../assets/meltdown.png'
import partner5 from '../../../../assets/noctua.jpg'
import partner6 from '../../../../assets/orange.jpg'
import partner7 from '../../../../assets/shadow.png'
import partner8 from '../../../../assets/plantronics.jpg'
import partner9 from '../../../../assets/troyesExpoCube.jpg'
import partner10 from '../../../../assets/tekliss.jpg'
import partner11 from '../../../../assets/toornament.png'
import partner12 from '../../../../assets/rog.png'
import partner13 from '../../../../assets/scoup.png'
import '../../../../assets/bde.webp'
import '../../../../assets/c3.webp'
import '../../../../assets/compumsa.webp'
import '../../../../assets/meltdown.webp'
import '../../../../assets/noctua.webp'
import '../../../../assets/orange.webp'
import '../../../../assets/shadow.webp'
import '../../../../assets/plantronics.webp'
import '../../../../assets/troyesExpoCube.webp'
import '../../../../assets/tekliss.webp'
import '../../../../assets/toornament.webp'
import '../../../../assets/rog.webp'
import '../../../../assets/scoup.webp'

export default class Partners extends React.Component {
  render() {
    return (
      <div className="a-partners">
        <div className="a-partners__row">
          <LazyImg color="#696666" src={partner9} alt="troyesExpoCube" height="100" width="278" />
          <LazyImg color="#f34c25" src={partner8} alt="plantronics" height="60" width="234" />
          <LazyImg color="#ffffff" src={partner7} alt="shadow" height="60" width="262" />
          <LazyImg color="#4d2221" src={partner5} alt="noctua" height="100" width="90" />
        </div>
        <div className="a-partners__row">
          <LazyImg color="#ace44c" src={partner4} alt="meltdown" height="100" width="108" />
          <LazyImg color="#1162cc" src={partner3} alt="compumsa" height="100" width="193" />
          <LazyImg color="#fb6405" src={partner6} alt="orange" height="100" width="100" />
          <LazyImg color="#164597" src={partner2} alt="c3" height="100" width="229" />
        </div>
        <div className="a-partners__row">
          <LazyImg color="#0b0b0b" src={partner1} alt="bde" height="100" width="172" />
          <LazyImg color="#ffffff" src={partner10} alt="tekliss" height="80" width="300" />
          <LazyImg color="#ffffff" src={partner11} alt="toornament" height="31" width="200" />
        </div>
        <div className="a-partners__row">
          <LazyImg color="#dd0000" src={partner12} alt="republicOfGamers" height="53" width="253" />
          <LazyImg color="#ffffff" src={partner13} alt="Scoup-Esport" height="43" width="137" />
        </div>
      </div>
    )
  }
}
