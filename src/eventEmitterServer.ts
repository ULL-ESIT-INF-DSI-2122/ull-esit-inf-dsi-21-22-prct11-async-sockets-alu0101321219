import {EventEmitter} from "events";

export class EventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (piece) => {
      wholeData += piece.toString();
      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        messageLimit = wholeData.indexOf('\n');
        this.emit('request', JSON.parse(message));
      }
    });
  }
}