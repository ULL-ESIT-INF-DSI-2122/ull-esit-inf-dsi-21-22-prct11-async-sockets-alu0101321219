# DSI - Práctica 10: Sistema de ficheros y creación de procesos en Node.js
En esta [github page](https://pages.github.com/) se describe la realización de la [práctica 10](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/) de la asignatura "Desarrollo de Sistemas Informáticos".

## Acerca de
- Universidad de La Laguna
  - Grado en Ingeniería Informática, 3º Curso, 2º Cuatrimestre
  - Desarrollo de Sistemas Informáticos
- Autor:
  - Adrián González Galván
  - alu0101321219@ull.edu.es
  - Cuenta de GitHub: [alu0101321219](https://github.com/alu0101321219)
- Fecha de entrega: 01/05/2022

## Introducción
En esta práctica se plantean una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos. Para ello se han creado en el directorio `src` diversos directorios cuyos nombres coinciden con los _nombres de los ejercicios a realizar_. Dentro de estos se encuentran los ficheros con extensión `.ts` que contienen las soluciones de los mismos.

## Ejercicio 2
### Descripción
Implemente un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto. Para acceder al contenido del fichero deberá expandir el comando `cat` de Unix/Linux, además de expandir el comando `grep` con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.
Una vez haya obtenido la salida proporcionada por grep, cuente el número de ocurrencias de dicha palabra en las líneas obtenidas haciendo uso de, por ejemplo, una expresión regular y muéstrelas por la consola. En caso de no encontrar ocurrencias, muestre un mensaje informativo de lo anterior
Lleve a cabo el ejercicio anterior de dos maneras diferentes:
1. Haciendo uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
2. Sin hacer uso del método pipe, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

### Solución
Para realizar la __solución de este ejercicio__ se ha implementado una __clase__ y se ha utilizado paquete `yargs`.
#### Clase CountFileWords
La clase denominada __CountFileWords__ es la encargada de realizar la funcionalidad que se especifica en la práctica, esto es realizar el conteo de una determinada palabra dentro de un determinado fichero. Por ende su constructor recibe 2 parámetros:
```typescript
  constructor(private filePath: string, private word: string) {}
```
1. La ruta donde se encuentra el fichero a utilziar.
2.  La palabra a buscar dentro de este fichero.

Así pues, en el enunciado se remarca que se deben utilizar __2 métodos__ para realizar dicho conteo. Nuestro __método 1__ hace uso del método `pipe`.
```typescript
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
```
Como se puede observar, este hace uso del __patron callback__ con el objetivo de poder capturar la variable que se corresponde con el error generado (en el caso de que se generase un error) o el número de palabras a contar (en el caso de que se hayan contado mas de 0 palabras). Su funcionamiento se resume en:
- Chekear mediante el atributo `err` del callback del método `fs.access` si existe o no dicho fichero.
- Generar mediante la función `spawn` los comandos `cat` y  `grep` correspondientes.
- Utilzar el método `pipe` para redirigir la salida de un comando hacia el otro (`cat.stdout.pipe(grep.stdin)`).
- Capturar la salida del `grep` mediante una variable externa `grepOutput`.
- Actualizar el `callback` de la función a la hora de finalizar la ejecución del `grep` (`grep.on(close)`) actualizando el mensaje de error en el caso de contar 0 ocurrencias o actualizando el conteo en caso contrario.

Como se puede observar, para __contar el número de ocurrencias__ se ha hecho uso de una __expresión regular__. Así pues, con el operador `match` propio de una `string` capturamos el número de ocurrencias de dicha expresión regular dentro de nuestra salida del comando `grep`.

El __segundo método a incluir__ presenta el siguiente código:
```typescript
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
```
Como se observa, en este no se hace uso del método `pipe`, si no que se escribe en el comando `grep` la salida de cada una de las partes del comando `cat` a través de  `grep.stdin.write(piece)`. Así pues, al finalizar el comando `cat` (`cat.on(close)`) se finaliza también la escritura del comando `grep` (`grep.stind.end()`). El resto del procedimiento es idéntico al del método anterior.

Por otro lado, se ha hecho uso del __paquete `yargs`__ para obtener por comandos tanto la ruta del fichero a utilizar, como la palabra a buscar y el método a utilizar.
```typescrcipt
yargs.command({
  command: 'countWords',
  describe: 'Count the number of ocurrences of a word in a especific file',
  builder: {
    file: {
      describe: 'File path',
      demmandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Word to count',
      demmandOption: true,
      type: 'string',
    },
    method: {
      describe: 'Method to use',
      demmandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' &&
      typeof argv.method === 'number') {
      const countFileWords: CountFileWords = new CountFileWords(argv.file, argv.word);
      switch (argv.method) {
        case 1: {
          countFileWords.method1((err, numberOfWords) => {
            if (err) {
              console.log(chalk.red(err));
            } else if (numberOfWords) {
              console.log(chalk.green(`RESULT: ${numberOfWords} ocurrences have been found!!`));
            }
          });
          break;
        }
        case 2: {
          countFileWords.method2((err, numberOfWords) => {
            if (err) {
              console.log(chalk.red(err));
            } else if (numberOfWords) {
              console.log(chalk.green(`RESULT: ${numberOfWords} ocurrences have been found!!`));
            }
          });
          break;
        }
        default: {
          console.log(chalk.yellow('WARNING: There is only 2 methods available (1 and 2)!!'));
        }
      }
    } else {
      if (typeof argv.file === 'undefined') {
        console.log(chalk.red('ERROR: You have to specify a file!!'));
      }
      if (typeof argv.word === 'undefined') {
        console.log(chalk.red('ERROR: You have to specify a word!!'));
      }
      if (typeof argv.method === 'undefined') {
        console.log(chalk.red('ERROR: You have to specify a method!!'));
      }
    }
  },
});
```
Como se puede observar, el __nombre del comando es `countWords`__ y este recibe los 3 parámetros que antes hemos mencionado. Así pues, dependiendo del método especificado llama al correspondiente método de nuestra clase y muestra por consola el conteo realizado, o en su defecto el error producido. Para ello nótese que se hace uso del paquete `chalk`, el cual nos permite mostrar los mensajes de éxito en verde y los de fallo en rojo.

## Referencias
- [Práctica 10 - Sistema de ficheros y creación de procesos en Node.js](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/)