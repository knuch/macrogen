import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
  }

  renderGroup(group, generator) {
    const name = `group-${group.id}`
    return (
      <fieldset className="form-group row col-12" key={name}>
        <hr/>
        {/* <select onChange={(e) => generator.setGroupType(e, group)} className="form-control mb-2" name="asdf" id="asdf" value={group.type}>
          <option value="text">text</option>
          <option value="roll">roll</option>
        </select> */}
        { group.type === 'roll'
        ?
        <div>
          <h2>{group.label}</h2>
          <input type="text" className="form-control mb-2" name={name} placeholder="your dice roll (1d20)" value={group.args.dice} onChange={(e) => generator.setGroupArg(e, group, 'dice')}></input>
          <input type="text" className="form-control mb-2" name={name} placeholder="bonus to add (5, STR)" value={group.args.bonus} onChange={(e) => generator.setGroupArg(e, group, 'bonus')}></input>
          <input type="text" className="form-control mb-2" name={name} placeholder="crit min value (default: 20)" value={group.args.cs} onChange={(e) => generator.setGroupArg(e, group, 'cs')}></input>
          <input type="text" className="form-control mb-2" name={name} placeholder="fumble max value (default: 1)" value={group.args.cf} onChange={(e) => generator.setGroupArg(e, group, 'cf')}></input>
          <input type="text" className="form-control mb-2" name={name} placeholder="text before" value={group.args.txtbefore} onChange={(e) => generator.setGroupArg(e, group, 'txtbefore')}></input>
          <input type="text" className="form-control mb-2" name={name} placeholder="text after" value={group.args.txtafter} onChange={(e) => generator.setGroupArg(e, group, 'txtafter')}></input>
        </div>
          :
          null
         }
         { group.type === 'text'
         ?
         <div>
           <p className="mb-0">{group.type}</p>
           <input type="text" className="form-control" name={name}></input>
         </div>
          :
          null
        }
        <hr/>
      </fieldset>
    )
  }

  render() {
    const { generator } = this.props;
    return (
      <div className="container">
        <div className="row h-100 text-center pt-5">
          <div className="col-8 d-none d-md-block"></div>
          <div className="col-md-6 text-left">
            <div className="controls">
              <div className="form-group">
                <p className="mb-0">Template</p>
                <input className="form-control" onChange={(e) => generator.setTemplate(e)} type="text" value={generator.template}/>
              </div>
              <div className="form-group">
                <p className="mb-0">Name</p>
                <input className="form-control" type="text" value={generator.name} onChange={(e) => generator.setName(e)}/>
              </div>
              <button onClick={() => generator.addGroup()} className="btn btn-success">Add a group</button>
            </div>
            <div className="groups mt-4 d-flex flex-direction-column flex-wrap">
              {generator.groups.map(group => this.renderGroup(group, generator))}
            </div>
          </div>
          <div className="textarea col-md-6">
            <textarea className="form-control" value={generator.macro} readOnly>
            </textarea>
          </div>
        </div>
      </div>
    );
  }
};

export default inject('generator')(observer(App));
