import {inject} from 'aurelia-framework';
import {CaptureClient} from './capture/client';
import {CaptureServer} from './capture/server';
import {RelayPublisher} from './relay/publisher';
import {FileSubscriber} from './archive/fileSubscriber';
import {NotificationManager} from './notifications/notification-manager';

@inject(CaptureClient, CaptureServer, RelayPublisher, FileSubscriber, NotificationManager)
export class App {
  constructor(captureClient, captureServer, relayPublisher, fileSubscriber, notificationManager) {
    this.captureClient = captureClient;
    this.captureServer = captureServer;
    this.relayPublisher = relayPublisher;
    this.fileSubscriber = fileSubscriber;

    this.notificationManager = notificationManager;
  }

  configureRouter(config, router) {
    config.title = 'RTS Data';
    config.map([
      {
        route: ['', 'capture'],
        name: 'capture',
        moduleId: 'capture/index',
        nav: true,
        title: 'Target/RTS',
        settings: {
          module: this.captureClient
        }
      },
      {
        route: 'relay',
        name: 'relay',
        moduleId: 'relay/index',
        nav: true,
        title: 'Relay',
        settings: {
          module: this.relayPublisher
        }
      },
      {
        route: 'archive',
        name: 'archive',
        moduleId: 'archive/index',
        nav: true,
        title: 'Archive',
        settings: {
          module: this.fileSubscriber
        }
      }
    ]);

    this.router = router;
  }
}
