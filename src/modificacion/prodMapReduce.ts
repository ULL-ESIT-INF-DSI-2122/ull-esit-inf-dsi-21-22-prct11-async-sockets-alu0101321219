import {MapReduce} from "./mapReduce";

/**
 * Extiende de la clase MapReduce para implementar un metodo Reduce
 * que realize el producto de los elementos del vector
 */
export class ProdMapReduce extends MapReduce {
  /**
   * Inicializa un objeto de la clase 'ProdMapReduce'
   * @param mapFunction Función a ejecutar en el map
   * @param numbers Colección de numeros a utilizar
   */
  constructor(protected mapFunction: Function, ...numbers: number[]) {
    super(mapFunction, ...numbers);
  }

  /**
   * Método hook que establece 1 a cada elemento que sea cero en el vector
   */
  protected afterMap(): void {
    for (let i: number = 0; i < this.collection.length; i++) {
      if (this.collection[i] == 0) this.collection[i] = 11;
    }
  }

  /**
   * Reestablece el vector de la colección como el producto de cada uno de los
   * números de la misma colección.
   */
  protected reduce(): void {
    let result: number = 1;
    this.collection.forEach((n) => {
      result *= n;
    });
    this.collection = [result];
  }
}