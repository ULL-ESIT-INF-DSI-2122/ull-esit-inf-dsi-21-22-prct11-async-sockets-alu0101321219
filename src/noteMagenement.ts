import * as fs from 'fs';
import * as chalk from 'chalk';
import {Note} from "./note";
import {NotePrinter} from "./notePrinter";

/**
 * Clase que implementa los módulos 'fs' y 'chalk' para gestionar
 * el tratamiento de notas. Incluye métodos para escribir, leer, borrar
 * y modificar las notas almacenadas en ficheros con extensión '.json'.
 */
export class NoteManagement {
  /**
   * Inicializa un objeto de la clase 'NoteManagement'
   */
  constructor() {
    if (!fs.existsSync('./notes')) {
      fs.mkdirSync('./notes');
    }
  }

  /**
   * Crea, si no existe ya, un fichero con las características de una nota.
   * @param note Nota a añadir
   * @param owner Propietario de la nota
   * @returns Cadena que contiene información acerca del éxito o fallo de la
   * creación de la nota.
   */
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

  /**
   * Elimina, si existe, la información de una determinada nota almacenada en
   * un fichero con extensión '.json'.
   * @param noteTitle Título de la nota a eliminar
   * @param owner Propietario de la nota
   * @returns Cadena que contiene información acerca del éxito de la
   * eliminación de la nota.
   */
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

  /**
   * Construye un objeto de tipo 'Note' a través de un fichero con extensión
   * '.json', si es que este último este existe.
   * @param noteTitle Título de la nota
   * @param owner Propietario de la nota
   * @returns Un objeto tipo 'Note' o 'undefined' si dicha nota no existe.
   */
  private getNote(noteTitle: string, owner: string): Note | undefined {
    if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      const data = JSON.parse(fs.readFileSync(`./notes/${owner}/${noteTitle}.json`).toString());
      return new Note(data.title, data.body, data.color);
    } else return undefined;
  }

  /**
   * Lee la información de una nota, si es que esta existe.
   * @param noteTitle Título de la nota a leer
   * @param owner Propietario de la nota
   * @returns Una cadena con la información de la nota si el fichero se
   * localizó con éxito. En caso contrario devuelve una cadena con un mensaje
   * de error.
   */
  public readNote(noteTitle: string, owner: string): string {
    const note: Note | undefined = this.getNote(noteTitle, owner);
    if (note) {
      return new NotePrinter(note).print();
    } else {
      return chalk.red('Error: This note doesnt exist!');
    }
  }

  /**
   * Lista los títulos de todas las notas de un determinado usuario.
   * @param owner Propietario de las notas a listar
   * @returns Una cadena con todos los títulos de las notas del propietario,
   * si es que este existe. En caso contrario devuelve un cadena con un mensaje
   * de error.
   */
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

  /**
   * Elimina todas las notas de un determinado usuario, incluyendo el
   * directorio del mismo
   * @param owner Propietario de las notas a eliminar
   * @returns Una cadena que contiene información acerca del éxito o fallo
   * de la eliminación del directorio.
   */
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