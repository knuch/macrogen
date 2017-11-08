import React, { Component } from 'react';
import {observer} from 'mobx-react';
import './App.css';
import generator from './generator';

const App = observer(class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row h-100 text-center pt-5">
          <div className="col-8 d-none d-md-block"></div>
          <div className="col-md-6">
            <div className="controls">
              <div className="btn-group">
                <button onClick={generator.addGroup()} className="btn btn-success">Add a group</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <textarea className="form-control">

            </textarea>
          </div>
        </div>
      </div>
    );
  }
});

export default App;
