import {
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { ISettings, SearchEngineType, updateSettings } from '../models/SettingsModel';

const GraphQLSearchEngineType = new GraphQLEnumType({
  name: "SearchEngineType",
  values: {
    GOOGLE: { value: SearchEngineType.GOOGLE },
    DUCKDUCKGO: { value: SearchEngineType.DUCKDUCKGO },
    YAHOO: { value: SearchEngineType.YAHOO },
    BING: { value: SearchEngineType.BING },
  }
})

const SettingsType = new GraphQLObjectType({
  name: 'Settings',
  fields: () => ({
    searchEngine: {
      type: GraphQLSearchEngineType,
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

const query = {};

const mutation = {
  updateSettings: {
    type: SettingsType,
    args: {
      searchEngine: {
        type: GraphQLSearchEngineType,
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
    },
    resolve: (obj: any, args: any, request: any) => updateSettings(request, args)
  },
};

const subscription = {};

const SettingsSchema = {
  query,
  mutation,
  subscription,
  types: [SettingsType]
};

export default SettingsSchema;