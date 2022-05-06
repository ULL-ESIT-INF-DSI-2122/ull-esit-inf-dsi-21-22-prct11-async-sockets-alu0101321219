import {EventEmitter} from "events";

/**
 * Clase que actúa como cliente, esta hereda de EventEmitter con el
 * objetivo de procesar mensajes de respuesta de un servidor.
 */
export class EventEmitterClient extends EventEmitter {
  /**
   * Inicializa un objeto de la clase 'EvenEmitterClient'
   * @param connection Objeto EventEmitter que establece la conexión
   */
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