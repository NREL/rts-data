import * as _ from 'lodash';
import {BindingSignaler} from 'aurelia-templating-resources';
import {inject, observable} from 'aurelia-framework';

@inject(BindingSignaler)
export class NotificationManager {
  @observable notifications = [
    // {message: 'hello, world', status: 'info'},
    // {message: '90000 Error', status: 'info', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'}
  ];

  constructor(signaler) {
    this.signaler = signaler;
  }

  deleteNotification(index) {
    _.pullAt(this.notifications, index);
  }

  addSuccess(message) {
    this.notifications.push({message: message, status: 'success'});
  }

  addError(message, options = {}) {
    this.notifications.push({message: message, status: 'danger', stack: options.stack});
  }

  addFetchError(error) {
    this.notifications.push({message: error.message, status: 'danger', description: error.description});
  }
}
