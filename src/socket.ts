import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { stringify } from 'querystring';

const messageExpirationTimeMS = 10 * 1000;

export interface User {
  id: string;
  name: string;
}

const defaultUser: User = {
  id: 'anon',
  name: 'Anonymous',
};

export interface Message {
  user: User;
  id: string;
  time: Date;
  value: string;
}

const sendMessage = (socket: Socket | Server) =>
  (message: Message) => socket.emit('message', message);

export default (io: Server) => {
  const messages: Set<Message> = new Set();

  io.on('connection', (socket) => {
    console.log('ユーザがログインしました');

    socket.on('bye', (value: string) => {
      console.log(value);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect!', data);
    });

    socket.on('getMessages', () => {
      messages.forEach(sendMessage(socket));
    });

    socket.on('message', ({ socketId, text }: {socketId: string; text: string}) => {
      const message: Message = {
        id: uuid(),
        time: new Date(),
        user: defaultUser,
        value: text,
      };

      console.log(message);
      messages.add(message);

      sendMessage(io)(message);

      setTimeout(
        () => {
          messages.delete(message);
          io.emit('deleteMessage', message.id);
        },
        messageExpirationTimeMS,
      );
    });
  });
};
