import GeneralError from './GeneralError';

class ClientError extends GeneralError {
  static code = "CE"
  constructor(message: string) {
    super(message, "Client Error", ClientError.code, false)
  }
}

export default ClientError;