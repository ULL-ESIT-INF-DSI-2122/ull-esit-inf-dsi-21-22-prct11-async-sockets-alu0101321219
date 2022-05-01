import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {CommandWrapper} from './commandWrapper';

yargs.command({
  command: 'isFile',
  describe: 'Check is a path correspond to a file or a directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.isAFile(argv.path, (err, isFile) => {
        if (err) {
          console.log(chalk.red(err));
        } else {
          if (isFile) console.log(chalk.green(`Path '${argv.path}' correspond to a file!!`));
          else console.log(chalk.green(`Path '${argv.path}' correspond to a directory!!`));
        }
      });
    }
  },
});

yargs.parse();