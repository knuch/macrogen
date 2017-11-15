import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observe, extendObservable, computed, whyRun, autorun, toJS } from 'mobx';
import { observer, inject,} from 'mobx-react';
import RollGroup from '../RollGroup';
import FormEntry from '../FormEntry';
import { Link } from 'react-router-dom';
import LoggedOutAlert from './LoggedOutAlert.jsx';
import './MacroForm.css';

class MacroForm extends Component {
  constructor() {
    super();
    this.state = {
      macroCopied: false,
    }
  }

  componentWillMount() {
    // recover ids from the url and load corresponding macro and group
    const { macro, group } = this.props.match.params;
    this.props.app.setCurrentGroup(group);
    this.props.app.setCurrentMacro(group, macro);

    // reset state of macrocopied when something is changed in the macro
    // test not to reset when macroCopied is already false
    observe(this.props.app.macro, () => {
      this.macro = this.props.app.macro;
      if(this.state.macroCopied) {
        this.setState({macroCopied: false})
      }
    });
  }

  selectRow(row) {
    this.props.app.setCurrentRow(row.id)
  }

  deleteRow(e, row) {
    e.stopPropagation();
    const { app } = this.props;
    app.deleteRow(row, app.currentGroup.id, app.currentMacro.id);
  }

  focusTitle() {
    const input = this.refs.titleInput;
    input.setSelectionRange(input.value.length, input.value.length);
    input.focus();
  }

  render() {
    const { app, s } = this.props;
    const currentGroup = app.currentGroup;
    const currentMacro = app.currentMacro;
    const currentRow = app.currentRow;
    const trigger = toJS(this.props.app.currentMacro);
    return (
      <div className="content container-fluid px-4">
        <div className="row">
          <div className="col-12">
            { app.loggedin
              ?
              <div className="mb-4">
                <Link to='/my-macros' className="btn-primary btn text-white"><FontAwesome name="arrow-left"/> {s.menu.my_macros}</Link>
              </div>
              :
              <LoggedOutAlert s={s} /> }
            </div>
            <div className="textarea-zone col-md-6">
              <div className="card mb-4">
                <h3 className="card-header">{s.form.parameters}</h3>
                <div className="card-body">
                  <div className="row">
                    <div className="form-group col-12">
                      <p className="mb-0">{s.form.template}</p>
                      <input className="form-control" onChange={(e) => app.setArg(currentMacro, e.target.value, 'template')} type="text" value={currentMacro.template}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="preview text-left mb-5">
                <div className="card p-relative">
                  <button className="btn btn-link edit-label text-white" onClick={() => this.focusTitle()}><FontAwesome name="pencil" /></button>
                  <input type="text" className="card-header py-1" placeholder={s.form.title} value={currentMacro.title} onChange={(e) => app.setArg(currentMacro, e.target.value, 'title')} ref="titleInput" />
                  <ul className="list-group list-group-flush">
                    { currentMacro.rows.map(row => {
                      const classes = (app.currentRow ? app.currentRow.id : false) === row.id
                      ? 'list-group-item macro-line py-1 pr-5 active'
                      : 'list-group-item macro-line py-1 pr-5';
                      return (
                        <li className={classes} onClick={() => this.selectRow(row)} key={`preview-row-${row.id}`}>
                          {
                            row.entries
                            ?
                            row.entries.map(e => {
                              switch(e.type) {
                                case 'text':
                                return e.args.value+' ';
                                break;
                                case 'roll':
                                return (
                                  <span className="roll mr-1" key={`preview-entry-${e.id}`}>{e.args.dice} </span>
                                )
                                break;
                              }
                            })
                            : s.generator.empty }
                            <span className="btn btn-danger btn-preview-delete">
                              <FontAwesome name="trash" onClick={(e) => this.deleteRow(e, row)}/>
                            </span>
                          </li>
                        );
                      }) }
                      <li className="list-group-item">
                        <button onClick={() => app.addRow(currentGroup.id, currentMacro.id)} className="btn btn-primary btn-block"><FontAwesome name="plus" /> {s.form.addLine}</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <hr className="my-5"/>
                <textarea className="form-control" value={this.props.app.macro} readOnly>
                </textarea>
                {
                  this.state.macroCopied
                  ?
                  <div className="check txt-primary alert alert-success mt-3">
                    <FontAwesome name='check' /> {s.generator.copied}
                  </div>
                  :
                  <CopyToClipboard text={app.macro}
                    onCopy={() => this.setState({macroCopied: true})}>
                    <button className="btn btn-secondary btn-block mt-3"><FontAwesome name="clipboard"/> {s.generator.copy}</button>
                  </CopyToClipboard>
                }
              </div>

              {/*  Left part with detailed row controls */}

              <div className="col-md-6 text-left">
                {
                  app.currentRow
                  ?
                  <div className="selected-row-container">
                    <div className="row">
                      {
                        app.currentRow.entries
                        ?
                        app.currentRow.entries.map(entry =>
                          <FormEntry entry={entry} key={entry.id} row={app.currentRow} />)
                          : null
                        }
                        <div className="col-12">
                          <div className="card mb-2">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-6">
                                  <button className="btn btn-outline-secondary btn-dashed btn-block" onClick={() => app.addEntry('text')}>{s.form.add_entry_text}</button>
                                </div>
                                <div className="col-6">
                                  <button className="btn btn-outline-warning btn-dashed btn-block" onClick={() => app.addEntry('roll')}>{s.form.add_entry_roll}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    :
                    <div className="card mb-2">
                      <div className="card-body">
                        <div className="text-muted">
                          <h2>{s.form.no_line_selected}</h2>
                          <p>{s.form.no_line_detail}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          );
        }
      }

      export default inject('app', 's')(observer(MacroForm));
