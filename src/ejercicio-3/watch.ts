import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {NoteWatcher} from './noteWatcher';
/**
 * Comando para vigilar los cambios realizados en un directorio de notas
 * de un usuario en específico.
 */
yargs.command({
  command: 'watch',
  describe: 'Count the number of ocurrences of a word in a especific file',
  builder: {
    user: {
      describe: 'user',
      demandOption: true,
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