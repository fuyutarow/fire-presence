import http from 'http';
import express from 'express';
import SocketIOServer from 'socket.io';
import initializeSocketIO from './socket';

const app = express();
const port = 8080 || process.env.PORT;

const server = new http.Server(app);

const io = SocketIOServer(server);
initializeSocketIO(io);

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
