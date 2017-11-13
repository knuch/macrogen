import {extendObservable, action, computed, autorun, observable, toJS} from 'mobx';
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
      currentGroup: false,
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
    // if the user is connected on firebase, automatically update frontend
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
    const group = {
      id: new Date().valueOf(),
      entries: observable([])
    }
    this.groups.push(group);
  });

  this.findEntry = action((groupId, entryId) => {
    const currentGroup = this.findGroup(groupId);
    return currentGroup.entries.find(entry => entry.id === entryId)
  });

  this.setEntryArg = action((e, groupId, entryId, arg) => {
    const currentEntry = this.findEntry(groupId, entryId);
    currentEntry.args[arg] = e.target.value;
  });

  this.findGroup = action(id => {
    return this.groups.find(current => current.id === id );
  });

  this.addEntry = action((groupid, entryType) => {
    const group = this.findGroup(groupid);
    if(!group.entries) extendObservable(group, {entries: []});
    const id = new Date().valueOf();
    switch(entryType) {
      case 'text':
      group.entries.push(observable({
        id: id,
        type: 'text',
        args: { value: '' }
      }));
      break;
      case 'roll':
      group.entries.push(observable({
        id: id,
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
      }));
      break;
    }
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

  this.setTemplate = action(e => {
    this.template = e.target.value;
  });

  this.setName = action(e => {
    this.name = e.target.value;
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
    const entriesValues = g.entries
    ?
     g.entries.map(e => {
      const a = e.args;
      switch(e.type) {
        case 'text':
          return a.value;
        break;
        case 'roll':
          const bonus = isNaN(a.bonus) ? `@{${a.bonus}}` : a.bonus;
          return `[[${a.dice}${a.cf ? `cf>${a.cf}` : ''}${a.cs ? `cs<${a.cs}` : ''}${bonus ? `+${bonus}`:''}]]`;
        break;
      }
    })
    : null;
    const computedLine = entriesValues && entriesValues.length > 0 ? entriesValues.reduce((acc, current) => acc+' '+current) : '';
    return `{{${computedLine}}}`;
  });
  console.log(macroBody);
  if(macroBody.length === 0) {
    return macroHead;
  } else {
    const fullMacro = macroHead+macroBody.reduce((acc, current) => acc+current)
    return fullMacro;
  }
});

autorun(() => {
  this.loggedin ? this.fb.saveGroups(toJS(this.groups)) : null;
});
}
}
