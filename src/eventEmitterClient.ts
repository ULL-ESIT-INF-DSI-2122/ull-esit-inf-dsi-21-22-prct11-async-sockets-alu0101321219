import {EventEmitter} from "events";

export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    connection.on('data', (data) => {
      this.emit('respond', data.toString());
    });
  }
}