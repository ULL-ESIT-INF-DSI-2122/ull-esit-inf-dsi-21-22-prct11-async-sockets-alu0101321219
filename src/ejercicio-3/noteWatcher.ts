import * as fs from 'fs';
import * as yargs from 'yargs';
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

  public initialize(callback: (err: string | undefined, event: string | undefined) => void): void {
    fs.access(`./notes/${this.getUser()}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else {
        fs.watch(`./notes/${this.getUser()}`, (eventType, fileName) => {
          console.log(eventType);
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

/**
 * Comando para contar el número de ocurrencias de una determinada palbra
 * dentro de un fichero.
 */
yargs.command({
  command: 'watch',
  describe: 'Count the number of ocurrences of a word in a especific file',
  builder: {
    user: {
      describe: 'user',
      demmandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const noteWatcher: NoteWatcher = new NoteWatcher(argv.user);
      noteWatcher.initialize((err, evenType) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (evenType) {
          console.log(evenType);
        }
      });
    }
  },
});

yargs.parse();