# DSI - Práctica 11: Cliente y servidor para una aplicación de procesamiento de notas de texto
En esta [github page](https://pages.github.com/) se describe la realización de la [práctica 11](https://ull-esit-inf-dsi-2122.github.io/prct11-async-sockets/) de la asignatura "Desarrollo de Sistemas Informáticos".

## Acerca de
- Universidad de La Laguna
  - Grado en Ingeniería Informática, 3º Curso, 2º Cuatrimestre
  - Desarrollo de Sistemas Informáticos
- Autor:
  - Adrián González Galván
  - alu0101321219@ull.edu.es
  - Cuenta de GitHub: [alu0101321219](https://github.com/alu0101321219)
- Fecha de entrega: 08/05/2022

## Información
Esta práctica consiste en utilziar la __aplicación de procesamiento de notas de texto__ que se creó en la practica 9 para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo `net` de Node.js. Así pues, el cliente será capaz de realizar peticiones de las operaciones desarrolladas en la prática 9 (añadir, modificar, eliminar, listar y leer notas) a través de linea de comandos que serán procesadas y confirmadas por el servidor. 
Para el __desarrollo de esta práctica__ hacemos uso fundamentalmente de __2 paquetes__:
- El paquete `chalk`, que permite formatear el color de un texto (entre otras cosas).
- El paquete `yargs`, que permite implementar una linea de comandos para ejecutar código (entre otras cosas).

## Interfaces implementadas
El paso de mensajes entre cliente y servidor se hace implementando el formato `.JSON`. Así pues, para determinar la estructura de estos mensajes se han implementado 2 interfaces:
- La interfaz para realizar __peticiones por parte del cliente__:
```typescript
export interface Request{
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: Color;
}
```
- La interfaz para realizar __respuestas por parte del servidor__:
```typescript
export interface Response {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  notes?: Note[];
}
```
Como podemos ver, en ambas se debe señalar el tipo de operación a la que se está haciendo referencia mediante el atributo `type`. En el caso de las __peticiones__, el único atributo obligatorio (a parte del `type`) es el nombre de usuario o propietario de notas que se quiere señalar. El resto de atributos se emplean dependiendo del tipo de operación efectuada.
Por otro lado, para los __mensajes de respuesta__ se devuelve un campo `success` cuya finalidad es informar si se ha completado correctamente la operación o no. El campo llamado `notes` que le precede solo se utilizará en el caso de que el cliente solicite la lectura de una nota o un conjunto de notas.

## Clases empleadas para el cliente y servidor
En esta práctica he optado por realizar 2 clases que hereden de `EventEmitter` tanto para cliente como para servidor, con el principal objetivo de encapsular las funcionalidades de los mismos. Ambas emplean el socket que se les pasa en el constructor para recopilar datos en una variable `wholeData` cuando los reciben.

En el caso del __cliente__ recopila datos hasta que le llega un evento de tipo `end`, pues el servidor cierra la conexión del cliente luego de responder su petición. Cuando esto sucede se emite un evento con `this.emit` llamado `respond` que contiene la información parseada.
```typescript
export class EventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (piece) => {
      wholeData += piece.toString();
    });
    connection.on('end', () => {
      this.emit('respond', JSON.parse(wholeData));
    });
  }
}
```
En el caso del __servidor__, este recopila datos hasta leer el carácter `\n`. Puesto que el cliente no puede emitir un `end` para informar que se ha terminado de escribir, ya que esto cerraría el canal de comunicación con el servidor, se ha procedido a enviar el archivo `JSON` correspondiente con un `\n` al final del mismo. Así pues, cuando el servidor obtiene un mensaje completo emite un evento llamado `request` con la información del `JSON` correspondiente que almacena los datos de la petición recibida ya formateada.
```typescript
  export class EventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (piece) => {
      wholeData += piece.toString();
      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        messageLimit = wholeData.indexOf('\n');
        this.emit('request', JSON.parse(message));
      }
    });
  }
}
```

## Cliente
Para el desarrollo del cliente tenemos el fichero `client.ts`, este emplea el módulo `yargs` tal y como se especifica en el enunciado de la práctica para captar los comandos que se introducen por teclado. Este inicia definniendo el socket por el que se establecerá la conexión (el cual es el correspondiente con el puerto 60300) y declarando un objeto de la clase `EventEmitterClient` explicada anteriormente.
```typescript
const socket = connect({port: 60300});
const client = new EventEmitterClient(socket);
```
Posteriormente se atienden los distintos comandos con un `yargs.command`. Para el caso de __añadir notas__ podemos observar como se crea el objeto `request` correspondiente y se escribe a través del socket. A la hora de recoger los parámetros del comando tenemos en cuenta de que nos pueden introducir colores no existentes, imprimiendo por pantalla un mensaje si es el caso y destruyendo el socket para que no quede el canal de comunicación del cliente abierto.
```typescript
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
      typeof argv.body === 'string' && typeof argv.color === 'string') {
      if (argv.color == 'red' || argv.color == 'green' || argv.color == 'red' || argv.color == 'yellow') {
        const request: Request = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
        socket.write(JSON.stringify(request) + '\n');
      } else {
        console.log(chalk.red('Error: color not valid (valid colors: "red", "green", "blue", "yellow")'));
        socket.destroy();
      }
    }
  },
});
```
Para __actualizar notas__ se checkea también que el color introducido sea válido y que se haya introducido al menos un nuevo `body` o `color`, destruyendo el socket si es el caso. En otro caso se crea el objeto `request` al que se le asigna el body o color correspondiente (en el caso de que estén definidos) y se envía la información convertida a `string` a través del socket.
```typescript
yargs.command({
  command: 'update',
  describe: 'Update a note',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'New body',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'New color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      if (typeof argv.body === 'string' || typeof argv.color == 'string') {
        if (typeof argv.color == 'string' && argv.color != 'blue' &&
          argv.color != 'green' && argv.color != 'red' && argv.color != 'yellow') {
          console.log(chalk.red('Error: color not valid (valid colors: "red", "green", "blue", "yellow")'));
          socket.destroy();
        } else {
          let body: string | undefined = undefined;
          let color: Color | undefined = undefined;
          if (typeof argv.body === 'string') body = argv.body;
          if (typeof argv.color == 'string' && (argv.color == 'blue' ||
            argv.color == 'green' || argv.color == 'red' || argv.color == 'yellow')) {
            color = argv.color;
          }
          const request: Request = {
            type: 'update',
            user: argv.user,
            title: argv.title,
            body: body,
            color: color,
          };
          socket.write(JSON.stringify(request) + '\n');
        }
      } else {
        console.log(chalk.yellow('Warning: please type a new body or a new color to modify the note'));
        socket.destroy();
      }
    }
  },
});
```
En el caso de  __leer notas__ la petición a realizar es más sencilla, pues los campos que se deben rellenar son únicamente el tipo, el nombre de usuario y el título de la nota. Esta información se envía nuevamente convertida a cadena a través del socket.
```typescript
yargs.command({
  command: 'read',
  describe: 'Read an user note',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const request: Request = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});
```
Para __borrar notas__ se permite indicar si se quieren borrar todas las notas de un usuario en concreto o solo una en específica, la cual se debe señalar indicando el título. Así pues el `request` que se envía se rellena con los campos `type`,  `user` y `title` en el caso de que se quiera borrar únicamente una nota. Nuevamente, se envían los datos convertidos a cadena a través del socket.
```typescript
yargs.command({
  command: 'remove',
  describe: 'Remove an existing note or a set of notes',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const request: Request = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      socket.write(JSON.stringify(request) + '\n');
    } else if (typeof argv.user == 'string' && typeof argv.title === 'undefined') {
      const request: Request = {
        type: 'remove',
        user: argv.user,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});
```
Por último, para __listar las notas__ se envía un simple mensaje `request` con 2 campos: tipo de operación y el usuario.
```typescript
yargs.command({
  command: 'list',
  describe: 'List all titles of user notes',
  builder: {
    user: {
      describe: 'User',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const request: Request = {
        type: 'list',
        user: argv.user,
      };
      socket.write(JSON.stringify(request) + '\n');
    }
  },
});
```
### ¿Cómo se realiza la recepción de las respuestas por parte del cliente?
Cuandos se emite el evento `respond` propio del constructor de la clase `EventEmitterCient` que mencionamos anteriormente. Así pues a través de una estructura `if-else` se comprueba el tipo de mensaje captado y se imprime por pantalla una respuesta u otra. Para ello se observa el valor del campo `success` con el objetivo de comprobar si fuera una operación que dió éxito o que fracasó.
```typescript
client.on('respond', (message) => {
  if (message.type == 'add') {
    if (message.success) {
      console.log(chalk.green(`Note has been added correctly!`));
    } else {
      console.log(chalk.red('Error: This note already exists!'));
    }
  } else if (message.type == 'update') {
    if (message.success) {
      console.log(chalk.green(`Note has been updated correctly!`));
    } else {
      console.log(chalk.red("Error: This note doesn't exist!"));
    }
  } else if (message.type == 'read') {
    if (message.success) {
      console.log(new NotePrinter(Note.deserialize(message.notes[0])).print());
    } else {
      console.log(chalk.red('Error: This note doesnt exist!'));
    }
  } else if (message.type == 'remove') {
    if (message.success) {
      console.log(chalk.green(`Note/s has been removed correctly!`));
    } else {
      console.log(chalk.red("Error: This note or user doesn't exist!"));
    }
  } else if (message.type == 'list') {
    if (message.success) {
      message.notes.forEach((note: NoteSchema) => {
        console.log(new NotePrinter(Note.deserialize(note)).printTitle());
      });
    } else {
      console.log(chalk.red('Error: This user doesnt exist!'));
    }
  } else {
    console.log(chalk.red('Error: Invalid type of message!'));
  }
});
```
Podemos observar que se hace uso del paquete `chalk` para mostrar los errores en rojo y las confirmacions en verde.

## Servidor
Para el desarrollo del código correspondiente con el servidor tenemos el fichero `server.ts`. Como se puede observar más abajo este crea un servidor  mediante el módulo `net` a través de `createServer` y lo pone a escuchar bajo el puerto 60300.
```typescript
net.createServer((socket) => {
  const server = new EventEmitterServer(socket);
  server.on('request', (message) => {
  ...
  });
  socket.end();
  socket.on('close', () => {
    console.log(chalk.green('A request has been attended!!'));
  });
}).listen(60300, () => {
  console.log(chalk.yellow('Server is working!!'));
});
```
Dentro de este se crea un objeto `server` de la clase `EventEmitterServer` inicializado con el socket sobre el que se está escuchando. Así pues, este atenderá peticiones cuando se emita un evento del tipo `request` el cual hemos definido anteriormente cuando comentamos la clase. Una vez captada la petición se enviará un mensaje de tipo `end` para informar al cliente de que la respuesta ya ha sido totalmente enviada. En el caso de que se cierre la conexión se mostrará un mensaje informando de que una petición ha sido atendida. Cuando se active el manejador de este evento se comprobará el tipo de mensaje captado, tal y como hicimos para el caso del cliente.
```typescript
server.on('request', (message) => {
    if (message.type == 'add') {
      const response: Response = {
        type: 'add',
        success: new NoteManagement().addNote(new Note(message.title, message.body, message.color), message.user),
      };
      socket.write(JSON.stringify(response));
    } else if (message.type == 'update') {
      let result: boolean = false;
      if (message.body) {
        result = new NoteManagement().modNoteBody(message.title, message.user, message.body);
      }
      if (message.color) {
        result = new NoteManagement().modNoteColor(message.title, message.user, message.color);
      }
      const response: Response = {
        type: 'update',
        success: result,
      };
      socket.write(JSON.stringify(response));
    } else if (message.type == 'remove') {
      let result: boolean = false;
      if (message.title) {
        result = new NoteManagement().removeNote(message.title, message.user);
      } else {
        result = new NoteManagement().removeAllUserNotes(message.user);
      }
      const response: Response = {
        type: 'remove',
        success: result,
      };
      socket.write(JSON.stringify(response));
    } else if (message.type == 'read') {
      const note: Note | undefined = new NoteManagement().readNote(message.title, message.user);
      let response: Response;
      if (note) {
        response = {
          type: 'read',
          success: true,
          notes: [note],
        };
      } else {
        response = {
          type: 'read',
          success: false,
        };
      }
      socket.write(JSON.stringify(response));
    } else if (message.type == 'list') {
      const notes: Note[] | undefined = new NoteManagement().listNotes(message.user);
      let response: Response;
      if (notes) {
        response = {
          type: 'list',
          success: true,
          notes: notes,
        };
      } else {
        response = {
          type: 'list',
          success: false,
        };
      }
      socket.write(JSON.stringify(response));
    } else {
      socket.write(JSON.stringify({type: 'invalid'}));
    }
```
Podemos apreciar que el código a ejecutar para cada tipo de mensaje es similar, así pues se crea un objeto de respuesta `response` con la información obtenida al ejecutar los métodos de la clase `NoteManagement`. Cabe recalcar que estos métodos han sido cambiados con respecto a la práctica 9 para que devuelvan una varaible booleana, la cual identifica el éxito de la operación. Se ha hecho de esta manera para que esta información coincida con el tipo del atributo `success` del mensaje. Las únicas operaciones que difieren de esta implementación son la de leer o listar notas, las cuales devuelven una nota o una lista de notas respectivamente (en el caso de encontrarlas, de otra manera devuelven `undefined`). Para __enviar la información__ se hace uso del método `write` del socket al igual que con el cliente. Nótese que si se trata de un tipo de mensaje no válido también se envía una cadena en formato `JSON` con el tipo `invalid`.