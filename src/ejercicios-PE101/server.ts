import * as net from 'net';
import {spawn} from 'child_process';


net.createServer({allowHalfOpen: true}, (connection) => {
  let data = '';
  connection.on('data', (piece) => {
    data += piece.toString();
  });
  connection.on('end', () => {
    const dataVector = data.toString().split(/\s+/);
    const cmd = dataVector.shift();
    if (cmd) {
      const command = spawn(cmd, dataVector);
      let commandOutput = '';
      command.stdout.on('data', (piece) => {
        commandOutput += piece;
      });

      command.on('error', (err) => {
        commandOutput = err.message;
      });

      command.stderr.on('data', (piece) => {
        commandOutput = piece;
      });

      command.on('close', () => {
        connection.write(commandOutput);
        connection.end();
      });
    } else {
      connection.write('Not valid command...');
      connection.end();
    }
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});