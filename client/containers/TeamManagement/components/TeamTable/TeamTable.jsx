import React from 'react'
import PropTypes from 'prop-types'

import './TeamTable.css'

export default class TeamTable extends React.Component {
  static propTypes = {
    players: PropTypes.any,
    spotlight: PropTypes.any
  }

  renderTableRow(player, i) {
    return (
      <div className="a-team-table__body__row" key={i}>
        <div className="a-team-table__body__row__cell">{player.get('name')}</div>
        {player.get('paid') && (
          <div className="a-team-table__body__row__cell a-team-table__payment">
            <span className="a-team-table__payment--yes"></span>
          </div>
        )}
        {!player.get('paid') && (
          <div className="a-team-table__body__row__cell a-team-table__payment">
            <span className="a-team-table__payment--no"></span> Non payé
          </div>
        )}
      </div>
    )
  }

  render() {
    const playerCount = this.props.players.size
    const playerPaidCount = this.props.players.filter((player) => player.get('paid')).size

    return (
      <div className="a-team-table">
          <div className="a-team-table__header">
            <div className="a-team-table__header__row">
              <div className="a-team-table__header__row__cell">Nom du joueur</div>
              <div className="a-team-table__header__row__cell">Paiement</div>
            </div>
          </div>
          <div className="a-team-table__body">
            {this.props.players.map(this.renderTableRow)}
          </div>
          <div className="a-team-table__footer">
            <div>
              Joueurs : {playerCount}
            </div>
            <div>
              Places payées : {playerPaidCount}
            </div>
          </div>
      </div>
    )
  }
}
