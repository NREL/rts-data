import {computedFrom, inject} from 'aurelia-framework';
import zmq from 'zeromq';
import {RelayConfig} from '../relay/config';
import {RelaySubscriber} from '../relay/subscriber';

@inject(RelayConfig)
export class FileSubscriber extends RelaySubscriber {
  fileName = '';

  constructor(relayConfig) {
    super(relayConfig);
  }

  get activeMessage() {
    return `Writing data to disk`;
  }

  onMessage(topic, message) {
    if (!this.writeStream) {
      return;
    }
    this.writeStream.write(`${JSON.parse(message)}\n`);
  }
}
