import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import AppStore from './stores/appstore';
import Translations from './stores/translations';
import Firebase from './stores/firebase';
import { createBrowserHistory } from 'history';

const history = new createBrowserHistory();
const firebaseClass = new Firebase();
const appstore = new AppStore(firebaseClass, history);
ReactDOM.render(
  <Provider app={appstore} fb={firebaseClass} s={Translations} >
    <App app={appstore} history={history} />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
