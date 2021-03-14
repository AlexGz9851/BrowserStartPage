import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'express-jwt';
import http from 'http';
import mongoose from 'mongoose';
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
    ];
    super.addControllers(ctlrInstances);
  }

  private configureDB(callback: any): void {
    const connection =
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}`
    mongoose.connect(connection,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        Logger.Info('Connected succesfully to Mongo')
        callback();
      }).catch(err => {
        Logger.Err(err)
      });
  }

  public start(): void {
    this.configureDB(() => {
      const server = new http.Server(this.app);
      server.listen(this.port, () => {
        Logger.Imp(MainServer.SERVER_START_MSG + this.port);
      });
    })
  }
}

export default MainServer;