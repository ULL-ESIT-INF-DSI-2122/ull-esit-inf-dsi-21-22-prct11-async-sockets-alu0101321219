import * as fs from 'fs';
import {Color, Note} from "./note";

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
    this.inicialize();
  }

  /**
   * Inicializa la creación de notas creando un directorio donde
   * almacenar todas y cada una de estas, si es que no existe.
   */
  private inicialize(): void {
    if (!fs.existsSync('./notes')) {
      fs.mkdirSync('./notes');
    }
  }

  /**
   * Elimina, el directorio donde se almacenan todas las notas en el caso
   * de que este se encuentre vacío.
   */
  private end(): void {
    if (fs.readdirSync('./notes').length == 0) {
      fs.rmdirSync('./notes');
    }
  }

  /**
   * Elimina todas las notas de todos los usuarios
   * @returns {boolean} Determina el éxito de la operación
   */
  public removeAllNotes(): boolean {
    if (fs.existsSync('./notes')) {
      fs.rmSync('./notes', {recursive: true});
      return true;
    }
    return false;
  }

  /**
   * Crea, si no existe ya, un fichero con las características de una nota.
   * @param note Nota a añadir
   * @param owner Propietario de la nota
   * @returns {boolean} Determina el éxito de la operación
   */
  public addNote(note: Note, owner: string): boolean {
    this.inicialize();
    if (!fs.existsSync(`./notes/${owner}`)) {
      fs.mkdirSync(`./notes/${owner}`);
    }
    if (fs.existsSync(`./notes/${owner}/${note.getTitle()}.json`)) {
      return false;
    } else {
      fs.writeFileSync(`./notes/${owner}/${note.getTitle()}.json`, JSON.stringify(note));
      return true;
    }
  }

  /**
   * Elimina, si existe, la información de una determinada nota almacenada en
   * un fichero con extensión '.json'.
   * @param noteTitle Título de la nota a eliminar
   * @param owner Propietario de la nota
   * @returns {boolean} Determina el éxito de la operación
   */
  public removeNote(noteTitle: string, owner: string): boolean {
    if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      fs.rmSync(`./notes/${owner}/${noteTitle}.json`);
      if (fs.readdirSync(`./notes/${owner}`).length == 0) {
        fs.rmdirSync(`./notes/${owner}`);
      }
      this.end();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Construye un objeto de tipo 'Note' a través de un fichero con extensión
   * '.json', si es que este último este existe.
   * @param noteTitle Título de la nota
   * @param owner Propietario de la nota
   * @returns Un objeto tipo 'Note' o 'undefined' si dicha nota no existe.
   */
  public readNote(noteTitle: string, owner: string): Note | undefined {
    if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
      const data = JSON.parse(fs.readFileSync(`./notes/${owner}/${noteTitle}.json`).toString());
      if (data.title && data.body && data.color) return Note.deserialize(data);
      else return undefined;
    }
    return undefined;
  }

  /**
   * Modifica, si existe, el cuerpo de una nota concreta.
   * @param noteTitle Título de la nota a modificar
   * @param owner Propietario de la nota
   * @param body Nuevo cuerpo de la nota a asignar
   * @returns {boolean} Determina el éxito de la operación
   */
  public modNoteBody(noteTitle: string, owner: string, body: string): boolean {
    const note: Note | undefined = this.readNote(noteTitle, owner);
    if (note) {
      note.setBody(body);
      fs.writeFileSync(`./notes/${owner}/${noteTitle}.json`, JSON.stringify(note));
      return true;
    } else {
      return false;
    }
  }

  /**
   * Modifica, si existe, el color de una nota concreta.
   * @param noteTitle Título de la nota a modificar
   * @param owner Propietario de la nota
   * @param color Nuevo color de la nota a asignar
   * @returns {boolean} Determina el éxito de la operación
   */
  public modNoteColor(noteTitle: string, owner: string, color: Color): boolean {
    const note: Note | undefined = this.readNote(noteTitle, owner);
    if (note) {
      note.setColor(color);
      fs.writeFileSync(`./notes/${owner}/${noteTitle}.json`, JSON.stringify(note));
      return true;
    } else {
      return false;
    }
  }

  /**
   * Lista los títulos de todas las notas de un determinado usuario.
   * @param owner Propietario de las notas a listar
   * @returns {Note[] | undefined} Array de notas en el caso de que exista
   * dicho usuario.
   */
  public listNotes(owner: string): Note[] | undefined {
    if (!fs.existsSync(`./notes/${owner}`)) {
      return undefined;
    } else {
      const notes: Note[] = [];
      fs.readdirSync(`./notes/${owner}`).forEach((file) => {
        const note: Note | undefined = this.readNote(file.slice(0, -5), owner);
        if (note) notes.push(note);
      });
      return notes;
    }
  }

  /**
   * Elimina todas las notas de un determinado usuario, incluyendo el
   * directorio del mismo
   * @param owner Propietario de las notas a eliminar
   * @returns {boolean} Determina el éxito de la operación
   */
  public removeAllUserNotes(owner: string): boolean {
    if (fs.existsSync(`./notes/${owner}`)) {
      fs.rmSync(`./notes/${owner}`, {recursive: true});
      this.end();
      return true;
    } else {
      return false;
    }
  }
}