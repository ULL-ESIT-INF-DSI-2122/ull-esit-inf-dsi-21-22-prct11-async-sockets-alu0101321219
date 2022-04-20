import {MapReduce} from "./mapReduce";

/**
 * Extiende de la clase MapReduce para implementar un metodo Reduce
 * que realize la resta de los elementos del vector
 */
export class SubMapReduce extends MapReduce {
  /**
   * Inicializa un objeto de la clase 'SubMapReduce'
   * @param mapFunction Función a implementar para cada número
   * @param numbers Colección de numeros a utilizar
   */
  constructor(protected mapFunction: Function, ...numbers: number[]) {
    super(mapFunction, ...numbers);
  }

  /**
   * Realiza una reducción del vector sobreescribiendo el vector
   * como una resta de los elementos del mismo.
   */
  protected reduce(): void {
    let result: number = 0;
    if (this.collection.length > 0) {
      result = this.collection[0];
    }
    this.collection.forEach((n) => {
      result -= n;
    });
    this.collection = [result];
  }
}