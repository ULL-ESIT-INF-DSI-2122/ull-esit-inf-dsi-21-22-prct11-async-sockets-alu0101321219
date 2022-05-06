import {EventEmitter} from "events";

export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (piece) => {
      wholeData += piece.toString();
    });
    connection.on('end', () => {
      this.emit('respond', JSON.parse(wholeData));
    });
  }
}