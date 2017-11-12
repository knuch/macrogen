import React, { Component } from 'react';
import { inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';

class Login extends Component {
  render() {
    const { s } = this.props;
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
          <div className="jumbotron">
            <h1 className="display-3">{s.home.title}</h1>
            {
              s.getLanguage() === 'fr'
            ?
              <span>
                <p className="lead">Macrogen est un outil vous permettant de <b>créer et sauvegarder</b> vos <b>macros</b> pour la plateforme <b>Roll20</b> (<a href="https://roll20.net" target="_blank">Site officiel</a>). Amis du jeux de rôle en ligne, cet outil vous facilitera la vie, MJ comme joueurs!</p>
                <p>Bon jeu à tous!</p>
              </span>
            :
              <span>
                <p className="lead">Macrogen is a tool that allows you to <b>create, generate and save</b> your <b>macros</b> for the <b>Roll20</b> platform (<a href="https://roll20.net" target="_blank">Official website</a>). Friends of online roleplaying, This tool will ease your life and make it a breeze to manage your NPCs and PCs Marcos! Please enjoy using the tool, GM and Players alltogether!</p>
                <p>May your adventures be filled with good moments</p>
              </span>
            }
            <hr className="my-4" />
            <p>{s.home.subtext}</p>
            <p>{s.home.or_try} <a className="btn btn-primary" href="#" role="button">Utiliser Macrogen sans compte</a></p>
          </div>
          </div>
          <div className="col-md-4">
          <div className="card p-4" id="login_form">
              <h3 className="mb-3">{s.login.title}</h3>
              <div className="form-group">
                <label for="email">{s.login.username}</label>
                <input type="email" className="form-control" id="email" placeholder={s.login.username_placeholder} />
              </div>
              <div className="form-group">
                <label for="pwd">{s.login.password}</label>
                <input type="password" className="form-control" id="pwd" placeholder={s.login.password_placeholder} />
              </div>
              <button className="btn btn-success btn-block"><FontAwesome name="plug mr-3"/>{s.login.submit}</button>
              <button className="btn btn-secondary btn-block"><FontAwesome name="plus mr-3"/>{s.login.register}</button>
              <hr/>
              <button className="btn btn-danger btn-block"><FontAwesome name="google mr-3"/>{s.login.google}</button>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default inject('s')(Login);
