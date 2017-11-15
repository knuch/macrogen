import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';

export default (props) => (
  <div className="row">
    <div className="col-12">
      <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert"><FontAwesome name="user-times fa-lg"/> {props.s.generator.logged_out} <Link to="/" className="btn btn-info"><FontAwesome name="sign-in" /> {props.s.generator.connect}</Link>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</div>
)
