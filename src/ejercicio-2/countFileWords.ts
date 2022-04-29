import {spawn} from 'child_process';
import * as fs from 'fs';

/**
 * Clase que implementa métodos para contar el número de ocurrencias
 * de una palabra dentro de un determinado fichero de texto
 */
export class CountFileWords {
  /**
   * Inicializa un objeto de la clase 'CountFileWords'
   * @param filePath Ruta del fichero a examinar
   * @param word Palabra a contar dentro del mismo fichero
   */
  constructor(private filePath: string, private word: string) {}

  /**
   * Implementa el patrón _callback_ para contar el número de
   * palabras del fichero. Para su funcionalidad hace uso del método `pipe` de
   * un `Stream` para poder redigirir la salida de un comando hacia otro.
   * @param callback Patrón callback que contiene una cadena con el error a
   * ejecutar y el número de palabras a contar, ambos podrían estar no definidos.
   */
  public method1(callback: (err: string | undefined, numberOfWords: number | undefined) => void): void {
    fs.access(this.filePath, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else {
        const cat = spawn('cat', [this.filePath]);
        const grep = spawn('grep', [this.word]);
        cat.stdout.pipe(grep.stdin);

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('close', () => {
          const wordRE = new RegExp(this.word, 'g');
          if (grepOutput.match(wordRE)?.length) {
            callback(undefined, grepOutput.match(wordRE)?.length!);
          } else {
            callback('ERROR: There is no ocurrences...', undefined);
          }
        });
      }
    });
  }

  /**
   * Implementa el patrón _callback_ para contar el número de palabras de un
   * fichero. Para su funcionalidad crea un proceso dentro de otro proceso, lo
   * que sería un subproceso.
   * @param callback Patrón callback que contiene una cadena con el error a
   * ejecutar y el número de palabras a contar, ambos podrían estar no definidos.
   */
  public method2(callback: (err: string | undefined, numberOfWords: number | undefined) => void): void {
    fs.access(this.filePath, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else {
        const cat = spawn('cat', [this.filePath]);
        const grep = spawn('grep', [this.word]);
        cat.stdout.on('data', (piece) => {
          grep.stdin.write(piece);
        });

        cat.on('close', () => {
          grep.stdin.end();
          let grepOutput = '';
          grep.stdout.on('data', (piece) => {
            grepOutput += piece;
          });
          grep.on('close', () => {
            const wordRE = new RegExp(this.word, 'g');
            if (grepOutput.match(wordRE)?.length) {
              callback(undefined, grepOutput.match(wordRE)?.length!);
            } else {
              callback('ERROR: There is no ocurrences...', undefined);
            }
          });
        });
      }
    });
  }
}