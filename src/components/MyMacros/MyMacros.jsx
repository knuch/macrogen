import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import './MyMacros.css';

class MyMacros extends Component {
  constructor() {
    super();
  }

  renderMacro(macro, group) {
    const { s, app } = this.props;
    return (
      <div key={macro.id} className="col-md-4 macro mb-3">
          <input type="text" className="bg-purple form-control text-white pr-5" value={macro.title} onChange={(e) => app.setItemTitle(macro, e.target.value)}/>
          <Link className="btn btn-edit btn-link px-2" to={`/my-macros/${group.id}/${macro.id}`} ><FontAwesome name="pencil"/></Link>
          <button className="btn btn-delete btn-link px-2" type="button" onClick={() => app.deleteMacro(macro, group.id)}><FontAwesome name="trash"/></button>
      </div>
    );
  }

  render() {
    const { s, app } = this.props;
    return (
      <div className="container groups-container">
        { app.groups.map(group =>
          <div className="macro-group mb-5" key={group.id}>
            <nav className="navbar navbar-light bg-purple">
              <span className="navbar-brand mb-0 h1 text-white">{group.title}</span>
            </nav>
            <div className="row macros-container mt-3">
              { group.macros
                ?
                group.macros.map(macro => this.renderMacro(macro, group))
                : null }
              <div className="col-4">
                <button onClick={() => app.addMacro(group.id)} className="btn btn-lg btn-outline-secondary border-dashed d-block w-100 mb-3"><FontAwesome name="plus-circle" /> {s.form.add_macro}</button>
              </div>
            </div>
          </div>
        ) }
        <div className="row pb-5">
          <div className="col-12">
            <hr className="mt-2 mb-4"/>
            <button onClick={() => app.addGroup()} className="btn btn-outline-success btn-dashed btn-lg"><FontAwesome name="plus-circle" />  {s.form.add_group}</button>
          </div>
        </div>

      </div>
    );
  }
}

export default inject('app', 's')(observer(MyMacros));
