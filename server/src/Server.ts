import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import AWS from 'aws-sdk';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import http from 'http';
import mongoose from 'mongoose';
import FileController from './controllers/FileController';
import GraphQLController from './controllers/GraphQLController';

class MainServer extends Server {

  private port: number | string;
  private static readonly PORT: number = 3001;
  private static readonly SERVER_START_MSG: string = 'Server started on port: ';
  private static readonly DEV_MSG: string = 'Express Server is running in development mode. ';

  constructor() {
    super(true);
    this.app.use(cors())
    this.app.use(jwt({ secret: process.env.JWT_KEY!, algorithms: ['HS256'] }),
      (req, res, next) => {
        next();
      })
    this.app.use((err: any, req: any, res: any, next: any) => {
      next();
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.port = process.env.PORT || MainServer.PORT;

    this.setupControllers();

    if (process.env.NODE_ENV !== 'production') { // for testing in development
      this.app.get('/', (req, res) => res.send(MainServer.DEV_MSG));
    }
  }

  private setupControllers(): void {
    // REGISTER CONTROLLERS
    const ctlrInstances = [
      new GraphQLController(),
      new FileController(),
    ];
    super.addControllers(ctlrInstances);
  }

  private async startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const server = new http.Server(this.app);
        server.listen(this.port);
        resolve();
      } catch (err) {
        reject(err)
      }
    })
  }

  private async configureAWS(): Promise<void> {
    return new Promise((resolve, reject) => {
      AWS.config.getCredentials(err => {
        if (err) {
          reject(err);
        } else {
          resolve()
        }
      })
    })
  }

  private async configureDB(): Promise<typeof mongoose> {
    const connection =
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}`
    return mongoose.connect(connection,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
  }

  public async start() {
    this.configureDB()
      .then(() => {
        Logger.Info('Connected succesfully to Mongo')
        return this.configureAWS();
      })
      .then(() => {
        Logger.Info('AWS configured correctly', true);
        return this.startServer();
      })
      .then(() => {
        Logger.Imp(MainServer.SERVER_START_MSG + this.port);
      })
      .catch(err => {
        Logger.Err(err)
      });
  }
}

export default MainServer;