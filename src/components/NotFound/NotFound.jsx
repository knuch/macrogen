import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

class NotFound extends Component {
  render() {
    const { s } = this.props;
    return (
      <div className="container text-center">
        <div className="row">
          <div className="col-md-12">
            <div className="error-template">
              <h1>Oops!</h1>
                <h2>404 Not Found</h2>
                  <p className="error-details">
                    {s.error.text}
                  </p>
                  <div className="error-actions">
                    <Link to='/' className="btn btn-primary btn-lg"><FontAwesome name='home' /> {s.error.take_me_home}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    export default inject('s')(observer(NotFound));
