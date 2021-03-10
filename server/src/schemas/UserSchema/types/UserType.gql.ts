import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import NoteType from '../../NoteSchema/types/NoteType.gql';
import SettingsType from '../../SettingsSchema/types/SettingsType.gql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString)
    },
    settings: {
      type: GraphQLNonNull(SettingsType)
    },
    notes: {
      type: GraphQLList(NoteType)
    }
  }),
});

export default UserType;