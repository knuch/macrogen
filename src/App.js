import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import { Router, Route, Switch } from 'react-router-dom';
import MacroForm from './components/MacroForm';
import Login from './components/Login';
import { observer, inject } from 'mobx-react';
import About from './components/About';
import NotFound from './components/NotFound'
import AlertManager from './components/AlertManager'

class App extends Component {
  render() {
    const { app, history } = this.props;
    return (
        <Router history={history}>
          <div className="app">
            <Header />
            <AlertManager />
            <div className="container-fluid pt-5">
              <Switch>
                <Route exact path='/generator' component={MacroForm}/>
                <Route exact path='/about' component={About}/>
                <Route exact path='/' component={Login}/>
                <Route path='/' component={NotFound}/>
              </Switch>
            </div>
          </div>
        </Router>
    );
  }
};

export default inject('app')(observer(App));
