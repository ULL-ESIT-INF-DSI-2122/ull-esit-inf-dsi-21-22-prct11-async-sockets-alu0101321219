import * as yargs from 'yargs';
import * as fs from 'fs';
import {Note} from './note';

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
      if (argv.color == 'red' || argv.color == 'green' || argv.color == 'blue' || argv.color == 'yellow') {
        const myNote: Note = new Note(argv.title, argv.body, argv.color);
        if (!fs.existsSync('./notes')) {
          fs.mkdirSync('./notes');
        }
        if (!fs.existsSync(`./notes/${argv.user}`)) {
          fs.mkdirSync(`./notes/${argv.user}`);
        }
        if (fs.existsSync(`./notes/${argv.user}/${argv.title}.json`)) {
          console.log('Error: This note already exists!');
        } else {
          fs.writeFileSync(`./notes/${argv.user}/${argv.title}.json`, JSON.stringify(myNote));
          console.log(`Note "${argv.title}" has been added correctly!`);
        }
      } else {
        console.log('Error: color not valid (valid colors = "red", "green", "blue", "yellow"');
      }
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Remove an existing note',
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
      if (fs.existsSync(`./notes/${argv.user}/${argv.title}.json`)) {
        fs.rmSync(`./notes/${argv.user}/${argv.title}.json`);
        console.log(`Note "${argv.title} has been removed correctly!`);
      } else {
        console.log("Error: This note doesn't exist!");
      }
    }
  },
});



yargs.parse();