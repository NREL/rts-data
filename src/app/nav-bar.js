import {computedFrom, bindable, inject} from 'aurelia-framework';
import {AppConfig} from './config';
import {NotificationManager} from '../notifications/notification-manager';

@inject(AppConfig, NotificationManager)
export class NavBar {
  @bindable router;
  navMenuIsActive = false;

  constructor(appConfig, notificationManager) {
    this.appConfig = appConfig;
    this.notificationManager = notificationManager;
  }

  /**
   * TODO: more mobile work
   */
  toggleNavMenu(force = false) {
    this.navMenuIsActive = force || !this.navMenuIsActive;
  }

}
