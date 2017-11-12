import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';

class Header extends Component {
  render() {
    const { s } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">{s.brand}</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Accueil <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
          </ul>
          <span className="navbar-text">
              <a href="https://www.paypal.me/knuch/" target="_blank" className="btn btn-primary"><FontAwesome name="paypal" /> Faire un don!</a>
          </span>
        </div>
      </nav>
    );
  }
}

export default inject('app','s')(observer(Header));
