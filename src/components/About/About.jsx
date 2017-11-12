import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';

class About extends Component {
  render() {
    return null;
  }
}

export default inject('s')(observer(About));
