import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterServer} from '../src/eventEmitterServer';

describe('EventEmitterServer', () => {
  const socket = new EventEmitter();
  const eventEmitterServer = new EventEmitterServer(socket);

  it('Existe una clase llamada EventEmitterServer', () => {
    expect(EventEmitterServer != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase EventEmitterServer', () => {
    expect(eventEmitterServer instanceof EventEmitterServer).to.be.true;
  });

  it('La clase hereda de EventEmitter', () => {
    expect(eventEmitterServer instanceof EventEmitter).to.be.true;
  });

  it('EventEmitterServer emite un mensaje de respuesta al recibir un mensaje completo', (done) => {
    eventEmitterServer.on('request', (message) => {
      const data = {
        type: 'add',
        user: 'adrian',
        title: 'titulo',
        body: 'cuerpo',
        color: 'green',
      };
      expect(message).to.be.eql(data);
      done();
    });
    socket.emit('data', '{"type": "add", "user": "adrian"');
    socket.emit('data', ', "title": "titulo", "body": "cuerpo"');
    socket.emit('data', ', "color": "green"}');
    socket.emit('data', '\n');
  });
});