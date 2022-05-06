import * as net from 'net';

net.createServer((connection) => {
  console.log('A client has connected.');

  connection.write('Connection stablished...');
  connection.on('data', (piece) => {
    console.log(piece.toString());
    connection.write('buenaas');
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});