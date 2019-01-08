//import {computedFrom} from 'aurelia-framework';
// import {ipcRenderer} from 'electron';
import {inject} from 'aurelia-framework';
import {CaptureConfig} from './config';
import {CaptureServer} from './server';
import {CaptureClient} from './client';

@inject(CaptureConfig, CaptureServer, CaptureClient)
export class CaptureIndex {
  heading = 'Target/Real Time Simulator';

  constructor(captureConfig, captureServer, captureClient) {
    this.captureConfig = captureConfig;
    this.captureServer = captureServer;
    this.captureClient = captureClient;
  }

  toggleCaputreClient() {
    if (this.captureClient.isListening) {
      this.captureClient.stop();
    } else {
      this.captureClient.start();
    }
  }

  toggleCaputreServer() {
    if (this.captureServer.isEnabled) {
      this.captureServer.stop();
    } else {
      this.captureServer.start();
    }
  }

  get isNotLocalhost() {
    return !(this.captureConfig.host === 'localhost' || this.captureConfig.host === '127.0.0.1');
  }
}
