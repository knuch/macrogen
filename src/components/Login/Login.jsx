import React, { Component } from 'react';
import { inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

class Login extends Component {

  state = {
    login: '',
    pwd: '',
    error: false
  }

  handleRegister = () => {
    this.props.app.handleRegister(this.state)
    .then(res => {
      if(res.email) {
        this.setState({
          error: false
        });
      }
    })
    .catch(error => {
      this.setState({
        error: error
      });
    });
  }

  handleGoogleLogin() {
    this.props.app.handleGoogleLogin();
  }

  handleClassicLogin() {
    // TODO: handle login
  }

  handleLoginChange(e) {
    this.setState({
      login: e.target.value
    });
  }

  handlePwdChange(e) {
    this.setState({
      pwd: e.target.value
    });
  }

  render() {
    const { s, fb, app } = this.props;
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="jumbotron py-4">
              <h1 className="display-3">{s.home.title}</h1>
              <h1> 🎲 🖥 ⚔️ 🐲 </h1>
              {
                s.getLanguage() === 'fr'
                ?
                <span>
                  <p className="lead">Macrogen est un outil qui te permettra de <b>créer et sauvegarder</b> tes <b>macros</b> pour la plateforme <b>Roll20</b> (<a href="https://roll20.net" target="_blank">Site officiel</a>). MJ ou joueur, créer des macros pour tes personnages favoris n'aura jamais été aussi simple!</p>
                </span>
                :
                <span>
                  <p className="lead">Macrogen is a tool that allows you to <b>create, generate and save</b> your <b>macros</b> for the <b>Roll20</b> platform (<a href="https://roll20.net" target="_blank">Official website</a>). Friends of online roleplaying, This tool will ease your life and make it a breeze to manage your NPCs and PCs Marcos! Please enjoy using the tool, GM and Players alltogether!</p>
                </span>
              }
              <hr className="my-4" />
              <p>{s.home.subtext}</p>
              <p>{s.home.or_try} <Link className="btn btn-primary ml-1" to="/generator" role="button">{s.home.no_account}</Link></p>
              <hr/>
              <p className="lead">{s.home.happy_gaming}</p>
            </div>
          </div>
          {
            app.loggedin
            ?
            <div className="col-md-4">
              <div className="card p-4">
                <h4>{s.login.loggedin_as}</h4>
                <p><FontAwesome name="envelope"/> <b>{app.user.email}</b></p>
                <button className="btn-block btn btn-danger" onClick={() => app.handleLogout()}>{s.login.logout}</button>
              </div>
              <div className="card p-4 mt-4">
                <Link to='/generator' className="btn btn-success btn-lg"><FontAwesome name="arrow-circle-right"/>   {s.login.go_to_generator}</Link>
              </div>
            </div>
            :
            <div className="col-md-4">
              <div className="card p-4" id="login_form">
                <h3 className="mb-3">{s.login.title}</h3>
                {
                  this.state.error
                  ? <p className="alert alert-danger"><b>{this.state.error.code}</b> - {this.state.error.message}</p>
                  : null
                }
                <div className="form-group">
                  <label htmlFor="email">{s.login.username}</label>
                  <input type="email" value={this.state.login} onChange={e => this.handleLoginChange(e)} className="form-control" id="email" placeholder={s.login.username_placeholder} />
                </div>
                <div className="form-group">
                  <label htmlFor="pwd">{s.login.password}</label>
                  <input type="password" value={this.state.pwd}  onChange={e => this.handlePwdChange(e)} className="form-control" id="pwd" placeholder={s.login.password_placeholder} />
                </div>
                <button className="btn btn-success btn-block" onClick={() => this.handleClassicLogin()}><FontAwesome name="plug mr-3"/>{s.login.submit}</button>
                <button className="btn btn-secondary btn-block" onClick={() => this.handleRegister()}><FontAwesome name="plus mr-3"/>{s.login.register}</button>
              </div>
              <div className="card p-4 mt-4" id="login_form_google">
                <button className="btn btn-danger btn-block" onClick={() => this.handleGoogleLogin()}><FontAwesome name="google mr-3"/>{s.login.google}</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default inject('s', 'app', 'fb')(Login);
