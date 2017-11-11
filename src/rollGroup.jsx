import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';

class RollGroup extends Component {
  render() {
    const { args, group, generator } = this.props;
    const groupName= `group-${group.id}`;
    return (
      <fieldset className="form-group row col-12">
        <hr/>
        {/* <select onChange={(e) => generator.setGroupType(e, group)} className="form-control mb-2" name="asdf" id="asdf" value={group.type}>
        <option value="text">text</option>
        <option value="roll">roll</option>
      </select> */}
      { group.type === 'roll'
      ?
      <div className="row">
        <h2 className="col-12">{group.label}</h2>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="your dice roll (1d20)" value={args.dice} onChange={(e) => generator.setGroupArg(e, group, 'dice')}></input>
        </div>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="bonus to add (5, STR)" value={args.bonus} onChange={(e) => generator.setGroupArg(e, group, 'bonus')}></input>
        </div>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="crit min value (default: 20)" value={args.cs} onChange={(e) => generator.setGroupArg(e, group, 'cs')}></input>
        </div>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="fumble max value (default: 1)" value={args.cf} onChange={(e) => generator.setGroupArg(e, group, 'cf')}></input>

        </div>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="text before" value={args.txtbefore} onChange={(e) => generator.setGroupArg(e, group, 'txtbefore')}></input>
        </div>
        <div className="col-6">
          <input type="text" className="form-control mb-2" name={groupName} placeholder="text after" value={args.txtafter} onChange={(e) => generator.setGroupArg(e, group, 'txtafter')}></input>
        </div>
      </div>
      :
      null
    }
    { group.type === 'text'
    ?
    <div>
      <p className="mb-0">{group.type}</p>
      <input type="text" className="form-control" name={groupName}></input>
    </div>
    :
    null
  }
  <hr/>
</fieldset>
)
}
}

export default observer(RollGroup);