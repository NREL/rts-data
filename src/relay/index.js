import {inject} from 'aurelia-framework';
import {RelayPublisher} from './publisher';
import {RelaySubscriber} from './subscriber';
import {RelayConfig} from './config';

@inject(RelayPublisher, RelaySubscriber, RelayConfig)
export class RelayIndex {
  heading = 'Relay';

  constructor(relayPublisher, relaySubscriber, relayConfig) {
    this.relayPublisher = relayPublisher;
    this.relaySubscriber = relaySubscriber;
    this.relayConfig = relayConfig;
  }

  toggleSubscriber() {
    if (this.relaySubscriber.isEnabled) {
      this.relaySubscriber.stop();
    } else {
      this.relaySubscriber.start();
    }
  }

  togglePublisher() {
    if (this.relayPublisher.isEnabled) {
      this.relayPublisher.stop();
    } else {
      this.relayPublisher.start();
    }
  }
}
