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
      const myNote: Note = new Note(argv.title, argv.body, 'red');
      fs.mkdir(`./notes/${argv.user}`, (err) => {
        if (err) {
          console.log("Somenthing went wrong when writing your folder");
        } else {
          console.log("Folder has just been created");
        }
      });
      fs.writeFile(`./notes/${argv.user}/${argv.title}.json`, JSON.stringify(myNote), (err) => {
        if (err) {
          console.log('Something went wrong when writing your file');
        } else {
          console.log('File helloworld.txt has just been created');
        }
      });
    }
  },
});

yargs.parse();