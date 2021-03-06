import { login, signUp } from '../../models/UserModel';
import UserType from './types/UserType.gql'
import LoginInputType from './types/LoginInputType.gql';
import SignUpInputType from './types/SignUpInputType.gql';
import SessionOutputType from './types/SessionOutputType.gql';

const query = {
  login: {
    type: SessionOutputType,
    args: {
      user: { type: LoginInputType }
    },
    resolve: (root: any, { user }: any) => login(user.username, user.password)
  },
};

const mutation = {
  signUp: {
    type: SessionOutputType,
    args: {
      user: { type: SignUpInputType }
    },
    resolve: (obj: any, { user }: any) => signUp(user)
  },
};

const subscription = {};

const UserSchema = {
  query,
  mutation,
  subscription,
  types: [UserType]
};

export default UserSchema;