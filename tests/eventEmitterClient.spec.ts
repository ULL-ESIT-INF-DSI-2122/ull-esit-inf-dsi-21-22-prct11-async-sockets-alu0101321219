import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {EventEmitterClient} from '../src/eventEmitterClient';

describe('EventEmitterClient', () => {
  const socket = new EventEmitter();
  const eventEmitterClient = new EventEmitterClient(socket);

  it('Existe una clase llamada EventEmitterClient', () => {
    expect(EventEmitterClient != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase EventEmitterClient', () => {
    expect(eventEmitterClient instanceof EventEmitterClient).to.be.true;
  });

  it('La clase hereda de EventEmitter', () => {
    expect(eventEmitterClient instanceof EventEmitter).to.be.true;
  });

  it('EventEmitterClient emite un mensaje de respuesta al recibir un mensaje completo', (done) => {
    eventEmitterClient.on('respond', (message) => {
      expect(message).to.be.eql({'type': 'add', 'success': true});
      done();
    });
    const data = {
      type: 'add',
      success: true,
    };
    socket.emit('data', JSON.stringify(data));
    socket.emit('end');
  });
});