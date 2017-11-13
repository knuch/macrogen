import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import RollGroup from '../RollGroup';
import FormEntry from '../FormEntry';
import { Link } from 'react-router-dom';
import './MacroForm.css';

class MacroForm extends Component {
  constructor() {
    super();
    this.state = {
      macroCopied: false,
      selectedRow: false,
    }
  }

  componentWillMount() {
    // reset state of macrocopied when something is changed in the macro
    // test not to reset when macroCopied is already false
    observe(this.props.app.macro, () => {
      if(this.state.macroCopied) {
        this.setState({macroCopied: false})
      } });
    }

    selectRow(group) {
      this.setState({
        selectedRow: group
      })
    }

    render() {
      const { app, s } = this.props;
      return (
        <div className="container-fluid">
          <div className="row h-100">
            {
              app.loggedin ? null :
              <div className="col-12">
                <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert"><FontAwesome name="user-times fa-lg"/> {s.generator.logged_out} <Link to="/" className="btn btn-info"><FontAwesome name="sign-in" /> {s.generator.connect}</Link>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          }
          <div className="textarea-zone col-md-6">
            <div className="card mb-4">
              <h3 className="card-header">{s.form.parameters}</h3>
              <div className="card-body">
                <div className="row">
                  <div className="form-group col-6">
                    <p className="mb-0">{s.form.template}</p>
                    <input className="form-control" onChange={(e) => app.setTemplate(e)} type="text" value={app.template}/>
                  </div>
                  <div className="form-group col-6">
                    <p className="mb-0">{s.form.title}</p>
                    <input className="form-control" type="text" placeholder={s.form.title} value={app.name} onChange={(e) => app.setName(e)}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview text-left mb-4">
              <div className="card">
                <input type="text" className="card-header py-1" value={app.name} onChange={e => app.setName(e)} />
                <ul className="list-group list-group-flush">
                  { app.groups.map(group => {
                    const classes = this.state.selectedRow.id === group.id
                    ? 'list-group-item macro-line py-1 pr-5 active'
                    : 'list-group-item macro-line py-1 pr-5';
                    return (
                      <li className={classes} onClick={() => this.selectRow(group)} key={`preview-group-${group.id}`}>
                        {
                          group.entries
                          ?
                          group.entries.map(e => {
                            switch(e.type) {
                              case 'text':
                              return e.args.value+' ';
                              break;
                              case 'roll':
                              return (
                                <span className="roll" key={`preview-entry-${e.id}`}>{e.args.dice} </span>
                              )
                              break;
                            }
                          })
                          : s.generator.empty }
                          <span className="btn btn-danger btn-preview-delete">
                            <FontAwesome name="trash" onClick={(e) => {e.stopPropagation();alert('delete')}}/>
                          </span>
                        </li>
                      );
                    }) }
                    <li className="list-group-item">
                      <button onClick={() => app.addGroup()} className="btn btn-primary btn-block"><FontAwesome name="plus" /> {s.form.addLine}</button>
                    </li>
                  </ul>
                </div>
              </div>
              <hr className="my-5"/>
              <textarea className="form-control" value={app.macro} readOnly>
              </textarea>
              <CopyToClipboard text={app.macro}
                onCopy={() => this.setState({macroCopied: true})}>
                <button className="btn btn-secondary btn-block mt-3"><FontAwesome name="clipboard"/> {s.generator.copy}</button>
              </CopyToClipboard>
              {
                this.state.macroCopied
                ?
                <div className="check txt-primary alert alert-success mt-3">
                  <FontAwesome name='check' /> {s.generator.copied}
                </div>
                : null
              }
            </div>

            {/*  Left part with detailed row controls */}

            <div className="col-md-6 text-left">
              {
                this.state.selectedRow
                ?
                <div className="selected-row-container">
                  <div className="row">
                    {
                      this.state.selectedRow.entries
                      ?
                      this.state.selectedRow.entries.map(entry =>
                        <FormEntry entry={entry} key={entry.id} group={this.state.selectedRow} />)
                        : null
                      }
                      <div className="col-12">
                        <div className="card mb-2">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-6">
                                <button className="btn btn-outline-secondary btn-dashed btn-lg btn-block" onClick={() => app.addEntry(this.state.selectedRow.id, 'text')}>{s.form.add_entry_text}</button>
                              </div>
                              <div className="col-6">
                                <button className="btn btn-outline-warning btn-dashed btn-lg btn-block" onClick={() => app.addEntry(this.state.selectedRow.id, 'roll')}>{s.form.add_entry_roll}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  :
                  <div className="col-12">
                    <div className="card mb-2">
                      <div className="card-body">
                        <div className="text-muted">
                          <h2>Aucune ligne sélectionnée</h2>
                          <p>Sélectionnez une ligne dans la colonne de gauche pour éditer ses détails</p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              {/* <div className="col-md-6 text-left d-none">
              <div className="controls row">

              <button onClick={() => app.addGroup()} className="btn btn-success">Add a group</button>
            </div>
            <div className="groups mt-4 d-flex flex-direction-column flex-wrap">
            {app.groups.map(group => <RollGroup key={`group-${group.id}`} args={group.args} group={group} app={app} />)}
          </div>
        </div> */}
      </div>
    </div>
  );
}
}

export default inject('app', 's')(observer(MacroForm));
