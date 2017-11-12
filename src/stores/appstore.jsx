import {extendObservable, action, computed, autorun} from 'mobx';
import firebase from 'firebase';

export default class AppStore {

  constructor(firebaseClass, history, trans) {
    this.fb = firebaseClass;
    this.history = history;
    this.s = trans;
    extendObservable(this, {
      user: null,
      loggedin: false,
      groups: [],
      template: 'default',
      name: '',
      alerts: [],
      currentLocation: history.location.pathname,
      loading: true
    });

    this.history.listen(location => {
      this.setLocation(location.pathname);
      this.clearAlerts();
    })

    this.setLocation = action(path => this.currentLocation = path);

    this.setLoading = action(bool => this.loading = bool);

    this.successLogin = action((user, redirect = true, showAlert = true) => {
      const uid = user.uid;
      this.fb.setUserDatabase(uid).then(() => {
        this.user = user;
        this.fb.userRef.once('value').then( snap => {
            this.groups = snap.child('groups').val() || [];
            this.loggedin = true;
            this.setLoading(false);
            if (redirect) this.history.push('/generator');
            if (showAlert) this.addSuccess(`${this.s.alert.success_login} ${this.user.email}`, 'check');
          }
        );
      });
    });

    this.alreadyLoggedIn = action( () => {
      // AUTO-LOGIN
      // if th euser is connected on firebase, automatically update frontend
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.successLogin(user, false, false);
        } else {
          this.setLoading(false);
        }
      });
    });
    this.alreadyLoggedIn();

    this.handleLogout = action(() => {
      firebase.auth().signOut()
      .then(() => {
        this.loggedin = false;
        this.history.push('/')
      });
    });

    this.handleGoogleLogin = action((user) => {
      firebase.auth().signInWithPopup(this.fb.googleAuth)
      .then(res => {
        this.successLogin(res.user);
      });
    });

    this.addGroup = action(() => {
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

    this.handleClassicLogin = action(credentials => {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(credentials.login, credentials.pwd)
        .then(user => this.successLogin(user))
        .catch(error =>reject(error));
    });
  });

    this.handleRegister = action(credentials => {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(credentials.login, credentials.pwd)
        .then(user => this.successLogin(user))
        .catch(error =>reject(error));
      });
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

    this.clearAlerts = action('clearAlerts', () => new Promise( resolve => {
        this.alerts = [];
        resolve();
      })
    );

    this.addDanger = action('addDangerAlert', (text, icon = false) => {
      this.clearAlerts()
      .then(() => {
        this.alerts.push({ type:'danger', msg:text, icon: icon });
      })
    });

    this.addWarning = action('addWarningAlert', (text, icon = false) => {
      this.clearAlerts()
      .then(() => {
        this.alerts.push({ type:'warning', msg:text, icon: icon });
      })
    });

    this.addInfo = action('addInfoAlert', (text, icon = false) => {
      this.clearAlerts()
      .then(() => {
        this.alerts.push({ type:'info', msg:text, icon: icon });
      })
    });

    this.addSuccess = action('addSuccessAlert', (text, icon = false) => {
      this.clearAlerts()
      .then(() => {
        this.alerts.push({ type:'success', msg:text, icon: icon });
      })
    });


    this.macro = computed (() => {
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
      this.loggedin ? this.fb.saveGroups(this.groups.peek()) : null;
    });
  }
}
