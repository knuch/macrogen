import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import { observe } from 'mobx';
import './App.css';
import RollGroup from './rollGroup';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FontAwesome from 'react-fontawesome';
import Firebase from './firebase'

class App extends Component {

  constructor(props) {
    super(props);
    const firebase = new Firebase();
    this.state = {
      db: firebase,
      macroCopied: false,
    }
  }

  render() {
    const { generator } = this.props;
    observe(generator.macro, () => { this.setState({macroCopied: false}) });
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
                <input className="form-control" onChange={(e) => generator.setTemplate(e)} type="text" value={generator.template}/>
              </div>
              <div className="form-group col-6">
                <p className="mb-0">Name</p>
                <input className="form-control" type="text" value={generator.name} onChange={(e) => generator.setName(e)}/>
              </div>
              <button onClick={() => generator.addGroup()} className="btn btn-success">Add a group</button>
            </div>
            <div className="groups mt-4 d-flex flex-direction-column flex-wrap">
              {generator.groups.map(group => <RollGroup key={`group-${group.id}`} args={group.args} group={group} generator={generator} />)}
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
            <CopyToClipboard text={generator.macro}
              onCopy={() => this.setState({macroCopied: true})}>
              <textarea className="form-control" value={generator.macro} readOnly>
              </textarea>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
};

export default inject('generator')(observer(App));
