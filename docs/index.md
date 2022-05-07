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