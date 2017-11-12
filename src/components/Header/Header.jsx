import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
  render() {
    const { s, app } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2">
        <Link className="navbar-brand" to="/">{s.brand}</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className={app.currentLocation === '/' ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to='/'>{s.menu.home}</Link>
            </li>
            <li className={app.currentLocation === '/generator' ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to='/generator'>{s.menu.generator}</Link>
            </li>
            {/* <li className={app.currentLocation === '/about' ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link" to='/about'>{s.menu.about}</Link>
            </li> */}
          </ul>
          <span className="navbar-text">
              <a href="https://github.com/knuch/macrogen" target="_blank" rel="noopener noreferrer" className="github btn btn-secondary mr-2"><FontAwesome name="github" /></a>
              <a href="https://www.paypal.me/knuch/" target="_blank" rel="noopener noreferrer" className="btn btn-primary"><FontAwesome name="paypal" /> {s.menu.donate}</a>
          </span>
        </div>
      </nav>
    );
  }
}

export default inject('app','s')(observer(Header));
