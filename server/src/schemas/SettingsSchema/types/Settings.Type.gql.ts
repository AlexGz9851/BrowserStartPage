import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import SearchEngineType from './SearchEngine.Type.gql';


const SettingsType = new GraphQLObjectType({
  name: 'Settings',
  fields: () => ({
    searchEngine: {
      type: SearchEngineType,
      description: 'Search engine selected by the user',
    },
    googleToken: {
      type: GraphQLString,
      description: 'Token from google to read the calendar',
    },
    backgroundImage: {
      type: GraphQLString,
      description: 'Url to cdn where image is stored',
    },
  }),
});

export default SettingsType;