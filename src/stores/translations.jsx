import LocalizedStrings from 'react-localization';

let trans = new LocalizedStrings({
  fr: {
    brand: 'Macrogen',
    loading: 'Chargement...',
    alert: {
      success_login: 'Connexion réussie. Bienvenue'
    },
    examples: {
      copied: 'Macro copied'
    },
    login: {
      title: 'Login',
      username: 'Nom d\'utilisateur',
      username_placeholder: 'Entrez votre e-mail',
      password: 'Mot de passe',
      password_placeholder: 'Entrez votre mot de passe',
      submit: 'Connexion',
      register: 'Me créer un compte',
      google: 'Se connecter avec google',
      go_to_generator: 'Mes macros',
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
      home: 'Accueil',
      my_macros: 'Mes macros',
      examples: 'Exemples',
    },
    generator: {
      logged_out: 'Vous êtes déconnecté. Pour sauvegarder vos macro, veuillez vous',
      connect: 'connecter',
      copied: 'Macro copiée dans le presse-papier',
      copy: 'Copier',
      empty: 'Vide'
    },
    form: {
      add_group: 'Ajouter un groupe de macros',
      template: 'Template de votre macro',
      title: 'Titre de la macro',
      parameters: 'Paramètre généraux',
      addLine: 'Ajouter une ligne à la macro',
      add_entry_text: 'Ajouter du texte',
      add_entry_roll: 'Ajouter du lancé de dé',
      line: 'Ligne',
      text: 'Texte',
      text_placeholder: 'Texte de la macro',
      roll: 'Lancer de dés',
      value: 'valeur',
      value_placeholder: 'valeur',
      dice: 'Dé',
      dice_placeholder: 'Dé à lancer',
      bonus: 'Bonus',
      bonus_placeholder: 'bonus (12, STR)',
      cs: 'Crit',
      cs_placeholder: 'seuil de critique',
      cf: 'Fumble',
      cf_placeholder: 'seuil d\'échec',
      no_line_selected: 'Aucune ligne sélectionnée',
      no_line_detail: 'Sélectionnez une ligne dans la colonne de gauche pour éditer ses détails',
      my_macros: 'Macros',
      my_macro: 'Ma macro',
      add_macro: 'Ajouter une macro',
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

export default trans;
