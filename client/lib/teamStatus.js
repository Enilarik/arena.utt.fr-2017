export default (state) => {
  const team = state.user.getIn(['user', 'team'])
  const teamUsers = state.user.getIn(['user', 'team', 'users'])
  const spotlight = state.user.getIn(['user', 'team', 'spotlight'])

  if (!team) {
    return { status: 'Aucune équipe — Libre', theme: 'warning' }
  }

  if (team && !spotlight) {
    return { status: 'Équipe non inscrite — Libre', theme: 'error' }
  }

  const playerCount = teamUsers.size
  const playerPaidCount = teamUsers.filter((player) => player.get('paid')).size
  const maxPlayers = spotlight.get('perTeam')

  if (playerCount < maxPlayers || playerPaidCount < maxPlayers) {
    return { status: 'Équipe incomplète', theme: 'warning' }
  }

  return { status: 'Équipe inscrite', theme: 'success' }
}
