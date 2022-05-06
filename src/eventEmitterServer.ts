import {EventEmitter} from "events";

/**
 * Clase que actúa como servidor, esta hereda de EventEmitter con el
 * objetivo de emitir un mensaje de respuesta a una petición.
 */
export class EventEmitterServer extends EventEmitter {
  /**
   * Inicializa un objeto de la clase 'EvenEmitterServer'
   * @param connection Objeto EventEmitter que establece la conexión
   */
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