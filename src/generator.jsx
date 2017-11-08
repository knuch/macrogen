import {extendObservable, action} from 'mobx';
import moment from 'moment';

class Generator {

  constructor() {

    extendObservable(this, {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    
  }

  @action addGroup() => {
    alert('added');
  });



}

export default Generator;
