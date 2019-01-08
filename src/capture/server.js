import {computedFrom, inject} from 'aurelia-framework';
import dgram from 'dgram';
import {CaptureConfig} from './config';
import NanoTimer from 'nanotimer';

@inject(CaptureConfig)
export class CaptureServer {
  status = 'disabled';
  frequency = 1000;
  frequency_unit = 'm';
  messageSize = 272;
  messagesSent = 0;
  bytesSent = 0;
  lastMessageTime = Date.now();
  message;

  constructor(captureConfig) {
    this.captureConfig = captureConfig;
    this.timer = new NanoTimer();
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
    console.log('Sending UDP messages to ' + this.captureConfig.host +':'+ this.captureConfig.port);
    this.socket = dgram.createSocket('udp4');
    this.timer.setInterval(this.send.bind(this), false, `${this.frequency}${this.frequency_unit}`, (error) => {
      if (error) {
        console.error(error);
      }
    });
    this.status = 'enabled';
  }

  stop() {
    this.timer.clearInterval();
    this.socket.close();
    this.status = 'disabled';
    // delete this.message;
  }

  send() {
    this.messagesSent++;
    this.message = Buffer.alloc(parseInt(this.messageSize + 4, 10));
    if (this.captureConfig.endianness === 'big-endian') {
      this.message.writeFloatBE(this.messagesSent, 0);
    } else if (this.captureConfig.endianness === 'little-endian') {
      this.message.writeFloatLE(this.messagesSent, 0);
    }
    for (var i = 1; i < this.messageSize / 4; i++) {
      if (this.captureConfig.endianness === 'big-endian') {
        this.message.writeFloatBE(Math.random(), i * 4);
      } else if (this.captureConfig.endianness === 'little-endian') {
        this.message.writeFloatLE(Math.random(), i * 4);
      }
    }

    this.socket.send(this.message, 0, this.message.length, this.captureConfig.port, this.captureConfig.host, (err, bytes) => {
      if (err) throw err;
      this.lastMessageTime = Date.now();
  		this.bytesSent = this.bytesSent + this.message.length;
    });
  }
}
