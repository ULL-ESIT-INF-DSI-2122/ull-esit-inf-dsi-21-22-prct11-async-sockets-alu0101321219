import * as fs from 'fs';

/**
 * Clase implementada para hacer de _wrapper_ de los distintos comandos
 * empleados en Linux para el manejo de ficheros y directorios.
 */
export class CommandWrapper {
  /**
   * Inicializa un objeto de la clase 'CommandWrapper'
   */
  constructor() {}

  /**
   * Comprueba si una ruta introducida por parámetro se corresponde a un
   * directorio o a un archivo
   * @param path Ruta introducida por parámetro
   * @param callback Patrón callback que permite devolver un error o una
   * variable booleana que comprueba si dicha ruta corresponde con un fichero
   * o no.
   */
  public isAFile(path: string, callback: (err: string | undefined, isFile: boolean | undefined) => void): void {
    fs.lstat(path, (err, stats) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (stats) {
        callback(undefined, stats.isFile());
      }
    });
  }

  public createDir(path: string, callback: (err: string | undefined) => void): void {
    fs.mkdir(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
}