import { Controller, Get, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from '../schemas';

@Controller('graphql')
class GraphQLController {
  @Get()
  @Post()
  private async get(req: Request, res: Response) {
    const startTime = Date.now();
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true
    })(req, res);
  }

}

export default GraphQLController;