import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import AppStore from './stores/appstore';
import trans from './stores/translations';
import Firebase from './stores/firebase';
import { createBrowserHistory } from 'history';

const pathname = window.location.pathname;
let basename = false;
if (pathname.indexOf('macrogen') >= 0) basename = '/macrogen';

const history = new createBrowserHistory({
  basename: basename
});
const firebaseClass = new Firebase();
const appstore = new AppStore(firebaseClass, history, trans);
ReactDOM.render(
  <Provider app={appstore} fb={firebaseClass} s={trans} >
    <App app={appstore} history={history} />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
