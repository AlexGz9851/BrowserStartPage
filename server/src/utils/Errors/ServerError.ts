import GeneralError from './GeneralError';

class ServerError extends GeneralError {
  static code = 'SE'
  constructor(serverMessage: string) {
    super('There was a problem in our side if you continue to see this error please report the bug with the code at the beginning',
      serverMessage, ServerError.code)
  }
}

export default ServerError;