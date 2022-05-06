import * as net from 'net';
import {EventEmitterServer} from './eventEmitterServer';
import {Note} from './note';
import {NoteManagement} from './noteMagenement';
import {Response} from './interfaces/response';

net.createServer((socket) => {
  const server = new EventEmitterServer(socket);
  server.on('request', (message) => {
    if (message.type == 'add') {
      const response: Response = {
        type: 'add',
        success: new NoteManagement().addNote(new Note(message.title, message.body, message.color), message.user),
      };
      socket.write(JSON.stringify(response));
      socket.end();
    } else if (message.type == 'update') {
      let result: boolean = false;
      if (message.body) {
        result = new NoteManagement().modNoteBody(message.title, message.user, message.body);
      }
      if (message.color) {
        result = new NoteManagement().modNoteColor(message.title, message.user, message.color);
      }
      const response: Response = {
        type: 'update',
        success: result,
      };
      socket.write(JSON.stringify(response));
      socket.end();
    }
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});