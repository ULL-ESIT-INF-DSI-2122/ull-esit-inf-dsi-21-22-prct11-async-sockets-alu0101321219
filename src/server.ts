import * as net from 'net';
import {EventEmitterServer} from './eventEmitterServer';
import {Note} from './note';
import {NoteManagement} from './noteMagenement';

net.createServer((connection) => {
  const server = new EventEmitterServer(connection);
  server.on('request', (message) => {
    if (message.type == 'add') {
      console.log(new NoteManagement().addNote(new Note(message.title, message.body, message.color), message.user));
      connection.end();
    }
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});