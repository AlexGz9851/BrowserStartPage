import dotenv from 'dotenv';
import MainServer from './Server';
dotenv.config()

const server = new MainServer();
server.start();