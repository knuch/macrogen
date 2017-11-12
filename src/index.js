import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import Generator from './stores/generator';
import Translations from './stores/translations';
import Firebase from './stores/firebase';

const firebase = new Firebase(Translations.getLanguage());
const generator = new Generator(firebase);
ReactDOM.render(
  <Provider app={generator} fb={firebase} s={Translations} >
    <App app={generator} />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
