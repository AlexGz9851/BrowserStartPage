import {
  GraphQLEnumType
} from 'graphql';
import { SearchEngineType as SearchEngineTypeModel } from '../../../models/SettingsModel';

const SearchEngineType = new GraphQLEnumType({
  name: "SearchEngineType",
  values: {
    GOOGLE: { value: SearchEngineTypeModel.GOOGLE },
    DUCKDUCKGO: { value: SearchEngineTypeModel.DUCKDUCKGO },
    YAHOO: { value: SearchEngineTypeModel.YAHOO },
    BING: { value: SearchEngineTypeModel.BING },
  }
})

export default SearchEngineType;