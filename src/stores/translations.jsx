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
      subtext: 'Pour pouvoir sauvegarder tes macros, crée-toi un compte ou connecte-toi.',
      or_try: 'Sinon, tu peux aussi',
      happy_gaming: 'Bon jeu à tous!'
    }
  },
  en: {
    header: 'HEADER'
  }
});

export default Translations;
