import { Server } from 'socket.io';

type SocketId = string
type UserId = string
type SocketBook = Map<SocketId, UserId>
type numberHasSockets = number
type UserBook = Map<UserId, numberHasSockets>

const socketBook: SocketBook = new Map();
const userBook: UserBook = new Map();

export default (io: Server): void => {

  io.on('connection', (socket) => {
    console.log(`[INFO] on connection | socket.id: ${socket.id}`);
    io.to(socket.id).emit('whoareyou');

    socket.on('iam', (userId: string) => {
      console.log(`[INFO] on iam | socket.id: ${socket.id}`);
      socketBook.set(socket.id, userId);
      const prevCnt: number = userBook.get(userId) || 0;
      userBook.set(userId, prevCnt + 1);
      console.log(`userId: ${userId}`);
      console.log(`numberHasSockets: ${prevCnt + 1}`);
      console.log(socketBook);
      console.log(userBook);
    });

    socket.on('disconnect', () => {
      console.log(`[INFO] on disconnect | socket.id: ${socket.id}`);
      const userId = socketBook.get(socket.id) || null;
      if (userId) {
        socketBook.delete(socket.id);
        const prevCnt: number = userBook.get(userId) || 0;
        userBook.set(userId, prevCnt - 1);
        if (prevCnt - 1 >= 0) {
          console.log('firebase GO');
        }
        console.log(`userId: ${userId}`);
        console.log(`numberHasSockets: ${prevCnt - 1}`);
        console.log(socketBook);
        console.log(userBook);
      }
    });
  });
};
