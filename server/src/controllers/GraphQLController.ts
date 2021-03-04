import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from '../schemas';
// import UserModel from '../models/UserModel';
// import { dbManager } from '../Server';

@Controller('graphql')
class GraphQLController {
  @Get()
  @Post()
  private async get(req: Request, res: Response) {
    Logger.Info("get")
    const startTime = Date.now();
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true,
      extensions({ document, variables, operationName, result }) {
        return { runTime: Date.now() - startTime };
      }
    })(req, res);
  }

}

export default GraphQLController;

// const schema = require('./schema/schema')

// This route will be used as an endpoint to interact with Graphql,
// All queries will go through this route.
// app.use('/graphql', graphqlHTTP({
//   //directing express-graphql to use this schema to map out the graph
//   schema,
//   //directing express-graphql to use graphiql when goto '/graphql' address in the browser
//   //which provides an interface to make GraphQl queries
//   graphiql: true
// }));