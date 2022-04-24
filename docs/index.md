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