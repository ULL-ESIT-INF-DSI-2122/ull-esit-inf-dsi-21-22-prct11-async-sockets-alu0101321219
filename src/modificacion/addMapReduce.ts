import {MapReduce} from "./mapReduce";

/**
 * Extiende de la clase MapReduce para implementar un metodo Reduce
 * que realize la suma de los elementos del vector
 */
export class AddMapReduce extends MapReduce {
  /**
   * Inicializa un objeto de la clase 'AddMapReduce'
   * @param mapFunction Función a aplicar durante el mapeo
   * @param numbers Colección de numeros a utilizar
   */
  constructor(protected mapFunction: Function, ...numbers: number[]) {
    super(mapFunction, ...numbers);
  }


  /**
   * Sobreescribe el método de mapeo del algoritmo padre
   */
  protected map(): void {
    for (let i: number = 0; i < this.collection.length; i++) {
      this.collection[i] = this.mapFunction(this.collection[i]) + 2;
    }
  }

  /**
   * Realiza una reducción del vector realizando la suma de cada uno de
   * sus elementos.
   */
  protected reduce(): void {
    let result: number = 0;
    this.collection.forEach((n) => {
      result += n;
    });
    this.collection = [result];
  }
}