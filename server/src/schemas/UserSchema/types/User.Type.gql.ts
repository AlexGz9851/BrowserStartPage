import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import NoteType from '../../NoteSchema/types/Note.Type.gql';
import SettingsType from '../../SettingsSchema/types/Settings.Type.gql';

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