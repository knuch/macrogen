import firebase from 'firebase';
import config from './config/config.json';

export default class Firebase {
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(config);
    const db = firebase.database().ref().child('test');
    db.on('value', snap => console.log(snap.val()));
  }
}
