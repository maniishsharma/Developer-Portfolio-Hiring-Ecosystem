import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';
import { initSocket } from './socket/index.js';

const port = process.env.PORT || 5000;

await connectDB();
initCloudinary();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});
initSocket(io);

server.listen(port, () => {
  console.log(`DevConnect AI server running on port ${port}`);
});
