import {computedFrom, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import zmq from 'zeromq';
import {RelayConfig} from './config';

@inject(EventAggregator, RelayConfig)
export class RelayPublisher {
  status = 'disabled';
  messagesSent = 0;
  bytesSent = 0;

  constructor(eventAggregator, relayConfig) {
    this.ea = eventAggregator;
    this.relayConfig = relayConfig;
  }

  get activeMessage() {
    return `Publishing to ${this.relayConfig.host}:${this.relayConfig.publisherPort} "${this.relayConfig.topic}"`;
  }

  get isActive() {
    return this.isEnabled;
  }

  @computedFrom('status')
  get isEnabled() {
    return this.status === 'enabled';
  }

  @computedFrom('status')
  get isDisabled() {
    return this.status === 'disabled';
  }

  start() {
    this.status = 'enabled';
    this.socket = zmq.socket('pub');
    this.subscriber = this.ea.subscribe('adms:test', response => {
      let message = JSON.stringify(response);
      this.socket.send([this.relayConfig.topic, message]);
      this.messagesSent++;
      this.bytesSent += message.length;
    });

    this.broker = `tcp://${this.relayConfig.host}:${this.relayConfig.publisherPort}`;
    this.socket.identity = 'publisher' + process.pid;
    this.socket.connect(this.broker);
    console.log(`Publisher connected to ${this.broker}`);
    this.pubStatus = 'enabled';
  }

  stop() {
    this.status = 'disabled';
    this.subscriber.dispose();
    this.socket.disconnect(this.broker);
  }
}
