import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { login, signUp, IUser } from '../models/UserModel';
import SettingsSchema from './SettingsSchema';

const UserType = new GraphQLObjectType({
  name: 'UserData',
  fields: () => ({
    username: {
      type: GraphQLString
    },
    settings: {
      type: SettingsSchema.types[0]
    }
  }),
});

const OutputType = new GraphQLObjectType({
  name: "UserLogin",
  fields: () => ({
    jwt: { type: GraphQLString },
    user: { type: UserType }
  })
})

const query = {
  login: {
    type: OutputType,
    args: {
      username: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: (root: any, { username, password }: IUser) => login(username, password)
  },
};

const mutation = {
  signUp: {
    type: OutputType,
    args: {
      username: {
        type: GraphQLString
      },
      password: {
        type: GraphQLString
      }
    },
    resolve: (obj: any, args: any) => signUp(args)
  },
};

const subscription = {

};

const UserSchema = {
  query,
  mutation,
  subscription,
  types: [UserType]
};

export default UserSchema;