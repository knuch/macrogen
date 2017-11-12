import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';

class AlertManager extends Component {
  render() {
    return null;
  }
}

export default inject('s')(observer(AlertManager));
