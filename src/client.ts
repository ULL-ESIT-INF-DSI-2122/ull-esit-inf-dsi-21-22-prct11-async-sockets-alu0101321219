import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {connect} from 'net';
import {EventEmitterClient} from './eventEmitterClient';
import {Request} from './interfaces/request';

/**
 * Comando empleado para añadir una nota.
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
      typeof argv.body === 'string' && typeof argv.color === 'string') {
      if (argv.color == 'red' || argv.color == 'green' || argv.color == 'red' || argv.color == 'yellow') {
        const request: Request = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
        const socket = connect({port: 60300});
        const client = new EventEmitterClient(socket);
        socket.write(JSON.stringify(request) + '\n');
        client.on('respond', (data) => {
          console.log(data.toString());
        });
      } else {
        console.log(chalk.red('Error: color not valid (valid colors: "red", "green", "blue", "yellow")'));
      }
    }
  },
});

yargs.parse();