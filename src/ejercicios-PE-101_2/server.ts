import * as express from 'express';
import {serverSpawn} from './serverSpawn';

const app = express();

app.get('/execmd', (req, res) => {
  if (!req.query.cmd) {
    res.send({
      error: 'A command name must be provided',
    });
    return;
  } else {
    if (typeof req.query.cmd == 'string' && typeof req.query.args == 'string') {
      serverSpawn(req.query.cmd, req.query.args.split(' '), (err, success) => {
        if (err) {
          res.send({
            error: err,
          });
          return;
        } else {
          res.send({
            output: success,
          });
          return;
        }
      });
    } else if (typeof req.query.cmd === 'string') {
      serverSpawn(req.query.cmd, [], (err, success) => {
        if (err) {
          res.send({
            error: err,
          });
          return;
        } else {
          res.send({
            output: success,
          });
          return;
        }
      });
    } else {
      res.send({
        error: 'command provided is not correct',
      });
      return;
    }
  }
});

app.get('*', (_, res) => {
  res.send('<h1>Error 404</h1>');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});