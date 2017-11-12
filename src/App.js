import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MacroForm from './components/MacroForm';
import Login from './components/Login';
import { observer, inject } from 'mobx-react'

const history = new createBrowserHistory();

class App extends Component {
  render() {
    const { app } = this.props;
    return (
        <Router history={history}>
          <div className="app">
            <Header />
              {
                app.loggedin
                ?
                  <div className="container-fluid">
                    <Route path='/' component={MacroForm}/>
                  </div>
                :
                  <div className="container-fluid pt-5">
                    <Login />
                  </div>
              }
          </div>
        </Router>
    );
  }
};

export default inject('app')(observer(App));
