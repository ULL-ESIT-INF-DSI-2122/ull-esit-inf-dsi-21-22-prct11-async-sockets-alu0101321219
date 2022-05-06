import {EventEmitter} from "events";
import {connect} from 'net';

type Color = 'red' | 'yellow' | 'green' | 'blue';

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: Color;
}

export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter, message: string) {
    super();
    connection.on('data', (data) => {
      connection.emit('request', data.toString());
    });
  }
}

const myRequest: RequestType = {
  type: 'add',
  user: 'usu1',
  title: 'titulo',
  body: 'body',
  color: 'green',
};

const socket = connect({port: 60300});
const client = new EventEmitterClient(socket, 'buenas');
client.on('request', (request) => {
  console.log(request);
  socket.write(request);
});
client.emit('request', 'holaa');