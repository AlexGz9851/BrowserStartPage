import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import SettingsType from '../../SettingsSchema/types/SettingsType.gql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString)
    },
    settings: {
      type: GraphQLNonNull(SettingsType)
    }
  }),
});

export default UserType;