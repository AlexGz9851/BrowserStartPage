import MainServer from './Server';
require('dotenv').config()

const server = new MainServer();
server.start();