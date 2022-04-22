import {Note} from "./note";
import * as chalk from 'chalk';

/**
 * Clase implementada para obtener la información
 * formateada acerca de un objeto del tipo 'Nota'. Emplea el paquete
 * 'chalk' para darle color a las mismas.
 */
export class NotePrinter {
  /**
   * Inicializa un objeto de la clase 'NotePrinter'
   * @param note Objeto de la clase 'Note'
   */
  constructor(private note: Note) {}

  /**
   * Devuelve una cadena con el título de la nota formateado
   * con el color de la misma.
   */
  public printTitle(): string {
    switch (this.note.getColor()) {
      case 'red': return chalk.red(this.note.getTitle());
      case 'green': return chalk.green(this.note.getTitle());
      case 'blue': return chalk.blue(this.note.getTitle());
      case 'yellow': return chalk.yellow(this.note.getTitle());
    }
  }

  /**
   * Devuelve una cadena con la información de la nota formateada
   * con el color de la misma.
   */
  public print(): string {
    switch (this.note.getColor()) {
      case 'red': return this.printTitle() + '\n' + chalk.red.inverse(this.note.getBody());
      case 'green': return this.printTitle() + '\n' + chalk.green.inverse(this.note.getBody());
      case 'blue': return this.printTitle() + '\n' + chalk.blue.inverse(this.note.getBody());
      case 'yellow': return this.printTitle() + '\n' + chalk.yellow.inverse(this.note.getBody());
    }
  }
}