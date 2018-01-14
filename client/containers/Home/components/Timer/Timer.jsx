import React from 'react'
import countdown from 'countdown'
import leftPad from 'left-pad'

import './Timer.css'

const DATE = new Date('2017-12-08T18:00:00')

export default class Timer extends React.Component {
  render() {
    const cntdwn = countdown(countdown(DATE))

    return (
      <div className="a-timer">
        <div className="a-timer__date">
          <div className="a-timer__date__months">
            <div className="a-timer__date__months__date">{ leftPad(cntdwn.months, 2, '0') }</div>
            <div className="a-timer__date__months__word">months</div>
          </div>
          <div className="a-timer__date__days">
            <div className="a-timer__date__days__date">{ leftPad(cntdwn.days, 2, '0') }</div>
            <div className="a-timer__date__days__word">days</div>
          </div>
        </div>
      </div>
    )
  }
}
