import * as net from 'net';
import {EventEmitterServer} from './eventEmitterServer';

net.createServer((connection) => {
  console.log('A client has connected.');
  const server = new EventEmitterServer(connection);
  server.on('request', (message) => {
    console.log(message);
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});