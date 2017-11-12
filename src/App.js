import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter, Route } from 'react-router-dom';
import MacroForm from './components/MacroForm';
import Login from './components/Login';

export default class App extends Component {
  render() {
    const { app } = this.props
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
  }
};
