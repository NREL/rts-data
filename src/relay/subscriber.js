import {computedFrom, inject} from 'aurelia-framework';
import zmq from 'zeromq';
import {RelayConfig} from './config';

@inject(RelayConfig)
export class RelaySubscriber {
  status = 'disabled';
  messagesReceived = 0;
  bytesReceived = 0;

  constructor(relayConfig) {
    this.relayConfig = relayConfig;
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

  onMessage(topic, message) {
    return;
  }

  onMessageProcess() {
    return (topic, message) => {
      this.lastMessageSent = message;
    	// console.log(`${topic.toString()}: ${message.toString()}`);

      this.messagesReceived++;
      this.bytesReceived += message.length;
      this.onMessage(topic, message);
    }
  }

  start() {
    this.status = 'enabled';
    this.broker = `tcp://${this.relayConfig.host}:${this.relayConfig.subscriberPort}`;
    this.socket = zmq.socket('sub');
    this.socket.identity = 'subscriber' + process.pid;
    this.socket.connect(this.broker);
    console.log(`Subscriber connected to ${this.broker}`);
    this.socket.subscribe(this.relayConfig.topic);
    this.socket.on('message', this.onMessageProcess());
  }

  stop() {
    this.status = 'disabled';
    this.socket.disconnect(this.broker);
  }
}
