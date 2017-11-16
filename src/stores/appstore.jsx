import {extendObservable, action, computed, autorun, observable, toJS, isObservable, whyRun} from 'mobx';
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
      this.fb.setUserDatabase(user).then(() => {
        this.user = user;
        this.fb.userRef.once('value').then( snap => {
          const baseGroup =observable([{
            id: new Date().valueOf(),
            title: this.s.form.my_macros,
            macros: []
          },]);
          this.groups = snap.child('groups').val() || baseGroup;

          //initialise empty arrays
          this.groups.map(group => {
            if (group && !group.macros) extendObservable(group, {macros: []});
          });
          console.log(this.groups);
          this.loggedin = true;
          this.setLoading(false);
          if (redirect) this.history.push('/my-macros');
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
      if (this.loggedin) {
        const group = this.findGroup(groupId);
        // dynamic observableArray declaration
        // As empty arrays are not persisted to firebase
        if (group && !group.macros) extendObservable(group, {macros: []});
        this.currentGroup = group;
      } else {
        this.currentGroup = this.groups[0];
      }
    });

    this.setCurrentMacro = action((groupId ,macroId) => {
      if (this.loggedin) {
        const macro = this.findMacro(groupId, macroId);
        // dynamic observableArray declaration
        // As empty arrays are not persisted to firebase
        if (!macro.rows) extendObservable(macro, {rows: []});
        this.currentMacro = macro;
      } else {
        this.addMacro(this.currentGroup.id);
        this.currentMacro = this.currentGroup.macros[0]
      }
    });

    this.setCurrentRow = action(rowId => {
      const row = this.findRow(this.currentGroup.id, this.currentMacro.id, rowId);
      // dynamic observableArray declaration
      // As empty arrays are not persisted to firebase
      if (row && !row.entries) extendObservable(row, {entries: []});
      this.currentRow = row;
    });

    // ---------------------------- Add -----------------------

    this.addGroup = action(() => {
      const group = {
        id: new Date().valueOf(),
        macros: observable([]),
        title: 'Group title'
      }
      this.groups.push(group);
    });

    this.addMacro = action((groupId) => {
      const group = this.findGroup(groupId);
      const macro = {
        id: new Date().valueOf(),
        title: this.s.form.my_macro,
        template: 'default',
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
      if (macro && !macro.rows) extendObservable(macro, {rows: []});
      macro.rows.push(row);
    });

    this.addEntry = action((type) => {
      const groupId = this.currentGroup.id;
      const macroId = this.currentMacro.id;
      const rowId = this.currentRow.id;
      const row = this.findRow(groupId, macroId, rowId);
      const id = new Date().valueOf();
      switch(type) {
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
      if(this.currentRow && row.id === this.currentRow.id) this.setCurrentRow(false);
      macro.rows.remove(row);
    });

    this.deleteEntry = action((entry) => {
      this.currentRow.entries.remove(entry);
    });

    // ---------------------------- Getters and Setters -----------------------

    this.setItemTitle = action((item, text) => {
      item.title = text;
    });

    this.setArg = action((object, value, key) => {
      object[key] = value;
    });

    this.setEntryArg = action('setEntryArg', (object, value, key) => {
      object['args'][key] = value;
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

    this.macro = observable(computed (() => {
      const m = this.currentMacro;
      if (!m) return false;
      const macroHead = `&{template:${m.template}}{{name=${m.title}}}`;
      const macroBody = m.rows.map(row => {
        const entriesValues = row.entries
        ?
        row.entries.map(entry => {
          const a = entry.args;
          switch(entry.type) {
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
    }));

    // ---------------------------- Auto save -----------------------

    autorun(() => {
      const trigger = toJS(this.currentMacro)+toJS(this.currentGroup)+toJS(this.currentRow);
      this.loggedin ? this.fb.saveGroups(toJS(this.groups)) : null;
    });
  }
}
