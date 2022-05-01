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

  /**
   * Lee el contenido de un fichero..
   * @param path Ruta del fichero a leer
   * @param callback Patrón callback que permite devolver un error en el caso
   * de no poder leer el fichero o el conjunto de datos del mismo fichero en
   * caso de éxito.
   */
  public readFie(path: string, callback: (err: string | undefined, data: string | undefined) => void): void {
    fs.readFile(path, (err, data) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (data) {
        callback(undefined, data.toString());
      }
    });
  }

  /**
   * Elimina, si existe, un fichero cuya ruta se introduce por parámetro.
   * @param path Ruta del fichero a eliminar
   * @param callback Patrón callback que permite devolver un error en caso
   * de que no se haya podido eliminar el fichero correctamente.
   */
  public removeFile(path: string, callback: (err: string | undefined) => void): void {
    fs.rm(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }

  /**
   * Elimina, si existe, un directorio cuya ruta se introduce por parámetro.
   * @param path Ruta del directorio a eliminar
   * @param callback Patrón callback que permite devolver un error en caso
   * de que no se haya podido eliminar el directorio correctamente.
   */
  public removeDir(path: string, callback: (err: string | undefined) => void): void {
    fs.rmdir(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }

  /**
   * Copia el contenido de un directorio o un fichero concreto en una nueva
   * ruta especificada por parámetro
   * @param originPath Ruta de origen
   * @param destPath Ruta de destino
   * @param callback Patrón callback que proporciona un error en el caso de
   * que la copia no se haya podido efectúar por cualquier motivo.
   */
  public copy(originPath: string, destPath: string, callback: (err: string | undefined) => void): void {
    fs.cp(originPath, destPath, {recursive: true}, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
}