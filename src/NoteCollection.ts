import {Note} from "./note";

/**
 * Clase implementada para representar una colección de notas
 */
export class NoteCollection implements Iterable<Note> {
  /**
   * Colección de notas
   */
  private collection: Map<string, Note>;

  /**
   * Inicializa un objeto de la clase 'NoteCollection'
   * @param notes Notas a incluir inicialmente en la colección
   */
  constructor(...notes: Note[]) {
    this.collection = new Map<string, Note>();
    notes.forEach((note) => this.add(note));
  }

  /**
   * Añade una nota a la colección, si no estaba incluida.
   * @param note Nota a añadir
   */
  public add(note: Note): void {
    this.collection.set(note.getTitle(), note);
  }

  /**
   * Elimina una nota de la colección, si existe, dado el título de la misma
   * @param title Título de la nota a eliminar
   * @returns Verdadero si la nota ha sido eliminado correctamente
   */
  public remove(title: string): boolean {
    return this.collection.delete(title);
  }

  /**
   * Devuelve una nota de la colección dado el título de una nota, si existe.
   * En caso contrario devuelve 'undefined'.
   * @param title Título de la nota de la colección a obtener.
   * @returns Nota de la colección | 'undefined' si dicha nota no existe.
   */
  public getNote(title: string): Note | undefined {
    return this.collection.get(title);
  }

  /**
   * Retorna el tamaño de la colección
   * @returns Tamaño de la colección
   */
  public getSize(): number {
    return this.collection.size;
  }

  /**
   * Propiedad que permite iterar en los elementos de la colección
   * @returns Iterador de la colección
   */
  public [Symbol.iterator](): Iterator<Note> {
    return this.collection.values();
  }
}