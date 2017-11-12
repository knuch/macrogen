import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import Alert from './Alert.jsx';

class AlertManager extends Component {
  render() {
    const { app } = this.props
    const { alerts } = app;
    const renderedAlerts = alerts.map((alert, index) => <Alert alert={alert} key={`alert-${index}`} />)
    return (
      <div className="alerts container-fluid">
        { renderedAlerts }
      </div>
    );

    return null;
  }
}

export default inject('app')(observer(AlertManager));
