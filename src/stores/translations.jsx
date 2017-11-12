import LocalizedStrings from 'react-localization';

let Translations = new LocalizedStrings({
  fr: {
    brand: 'Macrogen',
    login: {
      title: 'Login',
      username: 'Nom d\'utilisateur',
      username_placeholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      password_placeholder: 'Entrez votre mot de passe',
      submit: 'Connexion',
      register: 'Me créer un compte',
      google: 'Se connecter avec google'

    },
    home: {
      title: 'Bienvenue',
      text: 'Macrogen est un outil vous permettant de créer et sauvegarder vos macros pour la plateforme Roll20. Amis du jeux de rôle en ligne, cet outil vous facilitera la vie, MJ comme joueurs!',
      subtext: 'Pour pouvoir sauvegarder vos macros, veuillez créer un compte ou vous connecter.',
      or_try: 'Ou alors vous pouvez'
    }
  },
  en: {
    header: 'HEADER'
  }
});

export default Translations;
