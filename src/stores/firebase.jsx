import firebase from 'firebase';
import config from '../config/config.json';

export default class Firebase {
  constructor(lang) {
    // Initialize Firebase
    firebase.initializeApp(config);
    this.ref = firebase.database().ref();
    this.userRef = null;
    this.auth = new firebase.auth.GoogleAuthProvider();
  }

  setUserDatabase(uid) {
    return new Promise((resolve) => {
      console.log(uid);
      console.log(this.ref.child('users').child(uid));
      const userRef = this.ref.child('users').child(uid);
      userRef.once('value', snap => {
          if (snap.exists()) {
            this.userRef = userRef;
            resolve();
          } else {
              userRef.set({groups:[]});
              this.userRef = userRef;
              console.log('notfound');
              resolve();
          }
      });
    });
  }

  saveGroups(value) {
    console.log('SAVE');
    console.log(value);
    this.userRef.child('groups').set(value);
  }
}
