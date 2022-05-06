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
    } else if (message.type == 'remove') {

    } else if (message.type == 'read') {
      const note: Note | undefined = new NoteManagement().readNote(message.title, message.user);
      let response: Response;
      if (note) {
        response = {
          type: 'read',
          success: true,
          notes: [note],
        };
      } else {
        response = {
          type: 'read',
          success: false,
        };
      }
      socket.write(JSON.stringify(response));
    } else if (message.type == 'list') {

    } else {

    }
    socket.end();
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});