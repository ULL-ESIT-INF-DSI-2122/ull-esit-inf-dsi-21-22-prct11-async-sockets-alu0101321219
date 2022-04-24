# DSI - Práctica 9: Aplicación de procesamiento de notas de texto
En esta [github page](https://pages.github.com/) se describe la realización de la [práctica 9](https://ull-esit-inf-dsi-2122.github.io/prct09-filesystem-notes-app/) de la asignatura "Desarrollo de Sistemas Informáticos".

## Acerca de
- Universidad de La Laguna
  - Grado en Ingeniería Informática, 3º Curso, 2º Cuatrimestre
  - Desarrollo de Sistemas Informáticos
- Autor:
  - Adrián González Galván
  - alu0101321219@ull.edu.es
  - Cuenta de GitHub: [alu0101321219](https://github.com/alu0101321219)
- Fecha de entrega: 24/04/2022

## Información
Esta práctica consiste en realizar una __aplicación de procesamiento de notas de texto__. Así pues, esta misma permitirá añadir, modificar, eliminar, listar y leer las notas de un usuario concreto. Estas notas serán almacenadas en ficheros con extensión '.json' en el sistema de ficheros de la máquina que ejecute la aplicación.
Para el __desarrollo de esta práctica__ hacemos uso fundamentalmente de __2 paquetes__:
- El paquete `chalk`, que permite formatear el color de un texto (entre otras cosas).
- El paquete `yargs`, que permite implementar una linea de comandos para ejecutar código (entre otras cosas).

## Desarrollo de la práctica
### La interfaz `NoteSchema`
Como la información de las notas va a ser leída a partir de ficheros `.json` he decidido crear una __interfaz esquema__ que represente la estructura de datos de una simple nota. El contenido de esta es sumamente sencillo:
```typescript
export interface NoteSchema {
  /**
   * Título de la nota.
   */
  title: string,
  /**
   * Cuerpo/contenido de la nota.
   */
  body: string,
  /**
   * Color de la nota (rojo, verde, azul o amarillo)
   */
  color: Color
}
```
Simplemente posee __3 atributos de tipo `string`__ que representan el título, el cuerpo y el color de la nota. Nótese que para el color se ha empleado un _alias de tipo_, con el objetivo de que solo pueda tomar los valores 'red', 'blue', 'yellow' y 'green' (los colores que se especifica en el guión que pueden tomar las notas).
```typescript
export type Color = 'red' | 'green' | 'blue' | 'yellow';
```

### La clase `Note`
Con tal de seguir una estructura de __programación orientada a objetos__ se ha diseñado una clase que representa una nota. Esta es de lo más simple, pues solo posee como atributos aquellos comentados en el apartado anterior y métodos getter y setter.
```typescript
export class Note {
  /**
   * Inicializa un objeto de la clase 'Note'
   * @param title Título de la nota
   * @param body Cuerpo de la nota
   * @param color Color de la nota (rojo, verde, azul o amarillo)
   */
  constructor(private title: string, private body: string,
    private color: Color) {}

  /**
   * Getter del atributo 'title'
   * @returns Retorna el título de la nota
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Getter del atributo 'body'
   * @returns Retorna el cuerpo de la nota
   */
  public getBody(): string {
    return this.body;
  }

  /**
   * Getter del atributo 'color'
   * @returns Retorna el color de la nota
   */
  public getColor(): Color {
    return this.color;
  }

  /**
   * Setter del atributo 'title'
   * @param title Establece un nuevo título para la nota
   */
  public setTitle(title: string): void {
    this.title = title;
  }

  /**
   * Setter del atributo 'body'
   * @param body Establece un nuevo cuerpo para la nota
   */
  public setBody(body: string): void {
    this.body = body;
  }

  /**
   * Setter del atributo 'color'
   * @param color Establece un nuevo color para la nota
   */
  public setColor(color: Color): void {
    this.color = color;
  }

  /**
   * Crea un objeto de la clase 'Note' a través de la información
   * del esquema de una nota (NoteSchema)
   * @param note Esquema con información acerca de una nota.
   * @returns Objeto de la clase 'Note'
   */
  public static deserialize(note: NoteSchema): Note {
    return new Note(note.title, note.body, note.color);
  }
}
```
El único __método que más destaca__ es el último, llamado `deserialize`. Este es un __método estático__ de la clase empleado para transformar un _esquema de una nota_ en un objeto de la clase __Note__.

### La clase `NotePrinter`
Para llevar a cabo la __impresión de las notas por pantalla__ decidí crear una clase `NotePrinter`. Esta básicamente recibe un objeto de la clase `Note` y devuelve una cadena con las características del mismo empleado el paquete `chalk` para colorearlas.
```typescript
export class NotePrinter {
  /**
   * Inicializa un objeto de la clase 'NotePrinter'
   * @param note Objeto de la clase 'Note'
   */
  constructor(private note: Note) {}

  /**
   * Devuelve una cadena con el título de la nota formateado
   * con el color de la misma.
   */
  public printTitle(): string {
    switch (this.note.getColor()) {
      case 'red': return chalk.red(this.note.getTitle());
      case 'green': return chalk.green(this.note.getTitle());
      case 'blue': return chalk.blue(this.note.getTitle());
      case 'yellow': return chalk.yellow(this.note.getTitle());
    }
  }

  /**
   * Devuelve una cadena con la información de la nota formateada
   * con el color de la misma.
   */
  public print(): string {
    switch (this.note.getColor()) {
      case 'red': return this.printTitle() + '\n' + chalk.red.inverse(this.note.getBody() + '\n');
      case 'green': return this.printTitle() + '\n' + chalk.green.inverse(this.note.getBody() + '\n');
      case 'blue': return this.printTitle() + '\n' + chalk.blue.inverse(this.note.getBody() + '\n');
      case 'yellow': return this.printTitle() + '\n' + chalk.yellow.inverse(this.note.getBody() + '\n');
    }
  }
}
```
Como se puede observar, se han implementado __2 métodos__: uno para imprimir el título de las notas y otro para imprimir su información de manera completa. Su funcionamiento es sencillo, simplemente hace uso de un `switch` para devolver una cadena de un color u otro dependiendo del valor del atributo `color` de la misma nota.

### La clase `NoteManagement`
La __última clase creada__ es una para llevar a cabo la _gestión de las notas_ a través del módulo `fs` (File System) que nos ofrece `node.js`. Dado a que su código es algo extenso, este será explicado por partes.
#### Constructor
El constructor de la clase se limita a __crear el directorio donde se almacenarán todas las notas__ (el directorio `notes`), si es que no existe. Para ello llama a un método privado `inicialize`. El sentido de utilizar este método privado será explicado más adelante.
```typescript
constructor() {
    this.inicialize();
}
private inicialize(): void {
    if (!fs.existsSync('./notes')) {
      fs.mkdirSync('./notes');
    }
}
```
#### Método `end`
De la misma manera, también se creó un __método privado `end`__ que borrase el directorio de notas en el caso de que este se encontrase vacío.
```typescript
private end(): void {
    if (fs.readdirSync('./notes').length == 0) {
      fs.rmdirSync('./notes');
    }
}
```
#### Método `addNote`
Para __escribir una nota en el directorio de notas__ se ha implementado un método al que se le debe pasar por parámetro un objeto de la clase `Note` y una cadena con el nombre del propietario de la misma.
```typescript
public addNote(note: Note, owner: string): string {
  this.inicialize();
  if (!fs.existsSync(`./notes/${owner}`)) {
    fs.mkdirSync(`./notes/${owner}`);
  }
  if (fs.existsSync(`./notes/${owner}/${note.getTitle()}.json`)) {
    return chalk.red('Error: This note already exists!');
  } else {
    fs.writeFileSync(`./notes/${owner}/${note.getTitle()}.json`, JSON.stringify(note));
    return chalk.green(`Note has been added correctly!`);
  }
}
```
Este método comprueba si existe el directorio del usuario con `fs.existsSync`, creándolo en caso contrario. Asimismo, si la nota ya está creada devuelve una cadena con un mensaje de error y en caso contrario la crea y devuelve un mensaje de confirmación.
A tener en cuenta:
- Los __mensajes de error__ se muestran en __rojo__, mientras que los de __confirmación__ en __verde__ (tal y como se especifica en el guión de la práctica).
- Para mapear el objeto en un fichero se emplea `JSON.stringfy(note)`, el cual es ideal para adaptar las características del mismo en un formato `.json`.
- Los métodos empleados son __síncronos__. Esto se debe a que no sucedan errores como la creación de un directorio y de un fichero dentro del mismo al mismo tiempo.
- Cómo podemos ver hace uso del método privadp `inicialize`, para asegurarse de que el directorio de notas esté creado.

#### Método `removeNote`
Para __eliminar una nota__ se ha implementado un método en el que se le debe especificar por parámetro el título y propietario de la misma.
```typescript
public removeNote(noteTitle: string, owner: string): string {
  if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
    fs.rmSync(`./notes/${owner}/${noteTitle}.json`);
    if (fs.readdirSync(`./notes/${owner}`).length == 0) {
      fs.rmdirSync(`./notes/${owner}`);
    }
    this.end();
    return chalk.green(`Note has been removed correctly!`);
  } else {
    return chalk.red("Error: This note doesn't exist!");
  }
}
```
Nuevamente, este comprueba que exista la nota a eliminar, devolviendo un mensaje de confirmación en verde o un mensaje de error en caso contrario. Para ello nuevamente empleamos `fs.existsSync` y utilizamos `rmdirSync` para borrar dicho fichero.
- Nótese que en este método también invocamos al método __end()__ comentado en anteriores apartados, puesto que si no existen notas en el sistema no tiene sentido que tengamos el directorio `notes` vacío.

#### Método `getNote`
Para comprobar la existencia de una nota en una determinada ruta y construir el objeto que la representa se creó el método __getNote__.
```typescript
private getNote(noteTitle: string, owner: string): Note | undefined {
  if (fs.existsSync(`./notes/${owner}/${noteTitle}.json`)) {
    const data = JSON.parse(fs.readFileSync(`./notes/${owner}/${noteTitle}.json`).toString());
    if (data.title && data.body && data.color) return Note.deserialize(data);
    else return undefined;
  }
  return undefined;
}
```
Este __método comprueba la existencia de la nota__ (accediendo a la ruta donde debería ubicarse):
- Devolviendo y creando un objeto de la clase `Note` en caso de que exista.
  - Nótese que para esto se emplea el método __deserialize__ mencionado anteriormente, simplificando la creación de la nota.
- Devolviendo `undefined` en el caso de que el fichero `.json` no tenga los atributos propios de una nota.
- Devolviendo `undefined` en el caso de acceder a una ruta inexistente.

#### Método `readNote`
La implementación de la _lectura de una nota_ es sencilla. Este simplemente utiliza el método `getNote` para comprobar la existencia de la nota a leer. Devolviendo una cadena con su información o un mensaje de error en caso contrario. Para obtener una cadena con su información hace uso de la clase `NotePrinter` comentada anteriormente.
```typescript
public readNote(noteTitle: string, owner: string): string {
  const note: Note | undefined = this.getNote(noteTitle, owner);
  if (note) {
    return new NotePrinter(note).print();
  } else {
    return chalk.red('Error: This note doesnt exist!');
  }
}
```

#### Métodos `modeNoteBody` y `modeNoteColor`
Para la modificación de una nota también se __hace uso del método `getNote`__.
```typescript
public modNoteBody(noteTitle: string, owner: string, body: string): string {
  const note: Note | undefined = this.getNote(noteTitle, owner);
  if (note) {
    if (body == note.getBody()) {
      return chalk.yellow('Warning: This note already has this body');
    }
    note.setBody(body);
    fs.writeFileSync(`./notes/${owner}/${noteTitle}.json`, JSON.stringify(note));
    return chalk.green('Note body has been modified correctly!');
  } else {
    return chalk.red('Error: This note doesnt exist!');
  }
}
```
La __estructura de ambos métodos es similar__...
```typescript
public modNoteColor(noteTitle: string, owner: string, color: Color): string {
  const note: Note | undefined = this.getNote(noteTitle, owner);
  if (note) {
    if (color == note.getColor()) {
      return chalk.yellow('Warning: This note already has this color');
    }
    note.setColor(color);
    fs.writeFileSync(`./notes/${owner}/${noteTitle}.json`, JSON.stringify(note));
    return chalk.green('Note color has been modified correctly!');
  } else {
    return chalk.red('Error: This note doesnt exist!');
  }
}
```
Cómo se puede observar distinguimos 3 casos:
- Si el __color o el cuerpo de la nota que se quiere modificar es el mismo__ que esta posee actualmente simplemente devolvemos un __mensaje de aviso__.
- Si la __nota ha sido encontrada con éxito__ y el __color__ o __cuerpo__ que se quiere modificar es __diferente al que ya tenía__ se muestra un __mensaje de éxito__.
- Si __no se ha encontrado dicha nota__ se muestra un __mensaje de error__.

#### Método `listNotes`
Por otra parte, también contamos con un __método para imprimir el título de todas las notas de un determinado usuario__.
```typescript
public listNotes(owner: string): string {
  if (!fs.existsSync(`./notes/${owner}`)) {
    return chalk.red('Error: This user doesnt have any notes!');
  } else {
    let notes: string = '';
    fs.readdirSync(`./notes/${owner}`).forEach((file) => {
      const note: Note | undefined = this.getNote(file.slice(0, -5), owner);
      if (note) notes += new NotePrinter(note).printTitle() + '\n';
    });
    return notes;
  }
}
```
Este comprueba primeramente si __dicha nota existe__, devolviendo un mensaje de error en caso contrario. Si esta existe se emplea una variable auxiliar `notes` para ir concatenando el título de cada una de las notas del directorio. Para esto se emplea `fs.readdirSync` y el método `getNote` comentado anteriormente. Así pues, si se devuelve una nota existente se construye un objeto de la clase __notePrinter__ y se invoca a su método `printTitle`.
A tener en cuenta:
- Se puede apreciar q para obtener la nota se eliminan los últimos 5 carácteres del nombre del fichero, los cuales corresponderían con el nombre de la extensión (`.json`).