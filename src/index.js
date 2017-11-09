import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import Generator from './generator';

const generator = new Generator();
ReactDOM.render(
  <Provider generator={generator} >
    <App />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
