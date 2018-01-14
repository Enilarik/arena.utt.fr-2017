const errors = {
  INVALID_NAME: 'Nom d\'utilisateur invalide',
  INVALID_PASSWORD: 'Mot de passe invalide',
  INVALID_EMAIL: 'E-mail invalide',
  INVALID_LOGIN: 'Indentifiants incorrects',
  DISABLED_LOGIN: 'Inscription désactivée',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit faire plus de 6 caractères',
  ERROR_DUPLICATE_USER: 'L\'utilisateur existe déjà',
  ERROR_DUPLICATE_TEAMNAME: 'L\'équipe existe déjà',
  ALREADY_IN_TEAM: 'Vous êtes déjà dans une équipe',
  HE_IS_ALREADY_IN_TEAM: 'L\'utilisateur est déjà dans une équipe',
  INVALID_LOOKINGFOR: 'Recherche invalide (8 caractères min., 255 max.)',
  INVALID_JOINTEAMFINDERMESSAGE: 'Message invalide (8 caractères min., 255 max.)',
  ERROR_DUPLICATE_JOIN: 'Demande déjà effectuée',
  NO_CAPTAIN: 'Vous n\'êtes pas capitaine',
  NO_TEAM: 'Vous n\'avez pas d\'équipe ou votre équipe est mono-joueur',
  TOURNAMENT_FULL: 'Tournoi plein',
  TEAM_NOT_FULL: 'Équipe non pleine',
  NOT_PAID: 'Vous n\'avez pas payé votre place',
  TOO_MANY_PLAYERS: 'Trop de joueurs'
}

module.exports = (err) => {
  if (err && errors.hasOwnProperty(err)) {
    return errors[err]
  }

  if (err) {
    return 'Erreur inconnue'
  }
}
