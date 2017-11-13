import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import './FormEntry.css';

class FormEntry extends Component {
  render() {
    const { entry, app, group, s } = this.props

    switch(entry.type) {
      case 'text':
      return (
        <div className="col-12">
          <div className="card mb-2">
            <div className="card-body">
              <h5>{s.form.text}</h5>
              <div className="form-inline row">
                <div className="col-12">
                  <div className="input-group">
                    <input type="text" className='form-control' value={entry.args.value} onChange={(e) => app.setEntryArg(e, group.id, entry.id, 'value' )} placeholder={s.form.text_placeholder}/>
                    <span className="input-group-btn">
                      <button className="btn btn-danger" type="button" onClick={ () => {alert('handle delete')} }><FontAwesome name="trash"/></button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
      case 'roll':
      const args = entry.args;
      return (
        <div className="col-12">
          <div className="card mb-2 bg-roll">
            <div className="card-body">
              <div className="row p-relative">
                <h5 className="col-12">{s.form.roll}</h5>
                <button className="btn btn-danger btn-danger-absolute" type="button" onClick={ () => {alert('handle delete')} }><FontAwesome name="trash"/></button>
                <div className="col-6 mb-2">
                  <div className="input-group">
                    <div className="input-group-addon">{s.form.dice}</div>
                    <input type="text" className="form-control" placeholder={s.form.dice_placeholder} value={args.dice} onChange={(e) => app.setEntryArg(e, group.id, entry.id, 'dice')}></input>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="input-group">
                    <div className="input-group-addon">{s.form.bonus}</div>
                    <input type="text" className="form-control" placeholder={s.form.bonus_placeholder} value={args.bonus} onChange={(e) => app.setEntryArg(e, group.id, entry.id, 'bonus')}></input>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="input-group">
                    <div className="input-group-addon">{s.form.cs}</div>
                    <input type="text" className="form-control" placeholder={s.form.cs_placeholder} value={args.cs} onChange={(e) => app.setEntryArg(e, group.id, entry.id, 'cs')}></input>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="input-group">
                    <div className="input-group-addon">{s.form.cf}</div>
                    <input type="text" className="form-control" placeholder={s.form.cf_placeholder} value={args.cf} onChange={(e) => app.setEntryArg(e, group.id, entry.id, 'cf')}></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    }
  }
}

export default inject('app', 's')(observer(FormEntry));
