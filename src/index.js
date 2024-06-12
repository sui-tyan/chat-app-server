import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import { chatIdPool } from './utils/chatIdHandler.js';
import { SocketAddress } from 'net';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(morgan('dev'));

io.on('connection', (socket) => {
  socket.on('user-connected', (uuid) => {
    chatIdPool.set(uuid, socket.id);
    console.log('connected');
    console.log(chatIdPool.entries());
  });
  socket.on('send-message', (message) => {
    console.log(message);
    io.to(message.socketId).emit('receive-message', message.message);
  });
});

app.get('/all-convo', (req, res) => {
  res.send({ pool: chatIdPool.entries() });
});

server.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});
