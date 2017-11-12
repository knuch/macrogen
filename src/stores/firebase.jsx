import firebase from 'firebase';
import config from '../config/config.json';

export default class Firebase {
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(config);
    this.ref = firebase.database().ref();
    this.userRef = null;
    this.googleAuth = new firebase.auth.GoogleAuthProvider();
  }

  setUserDatabase(uid) {
    return new Promise((resolve) => {
      const userRef = this.ref.child('users').child(uid);
      userRef.once('value', snap => {
        if (snap.exists()) {
          this.userRef = userRef;
          resolve();
        } else {
          userRef.set({groups:[]});
          this.userRef = userRef;
          resolve();
        }
      });
    });
  }

  saveGroups(value) {
    this.userRef.child('groups').set(value);
  }
}
