import * as fs from 'fs';
import * as chalk from 'chalk';
import {Note} from "./note";
import {NotePrinter} from "./notePrinter";

export class NoteManagement {
  constructor() {
    if (!fs.existsSync('./notes')) {
      fs.mkdirSync('./notes');
    }
  }

  public addNote(note: Note, owner: string): string {
    if (!fs.existsSync(`./notes/${owner}`)) {
      fs.mkdirSync(`./notes/${owner}`);
    }
    if (fs.existsSync(`./notes/${owner}/${note.getTitle()}.json`)) {
      return chalk.red('Error: This note already exists!');
    } else {
      fs.writeFileSync(`./notes/${owner}/${note.getTitle()}.json`, JSON.stringify(note));
      return chalk.green(`Note has been added correctly!`);
    }
  }

  public removeNote(noteTitle: string, owner: string): string {
    if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      fs.rmSync(`./notes/${owner}/${noteTitle}.json`);
      return chalk.green(`Note has been removed correctly!`);
    } else {
      return chalk.red("Error: This note doesn't exist!");
    }
  }

  public readNote(noteTitle: string, owner: string): string {
    if (!fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      return chalk.red('Error: This note doesnt exist!');
    } else {
      const data = JSON.parse(fs.readFileSync(`./notes/${owner}/${noteTitle}.json`).toString());
      return new NotePrinter(new Note(data.title, data.body, data.color)).print();
    }
  }
}