import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import UserType from './UserType.gql';

const SessionOutputType = new GraphQLObjectType({
  name: "UserData",
  fields: () => ({
    jwt: { type: GraphQLNonNull(GraphQLString) },
    user: { type: GraphQLNonNull(UserType) }
  })
})

export default SessionOutputType;