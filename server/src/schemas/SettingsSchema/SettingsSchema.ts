import { updateSettings } from '../../models/SettingsModel';
import SettingsInputType from './types/SettingsInputType.gql';
import SettingsType from './types/SettingsType.gql';


const query = {};

const mutation = {
  updateSettings: {
    type: SettingsType,
    args: {
      settings: { type: SettingsInputType }
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