export type Color = 'red' | 'green' | 'blue' | 'yellow';

/**
 * Clase implementada para representar una nota de texto
 */
export class Note {
  /**
   * Inicializa un objeto de la clase 'Note'
   * @param title Título de la nota
   * @param body Cuerpo de la nota
   * @param color Color de la nota (rojo, verde, azul o amarillo)
   */
  constructor(private title: string, private body: string,
    private color: Color) {}

  /**
   * Getter del atributo 'title'
   * @returns Retorna el título de la nota
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Getter del atributo 'body'
   * @returns Retorna el cuerpo de la nota
   */
  public getBody(): string {
    return this.body;
  }

  /**
   * Getter del atributo 'color'
   * @returns Retorna el color de la nota
   */
  public getColor(): Color {
    return this.color;
  }

  /**
   * Setter del atributo 'title'
   * @param title Establece un nuevo título para la nota
   */
  public setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Setter del atributo 'body'
   * @param body Establece un nuevo cuerpo para la nota
   */
  public setBody(body: string): void {
    this.body = body;
  }

  /**
   * Setter del atributo 'color'
   * @param color Establece un nuevo color para la nota
   */
  public setColor(color: Color): void {
    this.color = color;
  }
}