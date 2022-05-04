import * as net from 'net';

if (process.argv.length != 3) {
  console.log('Please, provide a command');
} else {
  const client = net.connect({port: 60300}, () => {
    console.log('Conected to the server');
  });

  client.write(process.argv[2]);
  client.end();

  let outputData = '';
  client.on('data', (data) => {
    outputData += data.toString();
  });

  client.on('end', () => {
    console.log(outputData);
  });
}