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
```typescript
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

## Ejercicio 3

### Descripción
A partir de la aplicación de procesamiento de notas desarrollada en la Práctica 9, desarrolle una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de `yargs`. La aplicación a desarrollar deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. Nótese que no hace falta modificar absolutamente nada en la aplicación de procesamiento de notas. Es una aplicación que se va a utilizar para provocar cambios en el sistema de ficheros.
Para ello, utilice la función `watch` y no la función `watchFile`, dado que esta última es más ineficiente que la primera. La función `watch` devuelve un objeto `Watcher`, que también es un objeto `EventEmitter`.
Con cada cambio detectado en el directorio observado, el programa deberá indicar si se ha añadido, modificado o borrado una nota, además de indicar el nombre concreto del fichero creado, modificado o eliminado para alojar dicha nota.
### Solución
Para __hallar la solución de este ejercicio__ se ha creado la clase `noteWatcher`. Dicha clase, recibe y tiene como único atributo el nombre del usuario del cual se quieren vigilar sus respectivas notas.
```typescript
  constructor(private user: string) {}
```
Para desarrollar la funcionalidad que se requiere en la práctica, esta clase tiene un método llamado `initialize` que comienza a realizar la vigilancia del respectivo directorio de notas del usuario.
```typescript
public initialize(callback: (err: string | undefined, event: string | undefined) => void): void {
    fs.access(`./notes/${this.getUser()}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else {
        fs.watch(`./notes/${this.getUser()}`, (eventType, fileName) => {
          if (eventType === 'rename') {
            fs.readFile(`./notes/${this.getUser()}/${fileName}`, (err, data) => {
              if (err) {
                callback(undefined, chalk.green(`The note with title `) + `${fileName.slice(0, -5)}` + chalk.green(" was deleted!!"));
              } else {
                callback(undefined, chalk.green('A note was added!!\n') + data.toString());
              }
            });
          } else if (eventType === 'change') {
            fs.readFile(`./notes/${this.getUser()}/${fileName}`, (err, data) => {
              if (err) callback(chalk.red(`ERROR: ${err.message}`), undefined);
              else callback(undefined, chalk.green('A note was modified!!\n') + data.toString());
            });
          }
        });
      }
    });
  }
```
Cómo se puede observar, este checkea inicialmente la _existencia del fichero del usuario a vigilar_ haciendo uso de `fs.access`. Seguidamennte, si no se mitió ningún error se pasa a hacer uso ahora así de `fs.watch`. Este recibe como primer parámetro la ruta del directorio a vigilar, la cual es en este caso el directorio de notas del usuario introducido. Asimismo, como segundo parametor recibe un _callback_ con 2 parámetros: el primero indica el tipo de evento emitido, mientras que el segundo el nombre fichero modificado, borrado o añadido.
1. En el caso de haberse emitido un __evento__ de tipo `rename`:
  - Se comprueba le existencia del fichero o nota del usuario, pueste esta puede haber sido añadida o eliminada.
    - En el caso de haber sido eliminada, el `fs.readFile` emitiría un error, el cual podemos recoger en el atributo `err` de su mismo _callback_. Actualizando por ello los parámetros del callback del método principal con un mensaje que indique la eliminación de la nota.
    - En el caso de haber sido creada podreemos leer dicha nota y mostrar los datos de la misma con `data.toString()`.
2. En el caso de haberse emitido un __evento__ de tipo `change`.
  - Se vuelve a emplear `readFile` para mostrar el contenido de la nota, si es que esta existe, concantenaod le contenido de la misma en el mensaje de nuevo usando `data.toString()`.

### Preguntas
- __¿Qué evento emite el objeto Watcher cuando se crea un nuevo fichero en el directorio observado?__ Emite un evento del tipo `rename`.
- __¿Y cuando se elimina un fichero existente?__ Un evento cuyo tipo es también `rename`.
- __¿Y cuando se modifica?__ Un evento del tipo `change`.
- __¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?__ Esto ha sido realizado y explicado anteriormente en la misma práctica. Para realizar esto básicamente hace uso del metodo `fs.readFile`, el cual nos proporciona en su _callback_ una variable `data` donde se almacena el bufer del contenido leído.
- __¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?__ Realizar esto es tan sencillo como cambiar la ruta de los ficheros a vigilar, en este caso todo el directorio `./notes`, y activar la opción de recursividad del mismo `fs.watch`, la cual hace que la vigilancia aplique a todos los subdirectorios del directorio especificado. La cabecera del `fs.watch` quedaría de la siguiente manera: `fs.watch("./notes/${this.getUser()}", {recursive: true}, (eventType, fileName)`. El problema de esta opción es que, según se especifica en la página de node, esta únicamente sirve para los sistemas de Windows y Linux. Por lo que a consecuente, no la podemos implementar en esta práctica puesto que utilizamos `Linux`.

## Ejercicio 4
### Descripción
Desarrolle una aplicación que permita hacer de __wrapper__ de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:
1. Dada una ruta concreta, mostrar si es un directorio o un fichero.
2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
3. Listar los ficheros dentro de un directorio.
4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
5. Borrar ficheros y directorios.
6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

### Solución
Para crear la __solución de dicho ejercicio__ se ha desarrollado la __clase `CommandWrapper`, cuyo constructor no recibe argumentos.
```typescript
  constructor() {}
```
Esta clase implementa, salvo para el punto 5, un método por cada una de las funcionalidades que se especifican en la descripción. Así pues, para el __primer punto__ tenemos el siguiente método:
```typescript
public isAFile(path: string, callback: (err: string | undefined, isFile: boolean | undefined) => void): void {
    fs.lstat(path, (err, stats) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (stats) {
        callback(undefined, stats.isFile());
      }
    });
  }
```
Este útiliza el método `fs.lstat` de node.js para comprobar si una ruta introducida se corresponde con un fichero o un directorio. Como se puede apreciar, este implementa el patrón callback devolviendo un error en caso de que la ruta introducida sea incorrecta y una variable booleana en el caso de que se haya producido un éxito que indica si dicho elemento es un archivo o no.

Para el __segundo punto__ se lleva a cabo en cambio el siguiente método:
```typescript
public createDir(path: string, callback: (err: string | undefined) => void): void {
    fs.mkdir(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
```
El código de este es sumamente sencillo, simplemente invoca al método `fs.mkdir` de node.js para crear un directorio. Como podemos observar, esta función también implementa el patrón callback. Cabe destacar que tanto esta como los siguientes métodos que comentaremos implementarán también dicho patrón.

Para el __tercer punto__ se lleva a cabo el método `listDir`:
```typescript
public listDir(path: string, callback: (err: string | undefined, files: string[] | undefined) => void): void {
    fs.readdir(path, (err, files)=> {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (files) {
        callback(undefined, files);
      }
    });
  }
```
Este, de la misma manera que el resto de métodos, hace uso del método `readDir` de node.js para listar el conjunto de archivos que tiene dentro del mismo, retornando a través del _callback_ un error en caso de que se produzca. Como se puede observar, el conjunto de archivos se devuelve como un `array` de `string` con los nombres de los correspondientes ficheros.

Para el __cuarto punto__ se emula el comportamiento del comando `cat` utilizando el método `readFile` que nos proporciona node.js:
```typescript
public readFie(path: string, callback: (err: string | undefined, data: string | undefined) => void): void {
    fs.readFile(path, (err, data) => {
      if (err) {
        callback(`ERROR: ${err.message}`, undefined);
      } else if (data) {
        callback(undefined, data.toString());
      }
    });
  }
```
El código de dicho método es nuevamente sencillo. Simplemente implementa el patrón callback para utilizar el método `readFile`, devolviendo un error en el caso de que se produzca o una `string` con la información leía del fichero. Para transformar el conjunto de datos leído en una `string` nótese que usamos `data.toString()`.

Para el __quinto punto__ se han llevado a cabo en cambio 2 funciones. Una primera función para __borrar archivos__:
```typescript
public removeFile(path: string, callback: (err: string | undefined) => void): void {
    fs.rm(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
```
Y otra __segunda función__ para __borrar directorios__:
```typescript
public removeDir(path: string, callback: (err: string | undefined) => void): void {
    fs.rmdir(path, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
```
Ambas utilizan los métodos `rm` y `rmdir` de node.js respectivamente e implementan el patrón callback devolviendo nuevamente un error en caso de que se produzca. Nótese que cuando dichas operaciones tienen éxito no devuelven nada, por lo tanto devuelven un callback con su único atributo con valor `undefined`. Este es tratado posteriormente en el menú para mostrar un mensaje confirmando el éxito.

Por último, para el __sexto punto__ se emplea el siguiente método:
```typescript
public copy(originPath: string, destPath: string, callback: (err: string | undefined) => void): void {
    fs.cp(originPath, destPath, {recursive: true}, (err) => {
      if (err) {
        callback(`ERROR: ${err.message}`);
      } else {
        callback(undefined);
      }
    });
  }
```
Su diseño se basa en la utilización del metodo `cp` de node.js para copiar una ruta en otra. Como se puede observar está activado el flag `recursive` para que al tratarse de un directorio se copien todos los archivos dentro del mismo en una nueva ruta. Nuevamente, si se produce un error será propagado a través del callback. En cambio, si no se produce se emitirá un _callback_ con un valor `undefined` que indicará que se tuvo éxito.

__Todos estos métodos__ están implementados a través de un menú utilizando `yargs`, tal y como se realizó para los apartados anteriores. Para cada uno de los comandos este simplemente se limita a crear un objeto de la clase `CommandWrapper` y ejecutar el método correspondiente. Asimismo, emplea el paquete `chalk` para imprimir en verde los mensajes de éxito y en rojo los mensajes de fallo.

## Referencias
- [Práctica 10 - Sistema de ficheros y creación de procesos en Node.js](https://ull-esit-inf-dsi-2122.github.io/prct10-async-fs-process/)