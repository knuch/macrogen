import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

class Header extends Component {
  render() {
    const { s } = this.props;
    console.log(s.getLanguage());
    return s.header;
  }
}

export default inject('app','s')(observer(Header));
