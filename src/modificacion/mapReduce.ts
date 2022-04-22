export abstract class MapReduce {
  /**
   * Colección de números
   */
  protected collection: number [] = [];

  /**
   * Inicializa un objeto de la clase 'MapReduce'
   * @param numbers Numeros iniciales a incluir en la colección
   */
  constructor(protected mapFunction: Function, ...numbers: number[]) {
    numbers.forEach((number) => {
      this.collection.push(number);
    });
  }

  /**
   * Devuelve la colección de números
   * @returns Colección de números a obtener
   */
  public getCollection(): number[] {
    return this.collection;
  }

  /**
   * Método template que define el esqueleto de un map y reduce
   */
  public run(): void {
    // Mapeo inicial
    this.map();
    // Hook
    this.afterMap();
    // Reducción del vector
    this.reduce();
  }

  /**
   * Modifica cada elemento del vector utilizando la función introducida
   * por parámetro
   */
  protected map(): void {
    for (let i: number = 0; i < this.collection.length; i++) {
      this.collection[i] = this.mapFunction(this.collection[i]);
    }
  }

  /**
   * Aplica una reducción del vector
   */
  protected abstract reduce(): void;

  /**
   * Funciones vacias que pueden ser o no implementadas por las clases hijo
   */
  protected afterMap(): void {}
}