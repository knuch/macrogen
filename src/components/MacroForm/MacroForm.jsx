import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import RollGroup from '../RollGroup';

class MacroForm extends Component {
  constructor() {
    super();
    this.state = {
      macroCopied: false,
    }
  }
  render() {
    const { app, fb } = this.props;
    observe(app.macro, () => { this.setState({macroCopied: false}) });
    return (
      <div className="container">
        <div className="row h-100 text-center pt-5">
          <div className="col-12">
          </div>
          <div className="col-8 d-none d-md-block"></div>
          <div className="col-md-8 text-left">
            <div className="controls row">
              <div className="form-group col-6">
                <p className="mb-0">Template</p>
                <input className="form-control" onChange={(e) => app.setTemplate(e)} type="text" value={app.template}/>
              </div>
              <div className="form-group col-6">
                <p className="mb-0">Name</p>
                <input className="form-control" type="text" value={app.name} onChange={(e) => app.setName(e)}/>
              </div>
              <button onClick={() => app.addGroup()} className="btn btn-success">Add a group</button>
            </div>
            <div className="groups mt-4 d-flex flex-direction-column flex-wrap">
              {app.groups.map(group => <RollGroup key={`group-${group.id}`} args={group.args} group={group} app={app} />)}
            </div>
          </div>
          <div className="textarea-zone col-md-4">
            <div className="clipboard-alert">
              { this.state.macroCopied ?
                <h4 className="alert alert-success mt-3"><FontAwesome name='check-circle-o' /> This macro has been copied to your clipboard</h4>
                :
                null
              }
            </div>
            {
              this.state.macroCopied
              ?
              <div className="check txt-primary alert alert-success">
                <FontAwesome name='check' />
              </div>
              : null
            }
            <CopyToClipboard text={app.macro}
              onCopy={() => this.setState({macroCopied: true})}>
              <textarea className="form-control" value={app.macro} readOnly>
              </textarea>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('app', 'fb')(observer(MacroForm));
