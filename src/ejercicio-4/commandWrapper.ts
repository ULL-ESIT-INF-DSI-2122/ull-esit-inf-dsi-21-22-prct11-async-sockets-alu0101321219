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

  /**
   * Crea un directorio dada una ruta introducida por parámetro
   * @param path Ruta donde ubicar el directorio
   * @param callback Patrón callback que permite devolver un error en el caso de
   * no haberse podido crear correctamente un directorio.
   */
  public createDir(path: string, callback: (err: string | undefined) => void): void {
    fs.mkdir(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }

  /**
   * Lista el contenido de un directorio cuya ruta es introducida por parámetro
   * @param path Ruta del directorio
   * @param callback Patrón callback que permite devolver un error en el caso
   * de no poder listar dicho directorio o una lista de los nombres de los
   * ficheros que pertenecen a dicho directorio.
   */
  public listDir(path: string, callback: (err: string | undefined, files: string[] | undefined) => void): void {
    fs.readdir(path, (err, files)=> {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (files) {
        callback(undefined, files);
      }
    });
  }
}