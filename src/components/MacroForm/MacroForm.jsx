import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import RollGroup from '../RollGroup';
import { Link } from 'react-router-dom';
import './MacroForm.css';

class MacroForm extends Component {
  constructor() {
    super();
    this.state = {
      macroCopied: false,
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

  render() {
    const { app, s } = this.props;
    return (
      <div className="container-fluid">
        <div className="row h-100 text-center">
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
        <div className="col-8 d-none d-md-block"></div>
        <div className="col-md-8 text-left">
          <div className="controls row">
            <div className="form-group col-6">
              <p className="mb-0">{s.form.template}</p>
              <input className="form-control" onChange={(e) => app.setTemplate(e)} type="text" value={app.template}/>
            </div>
            <div className="form-group col-6">
              <p className="mb-0">{s.form.title}</p>
              <input className="form-control" type="text" value={app.name} onChange={(e) => app.setName(e)}/>
            </div>
            <button onClick={() => app.addGroup()} className="btn btn-success">Add a group</button>
          </div>
          <div className="groups mt-4 d-flex flex-direction-column flex-wrap">
            {app.groups.map(group => <RollGroup key={`group-${group.id}`} args={group.args} group={group} app={app} />)}
          </div>
        </div>
        <div className="textarea-zone col-md-4">
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
      </div>
    </div>
  );
}
}

export default inject('app', 's')(observer(MacroForm));
