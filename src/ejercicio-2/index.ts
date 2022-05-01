import {CountFileWords} from "./countFileWords";
import * as yargs from 'yargs';
import * as chalk from 'chalk';

/**
 * Comando para contar el número de ocurrencias de una determinada palbra
 * dentro de un fichero.
 */
yargs.command({
  command: 'countWords',
  describe: 'Count the number of ocurrences of a word in a especific file',
  builder: {
    file: {
      describe: 'File path',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Word to count',
      demmandOption: true,
      type: 'string',
    },
    method: {
      describe: 'Method to use',
      demmandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' &&
      typeof argv.method === 'number') {
      const countFileWords: CountFileWords = new CountFileWords(argv.file, argv.word);
      switch (argv.method) {
        case 1: {
          countFileWords.method1((err, numberOfWords) => {
            if (err) {
              console.log(chalk.red(err));
            } else if (numberOfWords) {
              console.log(chalk.green(`RESULT: ${numberOfWords} ocurrences have been found!!`));
            }
          });
          break;
        }
        case 2: {
          countFileWords.method2((err, numberOfWords) => {
            if (err) {
              console.log(chalk.red(err));
            } else if (numberOfWords) {
              console.log(chalk.green(`RESULT: ${numberOfWords} ocurrences have been found!!`));
            }
          });
          break;
        }
        default: {
          console.log(chalk.yellow('WARNING: There is only 2 methods available (1 and 2)!!'));
        }
      }
    }
  },
});

yargs.parse();