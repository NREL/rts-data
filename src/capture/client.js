import {computedFrom, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import dgram from 'dgram';
import {CaptureConfig} from './config';
import _ from 'lodash';

@inject(CaptureConfig, EventAggregator)
export class CaptureClient {
  status = 'closed';
  messagesReceived = 0;
  bytesReceived = 0;
  socket;


  constructor(captureConfig, eventAggregator) {
    this.captureConfig = captureConfig;
    this.ea = eventAggregator;
  }

  get address() {
    if (this.socket) {
      try {
        return this.socket.address();
      } catch (e) {
        // See https://github.com/nodejs/node/issues/7061
        if (e.message === 'Not running') {
          return {};
        }
        throw new Error(e);
      }
    }
    return {};
  }

  get activeMessage() {
    return `Listening on ${this.address.address}:${this.address.port} (${this.address.family})`;
  }

  get isActive() {
    return this.isListening;
  }

  @computedFrom('status')
  get isListening() {
    return this.status === 'listening';
  }

  @computedFrom('status')
  get isClosed() {
    return this.status === 'closed';
  }

  start() {
    this.socket = dgram.createSocket('udp4');

    this.socket.on('listening', () => {
      this.status = 'listening';
    });

    this.socket.on('close', () => {
      this.status = 'closed';
    });

    this.socket.on('error', (error) => {
      this.status = 'error';
      this.error = error;
      this.socket.close();
    });

    this.socket.on('message', (message, remote) => {
      this.messagesReceived++;
      this.bytesReceived += remote.size;

      let data = [Date.now()/1000];
      for (var i = 0; i < message.length / 4; i++) {
        if (this.captureConfig.endianness === 'big-endian') {
          data.push(message.readFloatBE(i * 4));
        } else if (this.captureConfig.endianness === 'little-endian') {
          data.push(message.readFloatLE(i * 4));
        }
      }

      
      if (this.captureConfig.logging) {
        let hexValue = Buffer.from(message).toString('hex');
        console.log('TARGET', {
          data: data,
          message: message,
          remote: remote,
          hex: hexValue,
          py_struct: _.chain(hexValue).chunk(8).map((n) => {
            return(`\\x${n[0]}${n[1]}\\x${n[2]}${n[3]}\\x${n[4]}${n[5]}\\x${n[6]}${n[7]}`)
            }).join().value(),
          config: this.captureConfig
        });
      }

      // With in this Aurelia app, publish event with data for other modules,
      // e.g. the relay publisher for test
      this.ea.publish('adms:test', data);
    });

    this.socket.bind(this.captureConfig.port, this.captureConfig.host);
  }

  resetCounters() {
    this.bytesReceived = 0;
    this.messagesReceived = 0;
  }

  stop() {
    this.socket.close();
  }
}
