import { login, signUp } from '../../models/UserModel';
import LoginInputType from './types/LoginInput.Type.gql';
import SessionOutputType from './types/SessionOutput.Type.gql';
import SignUpInputType from './types/SignUpInput.Type.gql';
import UserType from './types/User.Type.gql'

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