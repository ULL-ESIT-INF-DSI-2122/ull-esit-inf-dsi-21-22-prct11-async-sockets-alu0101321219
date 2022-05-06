import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {connect} from 'net';
import {EventEmitterClient} from './eventEmitterClient';
import {Request} from './interfaces/request';
import {NotePrinter} from './notePrinter';
import {Note, Color} from './note';

const socket = connect({port: 60300});
const client = new EventEmitterClient(socket);

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
        socket.write(JSON.stringify(request) + '\n');
      } else {
        console.log(chalk.red('Error: color not valid (valid colors: "red", "green", "blue", "yellow")'));
        socket.destroy();
      }
    }
  },
});

yargs.command({
  command: 'update',
  describe: 'Update a note',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'New body',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'New color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      if (typeof argv.body === 'string' || typeof argv.color == 'string') {
        if (typeof argv.color == 'string' && argv.color != 'blue' &&
          argv.color != 'green' && argv.color != 'red' && argv.color != 'yellow') {
          console.log(chalk.red('Error: color not valid (valid colors: "red", "green", "blue", "yellow")'));
          socket.destroy();
        } else {
          let body: string | undefined = undefined;
          let color: Color | undefined = undefined;
          if (typeof argv.body === 'string') body = argv.body;
          if (typeof argv.color == 'string' && (argv.color == 'blue' ||
            argv.color == 'green' || argv.color == 'red' || argv.color == 'yellow')) {
            color = argv.color;
          }
          const request: Request = {
            type: 'update',
            user: argv.user,
            title: argv.title,
            body: body,
            color: color,
          };
          socket.write(JSON.stringify(request) + '\n');
        }
      } else {
        console.log(chalk.yellow('Warning: please type a new body or a new color to modify the note'));
        socket.destroy();
      }
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Read an user note',
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
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const request: Request = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Remove an existing note or a set of notes',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const request: Request = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(request) + '\n');
    } else if (typeof argv.user == 'string' && typeof argv.title === 'undefined') {
      const request: Request = {
        type: 'remove',
        user: argv.user,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'List all titles of user notes',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const request: Request = {
        type: 'list',
        user: argv.user,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});

yargs.parse();

client.on('respond', (message) => {
  if (message.type == 'add') {
    if (message.success) {
      console.log(chalk.green(`Note has been added correctly!`));
    } else {
      console.log(chalk.red('Error: This note already exists!'));
    }
  } else if (message.type == 'update') {
    if (message.success) {
      console.log(chalk.green(`Note has been updated correctly!`));
    } else {
      console.log(chalk.red("Error: This note doesn't exists!"));
    }
  } else if (message.type == 'read') {
    if (message.success) {
      console.log(new NotePrinter(Note.deserialize(message.notes[0])).print());
    } else {
      console.log(chalk.red('Error: This note doesnt exist!'));
    }
  } else if (message.type == 'remove') {
    if (message.success) {
      console.log(chalk.green(`Note/s has been removed correctly!`));
    } else {
      console.log(chalk.red("Error: This note or user doesn't exist!"));
    }
  } else if (message.type == 'list') {
    if (message.success) {
      message.notes.forEach((note) => {
        console.log(new NotePrinter(Note.deserialize(note)).printTitle());
      });
    } else {
      console.log(chalk.red('Error: This user doesnt have any notes!'));
    }
  }
});