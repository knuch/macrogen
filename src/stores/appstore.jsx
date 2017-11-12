import {extendObservable, observable, action, observe, computed, autorun, toJS} from 'mobx';
import firebase from 'firebase';

export default class AppStore {

  constructor(firebaseClass, history) {
    this.fb = firebaseClass;
    this.history = history;
    extendObservable(this, {
      user: null,
      loggedin: false,
      groups: [],
      template: 'default',
      name: '',
      alerts: [],
      currentLocation: history.location.pathname
    });

    this.history.listen(location => {
      this.setLocation(location.pathname);
    })

    this.setLocation = action(path => this.currentLocation = path);

    this.successLogin = action((user) => {
      const uid = user.uid;
      this.fb.setUserDatabase(uid).then(() => {
        this.user = user;
        this.fb.userRef.once('value').then( snap => {
            this.groups = snap.child('groups').val() || [];
            this.loggedin = true;
            this.history.push('/generator');
          }
        );
      });
    });

    this.handleLogout = action(() => {
      firebase.auth().signOut()
      .then(() => {
        this.loggedin = false;
        this.history.push('/')
      })
      .catch(error => {

      });
    });

    this.handleGoogleLogin = action((user) => {
      firebase.auth().signInWithPopup(this.fb.googleAuth)
      .then(res => {
        this.successLogin(res.user);
      });
    });

    this.addGroup = action(() => {
      console.log(this);
      const index = this.groups.length+1;
      const group = {
        id: index,
        label: `Group ${index}`,
        type: 'roll',
        args: {
          dice: '',
          txtbefore: '',
          txtafter: '',
          cs: '',
          cf: '',
          modifs: [],
          bonus: ''
        }
      }
      this.groups.push(group);
    });

    this.handleRegister = action(credentials => {
      return new Promise((resolve, reject) => {
        console.log(firebase);
        firebase.auth().createUserWithEmailAndPassword(credentials.login, credentials.pwd)
        .then(user => {
          console.log(user);
            this.successLogin(user);
        })
        .catch(error => {
          reject(error);
        });
      });
    });

    this.saveGroups = action( () => {
      console.log(this.groups);
    });

    this.setGroupType = action((e, group) => {
      const currentGroup = this.findGroup(group.id);
      currentGroup.type = e.target.value;
    });

    this.setGroupArg = action((e, group, arg) => {
      const currentGroup = this.findGroup(group.id);
      currentGroup.args[arg] = e.target.value;
    });

    this.setTemplate = action(e => {
      this.template = e.target.value;
    });

    this.setName = action(e => {
      this.name = e.target.value;
    });

    this.findGroup = action(id => {
      return this.groups.find(current => current.id === id );
    });

    this.macro = computed (() => {
      const reference = "&{template:default}{{name=bite}}{{hit [[1d20cs>5+15]] for [[1d8cf<3+7+[STR]?{Damage Bonus?|0}[Misc. Bonus]]] dmg }}{{Fort DC21 for [[1d3]] STR dmg}}";
      const macroHead = `&{template:${this.template}}{{name=${this.name}}}`;
      const macroBody = this.groups.map(g => {
        const a = g.args;
        return `{{${a.txtbefore ? `${a.txtbefore} ` : ''}[[${a.dice}${a.cf ? `cf>${a.cf}` : ''}${a.cs ? `cs<${a.cs}` : ''}${a.bonus ? `+${a.bonus}`:''}]]${a.txtafter ? ` ${a.txtafter}` : ''}}}`;
      });
      if(macroBody.length === 0) {
        return macroHead;
      } else {
        const fullMacro = macroHead+macroBody.reduce((acc, current) => acc+current)
        return fullMacro;
      }
    });

    autorun(() => {
      const json = JSON.stringify(toJS(this.groups));
      this.loggedin ? this.fb.saveGroups(this.groups.peek()) : null;
    });
  }
}
