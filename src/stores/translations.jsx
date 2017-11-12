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
      google: 'Se connecter avec google',
      go_to_generator: 'Afficher le générateur',
      loggedin_as: 'Connecté en tant que',
      logout: 'Déconnexion'
    },
    home: {
      title: 'Bienvenue',
      subtext: 'Pour pouvoir sauvegarder tes macros, crée-toi un compte ou connecte-toi.',
      or_try: 'Sinon, tu peux aussi',
      no_account: 'Utiliser Macrogen sans compte',
      happy_gaming: 'Bon jeu à tous!'
    },
    menu: {
      about: 'À propos',
      donate: 'Faire un don!',
      generator: 'Generateur',
      home: 'Accueil'
    },
    generator: {
      logged_out: 'Vous êtes déconnecté. Pour sauvegarder vos macro, veuillez vous',
      connect: 'connecter',
      copied: 'Macro copiée dans le presse-papier',
      copy: 'Copier'
    },
    form: {
      template: 'Template',
      title: 'Titre'
    },
    error: {
      text: 'Une erreur est subvenue. La page que vous cherchez n\'a pas pu être trouvée.',
      take_me_home: 'Retour à l\'accueil'
    }
  },
  en: {
    header: 'HEADER',
    error: {
      text: 'Sorry, an error has occured, Requested page not found!'
    }
  }
});

export default Translations;
