import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import Generator from './stores/generator';
import Translations from './stores/translations';

const generator = new Generator();
ReactDOM.render(
  <Provider app={generator} s={Translations} >
    <App app={generator} />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
