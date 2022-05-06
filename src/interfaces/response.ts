import {Note} from '../note';

/**
 * Interfaz empleada para representar los atributos de un mensaje
 * de respuesta propio del cliente
 */
export interface Response {
  /**
   * Tipo de mensaje: informa si se añadió, actualizó, eliminó, leyó o se
   * listaron notas
   */
  type: 'add' | 'update' | 'remove' | 'read' | 'list';

  /**
   * Informa sobre el éxito de la operación
   */
  success: boolean;

  /**
   * Devuelve la nota o las notas en el caso de efectuar una lectura o listar
   */
  notes?: Note[];
}