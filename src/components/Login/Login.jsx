import React, { Component } from 'react';
import { inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import firebase from 'firebase';

class Login extends Component {
  handleGoogleLogin() {
    firebase.auth().signInWithPopup(this.props.fb.auth)
    .then(res => {
      const token = res.credential.accessToken;
      const user = res.user;
      const email = user.email;
      const uid = user.uid;
      const name = user.displayName;
      this.props.fb.setUserDatabase(uid).then(() => {
        this.props.app.UserLoggedIn(user);
      });
    }
  );
}

render() {
  const { s, fb } = this.props;
  return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div className="jumbotron">
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
            <p>{s.home.or_try} <a className="btn btn-primary ml-1" href="#" role="button">Utiliser Macrogen sans compte</a></p>
            <hr/>
            <p className="lead">{s.home.happy_gaming}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4" id="login_form">
            <h3 className="mb-3">{s.login.title}</h3>
            <div className="form-group">
              <label htmlFor="email">{s.login.username}</label>
              <input type="email" className="form-control" id="email" placeholder={s.login.username_placeholder} />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">{s.login.password}</label>
              <input type="password" className="form-control" id="pwd" placeholder={s.login.password_placeholder} />
            </div>
            <button className="btn btn-success btn-block"><FontAwesome name="plug mr-3"/>{s.login.submit}</button>
            <button className="btn btn-secondary btn-block"><FontAwesome name="plus mr-3"/>{s.login.register}</button>
          </div>
          <div className="card p-4 mt-4" id="login_form_google">
            <button className="btn btn-danger btn-block" onClick={() => this.handleGoogleLogin()}><FontAwesome name="google mr-3"/>{s.login.google}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default inject('s', 'app', 'fb')(Login);
