import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { addUser, getUserById, getUserByUsername, getUsers, IUser } from '../models/UserModel';

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Auth user',
  fields: () => ({
    username: {
      type: GraphQLString,
      description: 'The username',
    },
    password: {
      type: GraphQLString,
      description: 'The password',
    },
  }),
});

const query = {
  users: {
    type: new GraphQLList(userType),
    args: {
      limit: {
        description: 'limit items in the results',
        type: GraphQLInt
      }
    },
    resolve: (root: any, { limit }: any) => getUsers(limit)
  },
  userByUsername: {
    type: userType,
    args: {
      username: {
        description: 'find by username',
        type: GraphQLString
      }
    },
    resolve: (root: any, { username }: any) => getUserByUsername(username)
  },
};

const mutation = {
  addUser: {
    type: userType,
    args: {
      username: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      },
    },
    resolve: (obj: any, input: IUser) => addUser(input)
  },
};

const subscription = {

};

const UserSchema = {
  query,
  mutation,
  subscription,
  types: [userType]
};

export default UserSchema;