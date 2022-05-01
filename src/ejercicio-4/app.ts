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

yargs.command({
  command: 'mkdir',
  describe: 'Create a directory',
  builder: {
    path: {
      describe: 'Directory path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.createDir(argv.path, (err) => {
        if (err) {
          console.log(chalk.red(err));
        } else {
          console.log(chalk.green(`'${argv.path}' successfully created !!`));
        }
      });
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'List the contents of a directory',
  builder: {
    dirPath: {
      describe: 'Directory path to list',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.dirPath === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.listDir(argv.dirPath, (err, files) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (files) {
          console.log(chalk.green(`'${argv.dirPath}' files = ${files}`));
        }
      });
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Show a file content',
  builder: {
    filePath: {
      describe: 'File path to show',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.filePath === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.readFie(argv.filePath, (err, data) => {
        if (err) {
          console.log(chalk.red(err));
        } else if (data) {
          console.log(chalk.green(`${argv.filePath} content:\n`) + `${data}`);
        }
      });
    }
  },
});

yargs.command({
  command: 'rmFile',
  describe: 'Remove a file',
  builder: {
    path: {
      describe: 'File path to remove',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.removeFile(argv.path, (err) => {
        if (err) {
          console.log(chalk.red(err));
        } else {
          console.log(chalk.green(`'${argv.path}' has been deleted succesfully!!`));
        }
      });
    }
  },
});

yargs.command({
  command: 'rmDir',
  describe: 'Remove a directory',
  builder: {
    path: {
      describe: 'Directory path to remove',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const commandWrapper: CommandWrapper = new CommandWrapper();
      commandWrapper.removeDir(argv.path, (err) => {
        if (err) {
          console.log(chalk.red(err));
        } else {
          console.log(chalk.green(`'${argv.path}' has been deleted succesfully!!`));
        }
      });
    }
  },
});

yargs.parse();