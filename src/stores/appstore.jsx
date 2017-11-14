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
      groups: [
        {
          id: new Date().valueOf(),
          title: this.s.form.my_macros,
          macros: []
        },
      ],
      currentMacro: false,
      currentRow: false,
      alerts: [],
      loading: true
    });

    this.history.listen(location => {
      this.clearAlerts();
    });

    this.setLoading = action(bool => this.loading = bool);

    // ---------------------------- Login and register -----------------------

    this.successLogin = action((user, redirect = true, showAlert = true) => {
      const uid = user.uid;
      this.fb.setUserDatabase(uid).then(() => {
        this.user = user;
        this.fb.userRef.once('value').then( snap => {
          const baseGroup =[{
                        id: new Date().valueOf(),
                        title: this.s.form.my_macros,
                        macros: []
                      },];
          this.groups = snap.child('groups').val() || baseGroup;
          this.loggedin = true;
          this.setLoading(false);
          if (redirect) this.history.push('/generator');
          if (showAlert) this.addSuccess(`${this.s.alert.success_login} ${this.user.email}`, 'check');
        });
      });
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

    // ---------------------------- find -----------------------

    this.findGroup = action(groupId => {
      return this.groups.find(current => Number(current.id) === Number(groupId) );
    });

    this.findMacro = action((groupId, macroId) => {
      const group = this.findGroup(groupId);
      return group.macros.find(current => Number(current.id) === Number(macroId));
    });

    this.findRow = action((groupId, macroId, rowId) => {
      const macro = this.findMacro(groupId, macroId);
      return macro.rows.find(current => Number(current.id) === Number(rowId));
    });

    this.findEntry = action((groupId, macroId, rowId, entryId) => {
      const row = this.findRow(groupId, macroId, rowId);
      return row.entries.find(current => Number(current.id) === Number(entryId))
    });

    // ---------------------------- setcurrent -----------------------

    this.setCurrentGroup = action(groupId => {
      this.currentGroup = this.findGroup(groupId);
    });

    this.setCurrentMacro = action((groupId ,macroId) => {
      const macro = this.findMacro(groupId, macroId);
      // dynamic observableArray declaration
      // As empty arrays are not persisted to firebase
      if (!macro.rows) extendObservable(macro, {rows: []});
      this.currentMacro = macro;
    });

    this.setCurrentRow = action(rowId => {
      const row = this.findRow(rowId);
      // dynamic observableArray declaration
      // As empty arrays are not persisted to firebase
      if (!row.entries) extendObservable(row, {entries: []});
      this.currentRow = row;
    });

    // ---------------------------- Add -----------------------

    this.addGroup = action(() => {
      const group = {
        id: new Date().valueOf(),
        macros: observable([])
      }
      this.groups.push(group);
    });

    this.addMacro = action((groupId) => {
      const group = this.findGroup(groupId);
      console.log(group);
      const macro = {
        id: new Date().valueOf(),
        title: this.s.form.my_macro,
        rows: observable([])
      }
      group.macros.push(macro);
    });

    this.addRow = action((goupId, macroId) => {
      const macro = this.findMacro(goupId, macroId);
      const row = {
        id: new Date().valueOf(),
        entries: observable([])
      }
      macro.rows.push(row);
    });

    this.addEntry = action((entryType, groupId, macroId, rowId) => {
      const row = this.findRow(groupId, macroId, rowId);
      const id = new Date().valueOf();
      switch(entryType) {
        case 'text':
        row.entries.push(observable({
          id: id,
          type: 'text',
          args: { value: '' }
        }));
        break;
        case 'roll':
        row.entries.push(observable({
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

    // ---------------------------- Delete -----------------------
    this.deleteGroup = action((group) => {
      this.groups.remove(group);
    });

    this.deleteMacro = action((macro, groupId) => {
      const group = this.findGroup(groupId);
      group.macros.remove(macro);
    });

    this.deleteRow = action((row, groupId, macroId) => {
      const macro = this.findMacro(groupId, macroId);
      macro.rows.remove(row);
    });

    this.deleteEntry = action((entry, groupId, macroID, rowId) => {
      const row = this.findRow(groupId, macroID, rowId);
      row.entries.remove(entry);
    });

    this.setEntryArg = action((e, groupId, entryId, arg) => {
      const currentEntry = this.findEntry(groupId, entryId);
      currentEntry.args[arg] = e.target.value;
    });

    // ---------------------------- Getters and Setters -----------------------

    this.setItemTitle = action((item, text) => {
      item.title = text;
    });

    // ---------------------------- Alerts -----------------------

    this.clearAlerts = action('clearAlerts', () => new Promise( resolve => {
      this.alerts = [];
      resolve();
    }));

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

    // ---------------------------- Computed Macro -----------------------

    this.macro = computed (() => {
      const macroHead = `&{template:${this.template}}{{name=${this.name}}}`;
      const macroBody = this.currentMacro.rows.map(g => {
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
      if(macroBody.length === 0) {
        return macroHead;
      } else {
        const fullMacro = macroHead+macroBody.reduce((acc, current) => acc+current)
        return fullMacro;
      }
    });

    // ---------------------------- Auto save -----------------------

    autorun(() => {
      this.loggedin ? this.fb.saveGroups(toJS(this.groups)) : null;
    });
  }
}
