import React from 'react';
import FontAwesome from 'react-fontawesome';

export default ({alert}) => {
  return (
      <div className="mb-0 pl-3 pr-3">
        <div className={`alert mb-0 mt-4 alert-${alert.type}`}>
          {
            alert.icon
            ? <FontAwesome name={`${alert.icon} mr-2`} />
            : null
          }
          <span>{alert.msg}</span>
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
        </div>
      </div>
  );
}
