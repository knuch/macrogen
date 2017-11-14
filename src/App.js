import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import { Router, Route, Switch } from 'react-router-dom';
import MacroForm from './components/MacroForm';
import MyMacros from './components/MyMacros';
import Login from './components/Login';
import { observer, inject } from 'mobx-react';
import About from './components/About';
import NotFound from './components/NotFound'
import AlertManager from './components/AlertManager'
import FontAwesome from 'react-fontawesome';

class App extends Component {
  render() {
    const { app, s, history } = this.props;
    return (
        <Router history={history}>
          <div className="app">
            <Header />
            <AlertManager />
            <div className="container-fluid pt-4">
              {
                app.loading
                ?
                  <div className="app-loading text-center">
                    <div className="card d-inline-block p-5" style={{marginTop: '15vh'}}>
                      <h1><FontAwesome name='circle-o-notch fa-spin'/></h1>
                      <h1>{s.loading}</h1>
                    </div>
                  </div>
                :
                <Switch>
                  <Route exact path='/my-macros' component={MyMacros}/>
                  <Route exact path='/my-macros/:group/:macro' component={MacroForm}/>
                  <Route exact path='/generator' component={MacroForm}/>
                  <Route exact path='/about' component={About}/>
                  <Route exact path='/' component={Login}/>
                  <Route path='/' component={NotFound}/>
                </Switch>
              }
            </div>
          </div>
        </Router>
    );
  }
};

export default inject('app', 's')(observer(App));
