import {spawn} from 'child_process';

export function serverSpawn(cmd: string, args: string[], callback: (err: string | undefined, result: string | undefined) => void): void {
  const command = spawn(cmd, args);
  let commandOutput = '';
  let errorOutput = '';
  command.stdout.on('data', (piece) => commandOutput += piece);
  command.on('error', (err) => {
    callback(err.message, undefined);
  });
  command.stderr.on('data', (piece) => {
    errorOutput += piece;
  });
  command.on('close', () => {
    if (commandOutput) callback(undefined, commandOutput);
    else if (errorOutput) callback(errorOutput, undefined);
  });
}