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
      if (fs.readdirSync(`./notes/${owner}`).length == 0) {
        fs.rmdirSync(`./notes/${owner}`);
      }
      if (fs.readdirSync('./notes').length == 0) {
        fs.rmdirSync('./notes');
      }
      return chalk.green(`Note has been removed correctly!`);
    } else {
      return chalk.red("Error: This note doesn't exist!");
    }
  }

  private getNote(noteTitle: string, owner: string): Note | undefined {
    if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      const data = JSON.parse(fs.readFileSync(`./notes/${owner}/${noteTitle}.json`).toString());
      return new Note(data.title, data.body, data.color);
    } else return undefined;
  }

  public readNote(noteTitle: string, owner: string): string {
    const note: Note | undefined = this.getNote(noteTitle, owner);
    if (note) {
      return new NotePrinter(note).print();
    } else {
      return chalk.red('Error: This note doesnt exist!');
    }
  }

  public listNotes(owner: string): string {
    if (!fs.existsSync(`./notes/${owner}`)) {
      return chalk.red('Error: This user doesnt have any notes!');
    } else {
      let notes: string = '';
      fs.readdirSync(`./notes/${owner}`).forEach((file) => {
        const note: Note = this.getNote(file.slice(0, -5), owner)!;
        notes += new NotePrinter(note).printTitle() + '\n';
      });
      return notes;
    }
  }

  public removeAllUserNotes(owner: string): string {
    if (fs.existsSync(`./notes/${owner}`)) {
      fs.rmSync(`./notes/${owner}`, {recursive: true});
      if (fs.readdirSync('./notes').length == 0) {
        fs.rmdirSync('./notes');
      }
      return chalk.green('User have been removed succesfully!');
    } else {
      return chalk.red('Error: This user doesnt exists!');
    }
  }
}