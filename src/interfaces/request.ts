export type Color = 'red' | 'yellow' | 'green' | 'blue';

/**
 * Interfaz implementada para representar los atributos de un mensaje
 * de petición propio del cliente.
 */
export interface Request{
  /**
   * Tipo de mensaje: para añadir, actualizar, eliminar, leer o listar notas
   */
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  /**
   * Propietario de la nota
   */
  user: string;
  /**
   * Tìtulo de la nota
   */
  title?: string;
  /**
   * Cuerpo de la nota
   */
  body?: string;
  /**
   * Color de la nota
   */
  color?: Color;
}