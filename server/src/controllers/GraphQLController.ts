import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import GeneralError from '../utils/Errors/GeneralError';
import graphqlSchema from '../schemas';
import ServerError from '../utils/Errors/ServerError';

@Controller('graphql')
class GraphQLController {
  @Get()
  @Post()
  private async get(req: Request, res: Response) {
    graphqlHTTP({
      schema: graphqlSchema,
      graphiql: true,
      customFormatErrorFn: (err) => {
        if (err.originalError instanceof GeneralError) {
          return err
        }
        return new ServerError(err.message);
      }
    })(req, res);
  }

}

export default GraphQLController;