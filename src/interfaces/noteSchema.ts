import {Color} from "../note";

/**
 * Representa el esquema de datos de una nota. Esta se emplea para comparar
 * la información leída de los archivos '.json' donde se almacenan las diversas
 * notas de nuestra aplicación.
 */
export interface NoteSchema {
  /**
   * Título de la nota.
   */
  title: string,
  /**
   * Cuerpo/contenido de la nota.
   */
  body: string,
  /**
   * Color de la nota (rojo, verde, azul o amarillo)
   */
  color: Color
}