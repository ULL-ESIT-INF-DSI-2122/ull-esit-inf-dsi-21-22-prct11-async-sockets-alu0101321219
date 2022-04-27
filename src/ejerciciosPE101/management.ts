import {spawn} from 'child_process';
import * as fs from 'fs';

/**
 * Clase gestora implementada para la implementación de la práctica
 */
export class Management {
  /**
   * Inicializa un objeto de la clase 'Management'
   */
  constructor() {}

  /**
   * Comienza a vigiliar un determinado fichero
   * @param file Ruta del fichero a vigilar
   * @param commandName Nombre del comando a ejecutar
   * @param options Opciones del comando a ejecutar
   */
  public initialize(file: string, commandName: string, ...options: string[]) {
    if (!fs.existsSync(file)) throw new Error('The file doesnt exist...');
    fs.watch(file, (eventType, fileName) => {
      if (eventType === 'change') {
        console.log(`The file ${fileName} was modified!`);
        console.log(`The type of change was: ${eventType}`);
        const command = spawn(commandName, [...options, fileName]);
        let commandOutput = '';
        command.stdout.on('data', (piece) => commandOutput += piece);

        command.on('close', () => {
          const commandOutputArray = commandOutput.split(/\s+/);
          if (commandName === 'ls' && options.includes('-l')) {
            console.log(`The file permissions are: ${commandOutputArray[0]}`);
            console.log(`The file owner is: ${commandOutputArray[2]}`);
            console.log(`The group owner is: ${commandOutputArray[3]}`);
            console.log(`The file size is: ${commandOutputArray[4]}`);
            console.log(`Date of creation: ${commandOutputArray[6]}/${commandOutputArray[5]}`);
            console.log(`Hour of creation: ${commandOutputArray[7]}`);
          } else {
            console.log(commandOutput);
          }
        });
      } else {
        throw new Error('The file was deleted...');
      }
    });
  }
}