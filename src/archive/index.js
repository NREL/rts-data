import {remote} from 'electron';
import {inject} from 'aurelia-framework';
const dialog = remote.dialog;
import fs from 'fs';
import {RelayConfig} from '../relay/config';
import {FileSubscriber} from './fileSubscriber';
import * as _ from 'lodash';
import {NotificationManager} from '../notifications/notification-manager';

import $ from 'jquery';
import 'select2';

@inject(RelayConfig, FileSubscriber, NotificationManager)
export class ArchiveIndex {
  heading = 'Archive';
  projects = [];
  datasets = [];
  selectedProject;
  selectedDataset;
  loadingProjects = false;
  loadingDatasets = false;

  constructor(relayConfig, fileSubscriber, notificationManager) {
    this.relayConfig = relayConfig;
    this.fileSubscriber = fileSubscriber;
    this.notificationManager = notificationManager;
  }

  toggleSubscriber() {
    if (this.fileSubscriber.isEnabled) {
      this.fileSubscriber.stop();
      this.closeStream();
    } else {
      this.prepareFile();
      this.fileSubscriber.start();
    }
  }

  directoryOpen() {
    dialog.showSaveDialog((fileName) => {
      if (!fileName) {
        return;
      }
      this.fileSubscriber.fileName = fileName;
      fs.writeFileSync(this.fileSubscriber.fileName, '', {flag: 'w'});
    });
  }

  prepareFile() {
    this.streamReady = false;
    this.stream = fs.createWriteStream(this.fileSubscriber.fileName);
    this.stream.on('open', (fd) => {
      this.fileDescriptor = fd;
      this.streamReady = true;
    });
    this.stream.on('close', (fd) => {
      this.fileDescriptor = null;
      this.streamReady = false;
    });
    this.stream.on('error', (error) => {
      console.error(error);
    });

    this.fileSubscriber.writeStream = this.stream;
  }

  closeStream() {
    this.stream.end('\n');
  }
}
