import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * Clase implementada para vigilar los cambios realizados sobre el directorio
 * de notas de un usuario específico.
 */
export class NoteWatcher {
  /**
   * Inicializa un objeto de la clase 'NoteWatcher'
   * @param user Usuario del cual observar las notas.
   */
  constructor(private user: string) {}

  /**
   * Devuelve el usuario del cual se están vigilando sus notas.
   * @returns Usuario
   */
  public getUser(): string {
    return this.user;
  }

  /**
   * Establece un nuevo usuario al cual vigilar sus notas.
   * @param user Nuevo usuario.
   */
  public setUser(user: string): void {
    this.user = user;
  }

  /**
   * Comienza a realizar la vigilancia de los cambios realizados sobre el
   * directorio del fichero especificado.
   * @param callback Implenta el patrón callback para devolver un error o una
   * cadena con el tipo de evento realizado.
   */
  public initialize(callback: (err: string | undefined, event: string | undefined) => void): void {
    fs.access(`./notes/${this.getUser()}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else {
        fs.watch(`./notes/${this.getUser()}`, (eventType, fileName) => {
          if (eventType === 'rename') {
            fs.access(`./notes/${this.getUser()}/${fileName}`, fs.constants.F_OK, (err) => {
              if (err) {
                callback(undefined, chalk.green(`The note with title `) + `${fileName.slice(0, -5)}` + chalk.green(" was deleted!!"));
              } else {
                fs.readFile(`./notes/${this.getUser()}/${fileName}`, (err, data) => {
                  if (err) callback(chalk.red(`ERROR: ${err.message}`), undefined);
                  else callback(undefined, chalk.green('A note was added!!\n') + data.toString());
                });
              }
            });
          } else if (eventType === 'change') {
            fs.readFile(`./notes/${this.getUser()}/${fileName}`, (err, data) => {
              if (err) callback(chalk.red(`ERROR: ${err.message}`), undefined);
              else callback(undefined, chalk.green('A note was modified!!\n') + data.toString());
            });
          }
        });
      }
    });
  }
}