import { getSettings, updateSettings } from '../../models/SettingsModel';
import SettingsInputType from './types/SettingsInput.Type.gql';
import SettingsType from './types/Settings.Type.gql';


const query = {
  settings: {
    type: SettingsType,
    args: {},
    resolve: (root: any, args: any, request: any) => getSettings(request)
  },
};

const mutation = {
  updateSettings: {
    type: SettingsType,
    args: {
      settings: { type: SettingsInputType }
    },
    resolve: (obj: any, { settings }: any, request: any) => updateSettings(request, settings)
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